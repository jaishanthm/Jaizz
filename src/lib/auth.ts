import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, loginRateLimit } from "@/lib/rate-limit";

// Phase 1 §5 RBAC + Phase 1 §12 auth requirements implemented here.
// Session carries roleId so permission checks (Phase 4 §2, Phase 9 §6) can
// resolve without an extra DB round-trip on every request.

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        // Stage 7 — brute-force rate limiting, closing out the Phase 1
        // §12/§44 requirement that was left as a TODO through Stage 3.
        // NextAuth v4's authorize() receives the raw request as the second
        // arg, which is where the IP has to come from — there's no req
        // object available inside `callbacks`, so this check has to live
        // here specifically, not moved to a shared middleware step.
        const ip = (req?.headers?.["x-forwarded-for"] as string | undefined) ?? "unknown";
        const ipHash = crypto.createHash("sha256").update(ip).digest("hex");
        const { allowed } = await checkRateLimit(loginRateLimit, ipHash);
        if (!allowed) return null; // NextAuth surfaces this as a generic invalid-credentials error either way

        const user = await prisma.adminUser.findUnique({
          where: { email: credentials.email },
          include: { role: true },
        });
        if (!user || !user.active) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        await prisma.adminUser.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
        await prisma.auditLog.create({
          data: { userId: user.id, action: "LOGIN", entityType: "AdminUser", entityId: user.id },
        });

        return { id: user.id, name: user.name, email: user.email, roleKey: user.role.key };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.roleKey = (user as unknown as { roleKey: string }).roleKey;
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as typeof session.user & { roleKey?: string }).roleKey =
          token.roleKey as string;
      }
      return session;
    },
  },
};
