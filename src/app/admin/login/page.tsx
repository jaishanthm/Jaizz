"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

// Deliberately outside the middleware-protected /admin/:path* matcher scope
// in effect (NextAuth's own redirect handles the unauthenticated case, and
// this page itself must stay reachable while logged out — see middleware.ts
// `pages.signIn`).

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
      return;
    }
    router.push("/admin");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 sm:px-6 bg-[#09090b] relative overflow-hidden font-sans selection:bg-red-500 selection:text-white">
      {/* Background crimson ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-20 blur-[140px]"
        style={{ background: "radial-gradient(circle, var(--color-signal-darkest, rgba(239, 68, 68, 0.6)) 0%, transparent 70%)" }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Terminal Window Box */}
        <div className="admin-card overflow-hidden border border-white/[0.1] shadow-2xl">
          {/* Terminal Title Bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.08] bg-black/50">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            </div>
            <div className="text-[11px] font-mono text-zinc-400 font-semibold tracking-wider">
              auth_gateway // c2_login
            </div>
            <div className="text-[10px] font-mono text-zinc-600 uppercase">SSH-256</div>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
            <div className="space-y-1 pb-2 border-b border-white/[0.06]">
              <div className="flex items-center gap-2 text-xs font-mono text-red-400 font-bold uppercase tracking-widest">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>RESTRICTED ACCESS</span>
              </div>
              <h1 className="text-xl font-bold text-white tracking-tight">Jaishanth M. — C2 Admin</h1>
              <p className="text-xs text-zinc-400 font-mono">
                Enter your administrative credentials to authorize console operations.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Operator Identity (Email)
                </label>
                <input
                  type="email"
                  required
                  placeholder="operator@security-ops.lab"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="admin-input font-mono text-sm"
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-wider">
                  Access Key (Password)
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-input font-mono text-sm"
                  autoComplete="current-password"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-950/50 border border-red-500/40 text-xs font-mono text-red-300 flex items-center gap-2 animate-shake">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full admin-btn-primary !py-3 !text-xs tracking-widest font-mono font-bold"
            >
              {loading ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>VERIFYING CREDENTIALS...</span>
                </>
              ) : (
                <>
                  <span>AUTHORIZE & ENTER CONSOLE</span>
                  <span>→</span>
                </>
              )}
            </button>

            <div className="pt-2 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>RATE-LIMITING: ACTIVE</span>
              <a href="/" className="text-zinc-400 hover:text-white transition-colors">
                ← Return to Public Site
              </a>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
