import crypto from "crypto";
import { prisma } from "@/lib/prisma";

// QA fix: replaces the earlier stateless HMAC-signed token, which had an
// expiry but no way to be invalidated after first use — a signed token
// with an expiry is not automatically one-time. This version generates a
// random opaque token, stores only its SHA-256 hash (with the InviteToken
// row from schema.prisma), and marks it used on successful password set.
// The raw token exists only in the URL handed to the admin — never
// persisted anywhere.

const EXPIRY_MS = 24 * 60 * 60 * 1000; // 24 hours

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createInviteToken(userId: string): Promise<string> {
  const rawToken = crypto.randomBytes(32).toString("base64url"); // 256 bits of entropy
  await prisma.inviteToken.create({
    data: {
      tokenHash: hashToken(rawToken),
      userId,
      expiresAt: new Date(Date.now() + EXPIRY_MS),
    },
  });
  return rawToken;
}

export async function consumeInviteToken(rawToken: string): Promise<{ userId: string } | null> {
  const tokenHash = hashToken(rawToken);

  // Single atomic updateMany, not read-then-write — a findUnique followed
  // by a separate update leaves a gap where two concurrent requests could
  // both read usedAt=null before either writes. The WHERE clause itself
  // (usedAt: null, expiresAt in the future) is the enforcement point: only
  // one concurrent call can match and update the row.
  const result = await prisma.inviteToken.updateMany({
    where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
    data: { usedAt: new Date() },
  });
  if (result.count === 0) return null;

  const record = await prisma.inviteToken.findUniqueOrThrow({ where: { tokenHash }, include: { user: true } });
  if (!record.user.active) return null;

  return { userId: record.userId };
}
