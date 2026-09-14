import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function AdminTopBar() {
  const session = await getServerSession(authOptions);
  const roleKey = (session?.user as { roleKey?: string } | undefined)?.roleKey || "ADMIN";

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between px-6 py-3.5 bg-[#0a0a0d]/85 backdrop-blur-xl border-b border-white/[0.08]">
      {/* System Telemetry Pulse */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] font-mono text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-semibold tracking-wider uppercase">NODE ONLINE</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-500">
          <span>{"//"}</span>
          <span>C2 ENVIRONMENT: PRODUCTION</span>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-4 text-xs font-mono">
        <Link
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="admin-btn-secondary !py-1.5 !px-3 text-xs tracking-wider"
        >
          <span>VIEW LIVE SITE</span>
          <span className="text-red-400">↗</span>
        </Link>

        <div className="hidden md:flex items-center gap-2 pl-3 border-l border-white/[0.08]">
          <span className="text-zinc-300 font-sans font-medium">{session?.user?.name || "Operator"}</span>
          <span className="px-2 py-0.5 rounded bg-zinc-800/80 border border-white/10 text-[10px] text-zinc-300 font-bold">
            {roleKey}
          </span>
        </div>

        <Link
          href="/api/auth/signout"
          className="text-zinc-400 hover:text-red-400 transition-colors hidden sm:inline-block"
        >
          LOG OUT
        </Link>
      </div>
    </header>
  );
}
