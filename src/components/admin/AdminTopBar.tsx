import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function AdminTopBar() {
  const session = await getServerSession(authOptions);

  return (
    <div
      className="flex items-center justify-between px-6 py-4"
      style={{ borderBottom: "1px solid var(--color-border)" }}
    >
      <Link href="/" target="_blank" className="text-sm" style={{ color: "var(--color-primary)" }}>
        View live site ↗
      </Link>
      <div className="flex items-center gap-4 text-sm">
        <span>{session?.user?.name}</span>
        <span
          className="px-2 py-0.5 rounded-full text-xs"
          style={{ background: "var(--color-bg-card)", color: "var(--color-signal)" }}
        >
          {(session?.user as { roleKey?: string } | undefined)?.roleKey}
        </span>
        <Link href="/api/auth/signout">Log out</Link>
      </div>
    </div>
  );
}
