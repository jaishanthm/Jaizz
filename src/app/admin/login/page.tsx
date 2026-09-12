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
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <form onSubmit={handleSubmit} className="glass-card w-full max-w-sm p-8">
        <h1 className="text-2xl mb-6">Admin Login</h1>
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 px-4 py-3 rounded-md bg-transparent"
          style={{ border: "1px solid var(--color-border)" }}
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-3 rounded-md bg-transparent"
          style={{ border: "1px solid var(--color-border)" }}
        />
        {error && <p className="mb-4 text-sm" style={{ color: "#f87171" }}>{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full px-6 py-3 rounded-full"
          style={{ background: "var(--color-primary)", color: "white" }}
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        {/* Rate limiting (Phase 1 §12/§44) is enforced server-side in
            src/lib/auth.ts's authorize() — nothing needed here, the form
            just gets a generic invalid-credentials error either way,
            deliberately not distinguishing "wrong password" from
            "rate limited" to avoid leaking which case applies. */}
      </form>
    </main>
  );
}
