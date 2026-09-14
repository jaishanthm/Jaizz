"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { useToast } from "@/components/admin/ToastProvider";
import {
  createBugBountyProfile,
  deleteBugBountyProfile,
  setBugBountyProfileVisible,
  createBugBountyFinding,
  deleteBugBountyFinding,
  setBugBountyFindingVisible,
} from "@/lib/actions/bug-bounty";

type Finding = {
  id: string;
  title: string;
  visible: boolean;
  description?: string | null;
  severity?: string | null;
  date?: Date | null;
  url?: string | null;
  isHallOfFame?: boolean;
  isAcknowledgement?: boolean;
};

type Profile = {
  id: string;
  platform: string;
  profileUrl: string;
  researcherName?: string | null;
  description?: string | null;
  visible: boolean;
  order?: number;
  findings: Finding[];
};

interface THMStats {
  success: boolean;
  username: string;
  percentile: string;
  rank: string;
  badges: number;
  streak: number;
  completedRooms: number;
  level: string;
  lastSyncedAt: string;
  source: string;
  error?: string;
}

const PLATFORM_PRESETS = [
  { name: "Bugcrowd", url: "https://bugcrowd.com/h/jaishanth", handle: "jaishanth" },
  { name: "HackerOne", url: "https://hackerone.com/jaishanth", handle: "jaishanth" },
  { name: "Intigriti", url: "https://app.intigriti.com/researcher/profile/jaishanth", handle: "jaishanth" },
  { name: "YesWeHack", url: "https://yeswehack.com/hunters/jaishanth", handle: "jaishanth" },
  { name: "Immunefi", url: "https://immunefi.com/profile/jaishanth", handle: "jaishanth" },
  { name: "Synack", url: "https://platform.synack.com", handle: "jaishanth" },
];

export default function BugBountyAdminClient({ profiles }: { profiles: Profile[] }) {
  const { toast } = useToast();
  const router = useRouter();

  const [profilesList, setProfilesList] = useState<Profile[]>(profiles);
  useEffect(() => {
    setProfilesList(profiles);
  }, [profiles]);

  const [newProfile, setNewProfile] = useState({
    platform: "",
    profileUrl: "",
    researcherName: "",
    description: "",
  });
  const [registering, setRegistering] = useState(false);

  const [thmStats, setThmStats] = useState<THMStats | null>(null);
  const [thmLoading, setThmLoading] = useState(false);
  const [thmUsername, setThmUsername] = useState("jaishanth");

  useEffect(() => {
    fetch("/api/crawler/tryhackme")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success) setThmStats(data);
      })
      .catch(() => {});
  }, []);

  async function handleSyncTHM() {
    setThmLoading(true);
    try {
      const res = await fetch("/api/crawler/tryhackme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: thmUsername }),
      });
      const data = await res.json();
      if (data.success) {
        setThmStats(data);
        toast(`Synced! ${data.percentile} · ${data.completedRooms} rooms · Rank ${data.rank}`, "success");
        router.refresh();
      } else {
        toast(data.error || "Failed to sync TryHackMe", "error");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Crawler request failed";
      toast(message, "error");
    } finally {
      setThmLoading(false);
    }
  }

  type NewFindingData = {
    title: string;
    description: string;
    date: string;
    severity: string;
    url: string;
    isHallOfFame: boolean;
    isAcknowledgement: boolean;
  };

  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [savingFinding, setSavingFinding] = useState(false);
  const [newFinding, setNewFinding] = useState<NewFindingData>({
    title: "",
    description: "",
    date: "",
    severity: "",
    url: "",
    isHallOfFame: false,
    isAcknowledgement: false,
  });

  async function handleRegisterPlatform(e: React.FormEvent) {
    e.preventDefault();
    const platform = newProfile.platform.trim();
    let url = newProfile.profileUrl.trim();

    if (!platform) {
      toast("Platform name is required", "error");
      return;
    }
    if (!url) {
      toast("Public Profile URL is required", "error");
      return;
    }

    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    setRegistering(true);
    try {
      const res = await createBugBountyProfile({
        platform,
        profileUrl: url,
        researcherName: newProfile.researcherName.trim() || undefined,
        description: newProfile.description.trim() || undefined,
      });

      setRegistering(false);

      if (!res.success) {
        toast(res.error || "Failed to register platform", "error");
        return;
      }

      toast(`Registered platform "${platform}" successfully!`, "success");

      const created: Profile = {
        id: res.data.id,
        platform: res.data.platform,
        profileUrl: res.data.profileUrl,
        researcherName: res.data.researcherName ?? null,
        description: res.data.description ?? null,
        visible: res.data.visible,
        order: res.data.order,
        findings: [],
      };

      setProfilesList((prev) => [...prev, created]);
      setNewProfile({ platform: "", profileUrl: "", researcherName: "", description: "" });
      router.refresh();
    } catch (err: unknown) {
      setRegistering(false);
      const message = err instanceof Error ? err.message : "Failed to register platform";
      toast(message, "error");
    }
  }

  async function handleDeleteProfile(id: string, platformName: string) {
    const res = await deleteBugBountyProfile(id);
    if (!res.success) {
      toast(res.error || "Failed to delete platform", "error");
      return;
    }
    toast(`Platform "${platformName}" deleted`, "success");
    setProfilesList((prev) => prev.filter((p) => p.id !== id));
    router.refresh();
  }

  async function handleToggleProfileVisible(id: string, nextVisible: boolean) {
    setProfilesList((prev) =>
      prev.map((p) => (p.id === id ? { ...p, visible: nextVisible } : p))
    );
    const res = await setBugBountyProfileVisible(id, nextVisible);
    if (!res.success) {
      toast(res.error || "Failed to update visibility", "error");
      router.refresh();
      return;
    }
    toast(nextVisible ? "Platform published" : "Platform hidden", "success");
    router.refresh();
  }

  async function handleAddFinding(profileId: string) {
    if (!newFinding.title.trim()) {
      toast("Finding title is required", "error");
      return;
    }

    let url = newFinding.url.trim();
    if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    setSavingFinding(true);
    const res = await createBugBountyFinding(profileId, {
      title: newFinding.title.trim(),
      description: newFinding.description.trim() || undefined,
      url: url || undefined,
      date: newFinding.date ? new Date(newFinding.date) : undefined,
      severity: newFinding.severity.trim() || undefined,
      isHallOfFame: newFinding.isHallOfFame,
      isAcknowledgement: newFinding.isAcknowledgement,
    });
    setSavingFinding(false);

    if (!res.success) {
      toast(res.error || "Failed to record finding", "error");
      return;
    }

    toast("Vulnerability finding recorded successfully", "success");

    const addedFinding: Finding = {
      id: res.data.id,
      title: res.data.title,
      visible: res.data.visible,
      description: newFinding.description.trim() || null,
      severity: newFinding.severity.trim() || null,
      date: newFinding.date ? new Date(newFinding.date) : null,
      url: url || null,
      isHallOfFame: newFinding.isHallOfFame,
      isAcknowledgement: newFinding.isAcknowledgement,
    };

    setProfilesList((prev) =>
      prev.map((p) =>
        p.id === profileId
          ? { ...p, findings: [...p.findings, addedFinding] }
          : p
      )
    );

    setAddingTo(null);
    setNewFinding({
      title: "",
      description: "",
      date: "",
      severity: "",
      url: "",
      isHallOfFame: false,
      isAcknowledgement: false,
    });
    router.refresh();
  }

  async function handleDeleteFinding(findingId: string, title: string, profileId: string) {
    const res = await deleteBugBountyFinding(findingId);
    if (!res.success) {
      toast(res.error || "Failed to delete finding", "error");
      return;
    }
    toast(`Finding "${title}" deleted`, "success");
    setProfilesList((prev) =>
      prev.map((p) =>
        p.id === profileId
          ? { ...p, findings: p.findings.filter((f) => f.id !== findingId) }
          : p
      )
    );
    router.refresh();
  }

  async function handleToggleFindingVisible(findingId: string, nextVisible: boolean, profileId: string) {
    setProfilesList((prev) =>
      prev.map((p) =>
        p.id === profileId
          ? {
              ...p,
              findings: p.findings.map((f) =>
                f.id === findingId ? { ...f, visible: nextVisible } : f
              ),
            }
          : p
      )
    );
    const res = await setBugBountyFindingVisible(findingId, nextVisible);
    if (!res.success) {
      toast(res.error || "Failed to toggle finding", "error");
      router.refresh();
      return;
    }
    toast(nextVisible ? "Finding visible" : "Finding hidden", "success");
    router.refresh();
  }

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="uppercase tracking-widest text-red-400 font-semibold">// OFFENSIVE INTEL &amp; BOUNTIES</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Bug Bounty &amp; Competitive Recon</h1>
        <p className="text-xs text-zinc-400 font-mono mt-1">
          Manage verified bug bounty platforms and sync real-time competitive intelligence from TryHackMe.
        </p>
      </div>

      {/* Dynamic TryHackMe Crawler Widget */}
      <div className="glass-card p-5 sm:p-6 mb-8 border border-white/[0.08] rounded-xl bg-[#0d0d12]/90">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-lg font-bold text-white tracking-wide">TryHackMe Live Intelligence Crawler</h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                DYNAMIC
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-sans">
              Headless Chrome crawler bypasses Cloudflare Turnstile to extract verified rankings, completed rooms, streaks, and badges. Automatically syncs to DB &amp; Homepage.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="THM Username or URL"
              value={thmUsername}
              onChange={(e) => setThmUsername(e.target.value)}
              className="px-3 py-2 rounded-md bg-black/50 text-sm font-mono text-zinc-200 border border-white/10 focus:border-red-500 outline-none w-44 sm:w-48"
            />
            <button
              onClick={handleSyncTHM}
              disabled={thmLoading}
              className="px-4 py-2 rounded-md text-xs font-mono font-semibold uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              style={{ background: "var(--color-signal-red)", color: "white" }}
            >
              {thmLoading ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Crawling...
                </>
              ) : (
                <>⚡ Crawl &amp; Sync</>
              )}
            </button>
          </div>
        </div>

        {thmStats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.05]">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Percentile</div>
              <div className="text-base font-bold text-emerald-400 font-mono mt-0.5">{thmStats.percentile}</div>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.05]">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Global Rank</div>
              <div className="text-base font-bold text-white font-mono mt-0.5">{thmStats.rank}</div>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.05]">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Completed Rooms</div>
              <div className="text-base font-bold text-red-400 font-mono mt-0.5">{thmStats.completedRooms}</div>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.05]">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Day Streak</div>
              <div className="text-base font-bold text-amber-400 font-mono mt-0.5">{thmStats.streak} 🔥</div>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.05]">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Badges</div>
              <div className="text-base font-bold text-white font-mono mt-0.5">{thmStats.badges}</div>
            </div>
            <div className="p-3 rounded-lg bg-black/40 border border-white/[0.05]">
              <div className="text-[10px] font-mono text-zinc-500 uppercase">Platform Level</div>
              <div className="text-base font-bold text-zinc-300 font-mono mt-0.5 text-xs truncate" title={thmStats.level}>
                {thmStats.level || "N/A"}
              </div>
            </div>
          </div>
        )}

        {thmStats?.lastSyncedAt && (
          <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-500">
            <span>Last Synced: {new Date(thmStats.lastSyncedAt).toLocaleString()} ({thmStats.source})</span>
            <a
              href={`https://tryhackme.com/p/${thmStats.username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              View Live Profile ↗
            </a>
          </div>
        )}
      </div>

      {/* Register Bug Bounty Platform Form */}
      <div className="admin-card p-5 sm:p-6 mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
          <div>
            <div className="text-xs font-mono text-zinc-300 uppercase tracking-wider font-semibold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500" />
              <span>Register Bug Bounty Platform</span>
            </div>
            <p className="text-[11px] font-mono text-zinc-500 mt-0.5">
              Connect external researcher profiles (Bugcrowd, HackerOne, Intigriti) to showcase verified responsible disclosures.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2.5 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 font-semibold self-start sm:self-auto">
            OFFENSIVE INTEL
          </span>
        </div>

        {/* Quick Presets */}
        <div>
          <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider block mb-2 font-medium">
            Quick Platform Presets:
          </span>
          <div className="flex flex-wrap gap-2">
            {PLATFORM_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() =>
                  setNewProfile({
                    platform: preset.name,
                    profileUrl: preset.url,
                    researcherName: preset.handle,
                    description: `Active security researcher on ${preset.name} participating in responsible disclosure and penetration testing.`,
                  })
                }
                className="px-2.5 py-1 rounded bg-white/[0.04] border border-white/[0.08] hover:border-red-500/50 hover:bg-red-500/10 hover:text-white text-[11px] font-mono text-zinc-300 transition-all flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                <span>{preset.name}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleRegisterPlatform} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-zinc-300 uppercase">
                Platform Name <span className="text-red-500">*</span>
              </label>
              <input
                required
                placeholder="e.g. Bugcrowd, HackerOne, Intigriti"
                value={newProfile.platform}
                onChange={(e) => setNewProfile({ ...newProfile, platform: e.target.value })}
                className="admin-input text-xs font-medium"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-[11px] font-mono text-zinc-300 uppercase">
                Public Profile URL <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                placeholder="e.g. https://bugcrowd.com/h/jaishanth or bugcrowd.com/h/jaishanth"
                value={newProfile.profileUrl}
                onChange={(e) => setNewProfile({ ...newProfile, profileUrl: e.target.value })}
                className="admin-input text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-[11px] font-mono text-zinc-300 uppercase">
                Researcher Handle / Username
              </label>
              <input
                placeholder="e.g. jaishanth or @jaishanth"
                value={newProfile.researcherName}
                onChange={(e) => setNewProfile({ ...newProfile, researcherName: e.target.value })}
                className="admin-input text-xs font-mono"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="block text-[11px] font-mono text-zinc-300 uppercase">
                Platform Focus / Bio (Optional)
              </label>
              <input
                placeholder="e.g. Responsible disclosure researcher focusing on API security &amp; web applications"
                value={newProfile.description}
                onChange={(e) => setNewProfile({ ...newProfile, description: e.target.value })}
                className="admin-input text-xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={registering}
              className="admin-btn-primary text-xs py-2.5 px-6 flex items-center gap-2"
            >
              {registering ? (
                <>
                  <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>REGISTERING PLATFORM...</span>
                </>
              ) : (
                <span>+ REGISTER PLATFORM</span>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Verified Platforms & Findings List */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-white/[0.06]">
          <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider font-semibold">
            Configured Bug Bounty Platforms ({profilesList.length})
          </span>
        </div>

        {profilesList.map((p) => (
          <div key={p.id} className="admin-card p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-red-500 font-mono font-bold text-sm">//</span>
                  <h2 className="text-base font-bold text-white tracking-wide">{p.platform}</h2>
                  {p.researcherName && (
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.08] text-zinc-300">
                      @{p.researcherName.replace(/^@/, "")}
                    </span>
                  )}
                  <span className="text-[11px] font-mono text-zinc-500">
                    ({p.findings.length} findings)
                  </span>
                </div>
                <a
                  href={p.profileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-mono text-zinc-400 hover:text-red-400 transition-colors mt-0.5 inline-block"
                >
                  {p.profileUrl} ↗
                </a>
                {p.description && (
                  <p className="text-xs text-zinc-400 font-sans mt-1">
                    {p.description}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleToggleProfileVisible(p.id, !p.visible)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all ${
                    p.visible
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                      : "bg-zinc-800 border border-white/10 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${p.visible ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
                  <span>{p.visible ? "PLATFORM ACTIVE" : "PLATFORM HIDDEN"}</span>
                </button>
                <ConfirmButton
                  itemLabel={p.platform}
                  onConfirm={() => handleDeleteProfile(p.id, p.platform)}
                />
              </div>
            </div>

            {/* Findings List */}
            <div className="space-y-2">
              {p.findings.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center justify-between p-2.5 rounded-lg bg-black/40 border border-white/[0.05] text-xs font-mono"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <button
                      onClick={() => handleToggleFindingVisible(f.id, !f.visible, p.id)}
                      title={f.visible ? "Hide finding" : "Show finding"}
                    >
                      <span className={`inline-block w-2 h-2 rounded-full ${f.visible ? "bg-emerald-400" : "bg-zinc-600"}`} />
                    </button>
                    <span className={`font-medium truncate ${f.visible ? "text-zinc-200" : "text-zinc-500 line-through"}`}>
                      {f.title}
                    </span>
                    {f.severity && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                        {f.severity}
                      </span>
                    )}
                    {f.isHallOfFame && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        HOF 🏆
                      </span>
                    )}
                  </div>
                  <ConfirmButton
                    itemLabel={f.title}
                    onConfirm={() => handleDeleteFinding(f.id, f.title, p.id)}
                  />
                </div>
              ))}
            </div>

            {/* Add Finding Toggle / Form */}
            {addingTo === p.id ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAddFinding(p.id);
                }}
                className="mt-4 p-4 rounded-lg bg-black/60 border border-white/[0.08] space-y-3"
              >
                <div className="flex justify-between items-center pb-2 border-b border-white/[0.06]">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-red-400">
                    Record New Vulnerability Finding
                  </h3>
                  <button
                    type="button"
                    onClick={() => setAddingTo(null)}
                    className="text-xs font-mono text-zinc-500 hover:text-white"
                  >
                    Cancel [ESC]
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase">Finding Title *</label>
                  <input
                    required
                    value={newFinding.title}
                    onChange={(e) => setNewFinding({ ...newFinding, title: e.target.value })}
                    placeholder="e.g. Account Takeover via Host Header Injection"
                    className="admin-input text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase">Description / Notes</label>
                  <textarea
                    value={newFinding.description}
                    onChange={(e) => setNewFinding({ ...newFinding, description: e.target.value })}
                    placeholder="Technical summary of vulnerability or target scope..."
                    rows={2}
                    className="admin-input text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase">Discovery / Triage Date</label>
                    <input
                      type="date"
                      value={newFinding.date}
                      onChange={(e) => setNewFinding({ ...newFinding, date: e.target.value })}
                      className="admin-input text-xs font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-[11px] font-mono text-zinc-400 uppercase">Severity Level</label>
                    <input
                      value={newFinding.severity}
                      onChange={(e) => setNewFinding({ ...newFinding, severity: e.target.value })}
                      placeholder="e.g. Critical, High, P1, Medium"
                      className="admin-input text-xs font-mono"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-mono text-zinc-400 uppercase">Verified Writeup / Report URL</label>
                  <input
                    type="text"
                    value={newFinding.url}
                    onChange={(e) => setNewFinding({ ...newFinding, url: e.target.value })}
                    placeholder="e.g. https://... or bugcrowd.com/..."
                    className="admin-input text-xs font-mono"
                  />
                </div>

                <div className="flex flex-wrap gap-4 text-xs font-mono py-1">
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                    <input
                      type="checkbox"
                      checked={newFinding.isHallOfFame}
                      onChange={(e) => setNewFinding({ ...newFinding, isHallOfFame: e.target.checked })}
                      className="rounded accent-red-500"
                    />
                    <span>Hall of Fame Inductee</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                    <input
                      type="checkbox"
                      checked={newFinding.isAcknowledgement}
                      onChange={(e) => setNewFinding({ ...newFinding, isAcknowledgement: e.target.checked })}
                      className="rounded accent-red-500"
                    />
                    <span>Security Acknowledgement</span>
                  </label>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={savingFinding}
                    className="admin-btn-primary !py-2 text-xs flex items-center gap-2"
                  >
                    {savingFinding ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>SAVING...</span>
                      </>
                    ) : (
                      <span>Save Finding</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddingTo(null)}
                    className="admin-btn-secondary !py-2 text-xs"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <button
                onClick={() => setAddingTo(p.id)}
                className="admin-btn-secondary !py-1.5 !px-3 text-xs"
              >
                + Add Finding
              </button>
            )}
          </div>
        ))}

        {profilesList.length === 0 && (
          <div className="admin-card p-12 text-center font-mono text-zinc-500 text-xs">
            // NO BUG BOUNTY PLATFORMS CONFIGURED. REGISTER A PLATFORM ABOVE.
          </div>
        )}
      </div>
    </div>
  );
}
