"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { useToast } from "@/components/admin/ToastProvider";
import {
  createBugBountyProfile, deleteBugBountyProfile, setBugBountyProfileVisible,
  createBugBountyFinding, deleteBugBountyFinding, setBugBountyFindingVisible,
} from "@/lib/actions/bug-bounty";

type Finding = { id: string; title: string; visible: boolean };
type Profile = { id: string; platform: string; profileUrl: string; visible: boolean; findings: Finding[] };

export default function BugBountyAdminClient({ profiles }: { profiles: Profile[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [newProfile, setNewProfile] = useState({ platform: "", profileUrl: "" });
  
  type NewFindingData = {
    title: string; description: string; date: string; severity: string; url: string;
    isHallOfFame: boolean; isAcknowledgement: boolean;
  };
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [newFinding, setNewFinding] = useState<NewFindingData>({
    title: "", description: "", date: "", severity: "", url: "", isHallOfFame: false, isAcknowledgement: false
  });

  async function wrap(fn: () => Promise<{ success: boolean; error?: string }>) {
    const res = await fn();
    if (!res.success) toast(res.error, "error");
    router.refresh();
  }

  return (
    <>
      <h1 className="text-2xl mb-2">Bug Bounty</h1>
      <p className="text-xs mb-6" style={{ color: "var(--color-text-muted)" }}>
        The public page stays 404 until the <code>bug_bounty</code> feature flag is turned on — off by default until real data exists here.
      </p>

      <form
        onSubmit={(e) => { e.preventDefault(); wrap(() => createBugBountyProfile(newProfile)).then(() => setNewProfile({ platform: "", profileUrl: "" })); }}
        className="flex gap-2 mb-8"
      >
        <input required placeholder="Platform (e.g. Bugcrowd)" value={newProfile.platform} onChange={(e) => setNewProfile({ ...newProfile, platform: e.target.value })}
          className="px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
        <input required placeholder="Profile URL" value={newProfile.profileUrl} onChange={(e) => setNewProfile({ ...newProfile, profileUrl: e.target.value })}
          className="flex-1 px-3 py-2 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
        <button type="submit" className="px-4 py-2 rounded-full text-sm" style={{ background: "var(--color-primary)", color: "white" }}>Add platform</button>
      </form>

      <div className="space-y-6">
        {profiles.map((p) => (
          <div key={p.id} className="glass-card p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg">{p.platform}</h2>
              <div className="flex items-center gap-3">
                <button onClick={() => wrap(() => setBugBountyProfileVisible(p.id, !p.visible))} className="text-xs" style={{ color: p.visible ? "var(--color-signal)" : "var(--color-text-muted)" }}>
                  {p.visible ? "Visible" : "Hidden"}
                </button>
                <ConfirmButton itemLabel={p.platform} onConfirm={() => wrap(() => deleteBugBountyProfile(p.id))} />
              </div>
            </div>
            <ul className="space-y-1 mb-3 text-sm">
              {p.findings.map((f) => (
                <li key={f.id} className="flex items-center gap-2">
                  <button onClick={() => wrap(() => setBugBountyFindingVisible(f.id, !f.visible))} style={{ color: f.visible ? "var(--color-signal)" : "var(--color-text-muted)" }}>●</button>
                  {f.title}
                  <button onClick={() => wrap(() => deleteBugBountyFinding(f.id))} style={{ color: "#f87171" }}>×</button>
                </li>
              ))}
            </ul>
            {addingTo === p.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  wrap(() => createBugBountyFinding(p.id, {
                    title: newFinding.title,
                    description: newFinding.description || undefined,
                    url: newFinding.url || undefined,
                    date: newFinding.date ? new Date(newFinding.date) : undefined,
                    severity: newFinding.severity || undefined,
                    isHallOfFame: newFinding.isHallOfFame,
                    isAcknowledgement: newFinding.isAcknowledgement
                  })).then(() => {
                    setAddingTo(null);
                    setNewFinding({ title: "", description: "", date: "", severity: "", url: "", isHallOfFame: false, isAcknowledgement: false });
                  });
                }}
                className="mt-4 p-4 border rounded-md space-y-3" style={{ borderColor: "var(--color-border)" }}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-sm font-semibold">New Finding</h3>
                  <button type="button" onClick={() => setAddingTo(null)} className="text-xs" style={{ color: "var(--color-text-muted)" }}>Cancel</button>
                </div>
                <input required value={newFinding.title} onChange={(e) => setNewFinding({ ...newFinding, title: e.target.value })} placeholder="Title"
                  className="w-full px-3 py-1.5 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
                <textarea value={newFinding.description} onChange={(e) => setNewFinding({ ...newFinding, description: e.target.value })} placeholder="Description" rows={2}
                  className="w-full px-3 py-1.5 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
                <div className="grid grid-cols-2 gap-2">
                  <input type="date" value={newFinding.date} onChange={(e) => setNewFinding({ ...newFinding, date: e.target.value })}
                    className="w-full px-3 py-1.5 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
                  <input value={newFinding.severity} onChange={(e) => setNewFinding({ ...newFinding, severity: e.target.value })} placeholder="Severity (e.g. Critical)"
                    className="w-full px-3 py-1.5 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
                </div>
                <input type="url" value={newFinding.url} onChange={(e) => setNewFinding({ ...newFinding, url: e.target.value })} placeholder="Report URL"
                  className="w-full px-3 py-1.5 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
                <div className="flex gap-4 text-sm mt-2">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={newFinding.isHallOfFame} onChange={(e) => setNewFinding({ ...newFinding, isHallOfFame: e.target.checked })} />
                    Hall of Fame
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input type="checkbox" checked={newFinding.isAcknowledgement} onChange={(e) => setNewFinding({ ...newFinding, isAcknowledgement: e.target.checked })} />
                    Acknowledgement Only
                  </label>
                </div>
                <button type="submit" className="w-full px-3 py-1.5 rounded-md text-sm mt-2" style={{ border: "1px solid var(--color-primary)", color: "white", background: "var(--color-primary)" }}>
                  Save Finding
                </button>
              </form>
            ) : (
              <button onClick={() => setAddingTo(p.id)} className="text-sm mt-2 flex items-center gap-1" style={{ color: "var(--color-primary)" }}>
                + Add finding
              </button>
            )}
          </div>
        ))}
        {profiles.length === 0 && <p style={{ color: "var(--color-text-muted)" }}>No platforms added yet.</p>}
      </div>
    </>
  );
}
