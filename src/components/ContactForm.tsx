"use client";

import { useState } from "react";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    const form = new FormData(e.currentTarget);
    const body = {
      name: form.get("name"),
      email: form.get("email"),
      subject: form.get("subject"),
      message: form.get("message"),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Transmission failed. Please verify fields.");
      setStatus("success");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Transmission failed. Please verify fields.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="p-8 rounded-lg border border-emerald-900/40 bg-emerald-950/15 text-center">
        <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-4 font-mono font-bold text-lg">
          ✓
        </div>
        <h3 className="font-editorial text-2xl font-bold text-white mb-2">
          Transmission Received
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)] font-sans">
          Your dispatch has been delivered. I will review and establish contact within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block font-mono text-xs text-zinc-400 mb-2 uppercase tracking-wider">
          Sender / Organization Name
        </label>
        <input
          name="name"
          required
          placeholder="e.g. Alex Vance"
          className="w-full px-4 py-3 rounded-sm bg-zinc-950 border border-[var(--color-border)] text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--color-signal-red)] transition-all font-sans"
        />
      </div>

      <div>
        <label className="block font-mono text-xs text-zinc-400 mb-2 uppercase tracking-wider">
          Return Transmission Email
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="e.g. alex@security-firm.com"
          className="w-full px-4 py-3 rounded-sm bg-zinc-950 border border-[var(--color-border)] text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--color-signal-red)] transition-all font-sans"
        />
      </div>

      <div>
        <label className="block font-mono text-xs text-zinc-400 mb-2 uppercase tracking-wider">
          Classification / Subject
        </label>
        <input
          name="subject"
          required
          placeholder="e.g. Security Research Collaboration / Vulnerability Inquiry"
          className="w-full px-4 py-3 rounded-sm bg-zinc-950 border border-[var(--color-border)] text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--color-signal-red)] transition-all font-sans"
        />
      </div>

      <div>
        <label className="block font-mono text-xs text-zinc-400 mb-2 uppercase tracking-wider">
          Transmission Payload
        </label>
        <textarea
          name="message"
          required
          minLength={10}
          rows={5}
          placeholder="Enter details, project scope, vulnerability context, or engagement parameters..."
          className="w-full px-4 py-3 rounded-sm bg-zinc-950 border border-[var(--color-border)] text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-[var(--color-signal-red)] transition-all font-sans"
        />
      </div>

      {status === "error" && (
        <div className="p-3 rounded-sm bg-red-950/40 border border-red-900/50 text-xs font-mono text-red-300">
          ⚠️ {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-editorial-primary w-full py-3.5 px-6 rounded-sm font-mono text-xs font-semibold uppercase tracking-wider disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
      >
        {status === "loading" ? (
          <>
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>TRANSMITTING DISPATCH...</span>
          </>
        ) : (
          <span>TRANSMIT DISPATCH →</span>
        )}
      </button>
    </form>
  );
}
