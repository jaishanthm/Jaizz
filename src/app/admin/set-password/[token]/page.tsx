"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { setPasswordFromInvite } from "@/lib/actions/users";

// Deliberately outside the normal authenticated flow — a brand-new invited
// user has no session yet. src/middleware.ts's authorized callback has an
// explicit exemption for this path (fixed alongside this page, not left
// broken).

export default function SetPasswordPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = use(params);
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError("Passwords don't match."); return; }
    const res = await setPasswordFromInvite(token, password);
    if (!res.success) { setError(res.error); return; }
    setDone(true);
    setTimeout(() => router.push("/admin/login"), 2000);
  }

  if (done) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: "var(--color-bg-primary)" }}>
        <p>Password set — redirecting to login…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6" style={{ background: "var(--color-bg-primary)" }}>
      <form onSubmit={handleSubmit} className="glass-card w-full max-w-sm p-8">
        <h1 className="text-2xl mb-6">Set your password</h1>
        <input type="password" required minLength={12} placeholder="New password (12+ characters)" value={password} onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 px-4 py-3 rounded-md bg-transparent" style={{ border: "1px solid var(--color-border)" }} />
        <input type="password" required placeholder="Confirm password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-md bg-transparent" style={{ border: "1px solid var(--color-border)" }} />
        {error && <p className="mb-4 text-sm" style={{ color: "#f87171" }}>{error}</p>}
        <button type="submit" className="w-full px-6 py-3 rounded-full" style={{ background: "var(--color-primary)", color: "white" }}>Set password</button>
      </form>
    </main>
  );
}
