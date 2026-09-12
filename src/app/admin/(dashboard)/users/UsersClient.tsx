"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { inviteUser, deactivateUser } from "@/lib/actions/users";
import { useToast } from "@/components/admin/ToastProvider";

type User = { id: string; name: string; email: string; active: boolean; lastLoginAt: Date | null; role: { key: string } };

export default function UsersClient({ users }: { users: User[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [form, setForm] = useState<{ name: string; email: string; roleKey: "ADMIN" | "EDITOR" | "VIEWER" }>({ name: "", email: "", roleKey: "EDITOR" });
  const [inviteUrl, setInviteUrl] = useState("");

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    const res = await inviteUser(form);
    if (!res.success) { toast(res.error, "error"); return; }
    setInviteUrl(`${window.location.origin}${res.data.inviteUrl}`);
    setForm({ name: "", email: "", roleKey: "EDITOR" });
    router.refresh();
  }

  async function handleDeactivate(id: string) {
    const res = await deactivateUser(id);
    if (!res.success) toast(res.error, "error");
    router.refresh();
  }

  return (
    <>
      <h1 className="text-2xl mb-6">Users</h1>

      <form onSubmit={handleInvite} className="flex gap-2 mb-4 flex-wrap">
        <input required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
        <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
        <select value={form.roleKey} onChange={(e) => setForm({ ...form, roleKey: e.target.value as typeof form.roleKey })} className="px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }}>
          <option value="ADMIN">Admin</option>
          <option value="EDITOR">Editor</option>
          <option value="VIEWER">Viewer</option>
        </select>
        <button type="submit" className="px-4 py-2 rounded-full text-sm" style={{ background: "var(--color-primary)", color: "white" }}>Invite</button>
      </form>

      {inviteUrl && (
        <div className="glass-card p-4 mb-8 text-sm">
          <p style={{ color: "var(--color-signal)" }}>
            Invite created — no email service is configured, so copy this one-time setup link and send it yourself (expires in 24h):
          </p>
          <code className="block mt-2 break-all">{inviteUrl}</code>
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr style={{ borderBottom: "1px solid var(--color-border)" }}><th className="text-left p-3">Name</th><th className="text-left p-3">Role</th><th className="text-left p-3">Status</th><th className="text-left p-3">Last login</th><th className="text-right p-3">Actions</th></tr></thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td className="p-3">{u.name} <span style={{ color: "var(--color-text-muted)" }}>({u.email})</span></td>
                <td className="p-3">{u.role.key}</td>
                <td className="p-3" style={{ color: u.active ? "var(--color-signal)" : "var(--color-text-muted)" }}>{u.active ? "Active" : "Deactivated"}</td>
                <td className="p-3" style={{ color: "var(--color-text-muted)" }}>{u.lastLoginAt ? new Date(u.lastLoginAt).toLocaleDateString() : "Never"}</td>
                <td className="p-3 text-right">
                  {u.active && <button onClick={() => handleDeactivate(u.id)} className="text-xs" style={{ color: "#f87171" }}>Deactivate</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
