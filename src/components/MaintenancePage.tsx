import React from "react";

export default function MaintenancePage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden"
      style={{
        background: "var(--color-bg-primary)",
        color: "var(--color-text-primary)",
      }}
    >
      <meta name="robots" content="noindex" />
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-lg w-full text-center space-y-6 p-8 rounded-2xl border border-white/10 backdrop-blur-md bg-white/5 shadow-2xl">
        <h1 className="text-4xl font-[var(--font-heading)] font-bold tracking-tight">
          Under Maintenance
        </h1>
        <p className="text-lg opacity-80" style={{ color: "var(--color-text-secondary)" }}>
          I am currently performing some scheduled updates to the site. Please check back shortly.
        </p>
        <div className="w-16 h-1 mx-auto rounded bg-gradient-to-r from-blue-500 to-purple-500" />
      </div>
    </div>
  );
}
