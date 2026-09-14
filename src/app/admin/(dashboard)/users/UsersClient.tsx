"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { inviteUser, deactivateUser } from "@/lib/actions/users";
import { useToast } from "@/components/admin/ToastProvider";
import ConfirmButton from "@/components/admin/ConfirmButton";

type User = {
  id: string;
  name: string;
  email: string;
  active: boolean;
  lastLoginAt: Date | null;
  role: { key: string };
};

export default function UsersClient({ users }: { users: User[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState<{
    name: string;
    email: string;
    roleKey: "ADMIN" | "EDITOR" | "VIEWER";
  }>({ name: "", email: "", roleKey: "EDITOR" });
  const [inviteUrl, setInviteUrl] = useState("");
  const [inviting, setInviting] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviting(true);
    const res = await inviteUser(form);
    setInviting(false);
    if (!res.success) {
      toast(res.error || "Failed to generate invite", "error");
      return;
    }
    setInviteUrl(`${window.location.origin}${res.data.inviteUrl}`);
    setForm({ name: "", email: "", roleKey: "EDITOR" });
    toast("Operator invitation link provisioned", "success");
    router.refresh();
  }

  async function handleDeactivate(id: string) {
    const res = await deactivateUser(id);
    if (!res.success) {
      toast(res.error || "Failed to deactivate operator", "error");
    } else {
      toast("Operator credentials revoked", "success");
    }
    router.refresh();
  }

  function copyInviteLink() {
    if (!inviteUrl) return;
    navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    toast("Invite URL copied to clipboard", "success");
    setTimeout(() => setCopied(false), 3000);
  }

  const activeCount = users.filter((u) => u.active).length;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div>
          <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
            IDENTITY // ROLE-BASED ACCESS CONTROL (RBAC)
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
            Operator Management & Credentials
          </h1>
        </div>
        <div className="text-xs font-mono text-zinc-400 bg-white/[0.04] px-3 py-1.5 rounded-lg border border-white/[0.08] w-fit">
          ACTIVE OPERATORS: <span className="text-emerald-400 font-bold">{activeCount}</span> /{" "}
          <span className="text-zinc-300">{users.length}</span>
        </div>
      </div>

      {/* Invite Form */}
      <form onSubmit={handleInvite} className="admin-card p-5">
        <span className="text-[11px] font-mono tracking-wider text-zinc-400 uppercase font-semibold block mb-3">
          + PROVISION NEW OPERATOR CREDENTIALS
        </span>
        <div className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="w-full sm:w-1/3 space-y-1">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              required
              placeholder="e.g. Alex Vance"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="admin-input text-xs"
            />
          </div>

          <div className="w-full sm:flex-1 space-y-1">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="email"
              placeholder="operator@security-ops.internal"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="admin-input text-xs font-mono"
            />
          </div>

          <div className="w-full sm:w-36 space-y-1">
            <label className="block text-[11px] font-mono text-zinc-400 uppercase">
              Assigned Role
            </label>
            <select
              value={form.roleKey}
              onChange={(e) =>
                setForm({ ...form, roleKey: e.target.value as typeof form.roleKey })
              }
              className="admin-input text-xs font-mono bg-[#111116]"
            >
              <option value="ADMIN">ADMIN (C2)</option>
              <option value="EDITOR">EDITOR</option>
              <option value="VIEWER">VIEWER</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={inviting}
            className="admin-btn-primary text-xs py-2 px-5 whitespace-nowrap"
          >
            {inviting ? "GENERATING..." : "GENERATE INVITE"}
          </button>
        </div>
      </form>

      {/* Generated Invite Alert */}
      {inviteUrl && (
        <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-xs font-mono text-emerald-300 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ONE-TIME ACTIVATION LINK GENERATED (EXPIRES IN 24H)</span>
            </div>
            <button
              onClick={copyInviteLink}
              className="px-3 py-1 rounded bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-200 transition-colors"
            >
              {copied ? "COPIED TO CLIPBOARD ✓" : "COPY LINK 📋"}
            </button>
          </div>
          <div className="p-2.5 rounded bg-black/50 border border-emerald-500/20 text-[11px] break-all text-zinc-300 select-all">
            {inviteUrl}
          </div>
          <p className="text-[11px] text-zinc-400">
            Transmit this URL directly to the operator over a secure channel. No external mail relay is required.
          </p>
        </div>
      )}

      {/* Operators Table */}
      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b border-white/[0.08] flex items-center justify-between">
          <span className="text-xs font-mono text-zinc-300 font-semibold uppercase tracking-wider">
            REGISTERED OPERATOR DIRECTORY
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            ENFORCED VIA ARGON2ID &amp; JWT SESSION TOKENS
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/[0.08] text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Operator Name &amp; Email</th>
                <th className="py-3 px-4 text-center">Assigned Role</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Last Active</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-white text-sm">{u.name}</div>
                    <div className="text-[11px] text-zinc-400">{u.email}</div>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold tracking-wider ${
                        u.role.key === "ADMIN"
                          ? "bg-red-500/10 text-red-400 border border-red-500/30"
                          : u.role.key === "EDITOR"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/30"
                          : "bg-zinc-800 text-zinc-300 border border-white/[0.08]"
                      }`}
                    >
                      {u.role.key}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          u.active ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" : "bg-zinc-600"
                        }`}
                      />
                      <span className={u.active ? "text-emerald-400 font-semibold" : "text-zinc-500"}>
                        {u.active ? "ACTIVE" : "REVOKED"}
                      </span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 text-center text-zinc-400">
                    {u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleString() : "Never"}
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {u.active && (
                      <ConfirmButton
                        itemLabel={`access for ${u.name}`}
                        onConfirm={() => handleDeactivate(u.id)}
                      />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
