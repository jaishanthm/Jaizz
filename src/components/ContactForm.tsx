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
      <div className="glass-panel-elevated p-8 rounded-2xl border border-emerald-500/40 text-center">
        <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto mb-4 font-mono font-bold text-xl">
          ✓
        </div>
        <h3 className="font-heading text-xl font-bold text-[var(--color-text-primary)] mb-2">
          Transmission Received
        </h3>
        <p className="text-sm text-[var(--color-text-secondary)] font-sans">
          Your secure dispatch has been logged. I will review and establish contact shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block font-mono text-xs text-[var(--color-cool-cyan)] mb-1.5 uppercase">
          Agent / Researcher Name
        </label>
        <input
          name="name"
          required
          placeholder="e.g. Alex Vance"
          className="w-full px-4 py-3 rounded-xl bg-[rgba(11,17,32,0.8)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-cool-cyan)] focus:ring-1 focus:ring-[var(--color-cool-cyan)] transition-all font-sans"
        />
      </div>

      <div>
        <label className="block font-mono text-xs text-[var(--color-cool-cyan)] mb-1.5 uppercase">
          Reply Transmission Email
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="e.g. alex@security-firm.com"
          className="w-full px-4 py-3 rounded-xl bg-[rgba(11,17,32,0.8)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-cool-cyan)] focus:ring-1 focus:ring-[var(--color-cool-cyan)] transition-all font-sans"
        />
      </div>

      <div>
        <label className="block font-mono text-xs text-[var(--color-cool-cyan)] mb-1.5 uppercase">
          Subject / Classification
        </label>
        <input
          name="subject"
          required
          placeholder="e.g. Vulnerability Inquiry / Collaboration"
          className="w-full px-4 py-3 rounded-xl bg-[rgba(11,17,32,0.8)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-cool-cyan)] focus:ring-1 focus:ring-[var(--color-cool-cyan)] transition-all font-sans"
        />
      </div>

      <div>
        <label className="block font-mono text-xs text-[var(--color-cool-cyan)] mb-1.5 uppercase">
          Message Payload
        </label>
        <textarea
          name="message"
          required
          minLength={10}
          rows={5}
          placeholder="Enter message details, program context, or engagement scope..."
          className="w-full px-4 py-3 rounded-xl bg-[rgba(11,17,32,0.8)] border border-[var(--color-border)] text-sm text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-cool-cyan)] focus:ring-1 focus:ring-[var(--color-cool-cyan)] transition-all font-sans"
        />
      </div>

      {status === "error" && (
        <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-xs font-mono text-red-400">
          ⚠️ {errorMsg}
        </div>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-magnetic w-full py-3.5 px-6 rounded-xl font-mono text-sm font-semibold text-white bg-[var(--color-electric-blue)] hover:bg-[var(--color-primary-hover)] transition-all shadow-[0_0_20px_rgba(43,108,255,0.4)] disabled:opacity-50 border border-[rgba(255,255,255,0.15)] flex items-center justify-center gap-2"
      >
        {status === "loading" ? (
          <>
            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
            <span>ENCRYPTING & TRANSMITTING...</span>
          </>
        ) : (
          <span>TRANSMIT DISPATCH →</span>
        )}
      </button>
    </form>
  );
}
