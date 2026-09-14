"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toggleInquiryRead, deleteInquiry } from "@/lib/actions/inquiries";
import { useToast } from "@/components/admin/ToastProvider";
import ConfirmButton from "@/components/admin/ConfirmButton";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  ipHash: string | null;
  createdAt: Date;
};

export default function InquiriesClient({ messages }: { messages: Message[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  async function handleToggleRead(id: string, currentRead: boolean) {
    const res = await toggleInquiryRead(id, !currentRead);
    if (!res.success) {
      toast(res.error || "Failed to update transmission status", "error");
    } else {
      toast(currentRead ? "Marked as unread" : "Marked as read", "success");
    }
    router.refresh();
  }

  async function handleDelete(id: string) {
    const res = await deleteInquiry(id);
    if (!res.success) {
      toast(res.error || "Failed to delete transmission", "error");
    } else {
      toast("Transmission purged from inbox", "success");
    }
    router.refresh();
  }

  const unreadCount = messages.filter((m) => !m.read).length;
  const filtered = filter === "unread" ? messages.filter((m) => !m.read) : messages;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
            COMMS // INTERCEPTED TRANSMISSIONS &amp; CONTACT INBOX
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Incoming Inquiries &amp; Messages
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-zinc-400 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.08]">
            UNREAD MESSAGES:{" "}
            <span className={unreadCount > 0 ? "text-red-400 font-bold" : "text-emerald-400 font-bold"}>
              {unreadCount}
            </span>{" "}
            / <span className="text-zinc-300">{messages.length}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
            filter === "all"
              ? "bg-red-500/20 text-red-400 border border-red-500/40 font-semibold"
              : "bg-white/[0.03] text-zinc-400 hover:text-white border border-white/[0.08]"
          }`}
        >
          ALL TRANSMISSIONS ({messages.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-colors ${
            filter === "unread"
              ? "bg-red-500/20 text-red-400 border border-red-500/40 font-semibold"
              : "bg-white/[0.03] text-zinc-400 hover:text-white border border-white/[0.08]"
          }`}
        >
          UNREAD ONLY ({unreadCount})
        </button>
      </div>

      {/* Message Stream */}
      <div className="space-y-4">
        {filtered.map((msg) => (
          <div
            key={msg.id}
            className={`admin-card p-5 space-y-3 transition-all ${
              !msg.read
                ? "border-red-500/40 bg-[#120e11]/80 shadow-[0_0_20px_var(--glass-border-glow)]"
                : "border-white/[0.08]"
            }`}
          >
            {/* Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <span
                  className={`w-2 h-2 rounded-full ${
                    !msg.read ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse" : "bg-zinc-600"
                  }`}
                />
                <span className="font-bold text-white text-sm">{msg.name}</span>
                <span className="text-xs font-mono text-zinc-400">&lt;{msg.email}&gt;</span>
                {!msg.read && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-500/20 text-red-400 border border-red-500/30 uppercase font-semibold">
                    NEW
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[11px] font-mono text-zinc-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Subject */}
            <div className="font-semibold text-zinc-200 text-sm">
              <span className="text-xs font-mono text-zinc-500 uppercase mr-2">SUBJECT:</span>
              {msg.subject}
            </div>

            {/* Message Body */}
            <div className="p-3.5 rounded-lg bg-black/40 border border-white/[0.04] text-xs font-mono leading-relaxed text-zinc-300 whitespace-pre-wrap">
              {msg.message}
            </div>

            {/* Actions Bar */}
            <div className="pt-2 flex items-center justify-between">
              <div className="text-[10px] font-mono text-zinc-600">
                CLIENT IP HASH: {msg.ipHash ? msg.ipHash.slice(0, 12) + "…" : "ANONYMOUS"}
              </div>

              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                  className="px-3 py-1 rounded bg-white/[0.04] border border-white/[0.08] hover:border-white/20 text-xs font-mono text-zinc-300 hover:text-white transition-colors"
                >
                  REPLY VIA EMAIL ✉
                </a>

                <button
                  type="button"
                  onClick={() => handleToggleRead(msg.id, msg.read)}
                  className={`px-3 py-1 rounded border text-xs font-mono transition-colors ${
                    msg.read
                      ? "bg-white/[0.02] border-white/[0.08] text-zinc-400 hover:text-zinc-200"
                      : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                  }`}
                >
                  {msg.read ? "MARK AS UNREAD" : "MARK AS READ ✓"}
                </button>

                <ConfirmButton
                  itemLabel={`inquiry from ${msg.name}`}
                  onConfirm={() => handleDelete(msg.id)}
                />
              </div>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="admin-card p-12 text-center text-xs font-mono text-zinc-500">
            {filter === "unread"
              ? "All transmissions have been marked as read. Inbox zero maintained."
              : "No incoming contact messages received yet."}
          </div>
        )}
      </div>
    </div>
  );
}
