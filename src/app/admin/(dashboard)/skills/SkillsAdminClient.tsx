"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { createSkillCategory, deleteSkillCategory, createSkill, deleteSkill, setSkillVisible, setSkillCategoryVisible } from "@/lib/actions/skills";
import { useToast } from "@/components/admin/ToastProvider";

type Skill = { id: string; name: string; visible: boolean };
type Category = { id: string; name: string; visible: boolean; skills: Skill[] };

export default function SkillsAdminClient({ categories }: { categories: Category[] }) {
  const { toast } = useToast();
  const router = useRouter();
  const [newCategory, setNewCategory] = useState("");
  const [newSkill, setNewSkill] = useState<Record<string, string>>({});

  async function wrap(fn: () => Promise<{ success: boolean; error?: string }>) {
    const res = await fn();
    if (!res.success) toast(res.error, "error");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="uppercase tracking-widest text-red-400 font-semibold">// CAPABILITY MATRIX</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Skills & Competencies</h1>
        <p className="text-xs text-zinc-400 font-mono mt-1">
          Categorized technical skills displayed across the homepage, terminal emulator, and dedicated skills ledger.
        </p>
      </div>

      {/* Add New Category Panel */}
      <div className="admin-card p-5">
        <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider mb-3 font-semibold">
          Create New Skill Category
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!newCategory.trim()) return;
            wrap(() => createSkillCategory(newCategory.trim())).then(() => setNewCategory(""));
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <input
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="Category name (e.g. Offensive Security & Red Teaming)"
            className="admin-input flex-1"
          />
          <button type="submit" className="admin-btn-primary whitespace-nowrap">
            + Add Category
          </button>
        </form>
      </div>

      {/* Categories Grid / List */}
      <div className="space-y-5">
        {categories.map((cat) => (
          <div key={cat.id} className="admin-card p-5 space-y-4">
            {/* Category Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-red-500 font-mono font-bold text-sm">//</span>
                <h2 className="text-base font-bold text-white tracking-wide">{cat.name}</h2>
                <span className="text-[11px] font-mono text-zinc-500">
                  ({cat.skills.length} skills)
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => wrap(() => setSkillCategoryVisible(cat.id, !cat.visible))}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono transition-all ${
                    cat.visible
                      ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                      : "bg-zinc-800 border border-white/10 text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${cat.visible ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"}`} />
                  <span>{cat.visible ? "CATEGORY ACTIVE" : "CATEGORY HIDDEN"}</span>
                </button>
                <ConfirmButton itemLabel={cat.name} onConfirm={() => wrap(() => deleteSkillCategory(cat.id))} />
              </div>
            </div>

            {/* Skills Chips */}
            <div className="flex flex-wrap gap-2">
              {cat.skills.map((s) => (
                <div
                  key={s.id}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-mono transition-all ${
                    s.visible
                      ? "bg-black/50 border-white/10 text-zinc-200"
                      : "bg-black/20 border-white/5 text-zinc-600"
                  }`}
                >
                  <button
                    onClick={() => wrap(() => setSkillVisible(s.id, !s.visible))}
                    title={s.visible ? "Click to hide skill" : "Click to show skill"}
                    className="hover:scale-125 transition-transform"
                  >
                    <span className={`inline-block w-2 h-2 rounded-full ${s.visible ? "bg-emerald-400" : "bg-zinc-600"}`} />
                  </button>
                  <span className={s.visible ? "text-zinc-200" : "text-zinc-500 line-through"}>{s.name}</span>
                  <button
                    onClick={() => wrap(() => deleteSkill(s.id))}
                    className="text-zinc-500 hover:text-red-400 ml-1 p-0.5 transition-colors"
                    title={`Delete ${s.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
              {cat.skills.length === 0 && (
                <p className="text-xs font-mono text-zinc-600 py-2">No skills added to this category yet.</p>
              )}
            </div>

            {/* Add Skill to Category Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const val = (newSkill[cat.id] ?? "").trim();
                if (!val) return;
                wrap(() => createSkill(cat.id, val)).then(() =>
                  setNewSkill({ ...newSkill, [cat.id]: "" })
                );
              }}
              className="flex gap-2 pt-2 border-t border-white/[0.04]"
            >
              <input
                value={newSkill[cat.id] ?? ""}
                onChange={(e) => setNewSkill({ ...newSkill, [cat.id]: e.target.value })}
                placeholder={`Add new skill to ${cat.name}...`}
                className="admin-input !py-1.5 text-xs font-mono flex-1"
              />
              <button type="submit" className="admin-btn-secondary !py-1.5 !px-3 text-xs">
                + Add Skill
              </button>
            </form>
          </div>
        ))}

        {categories.length === 0 && (
          <div className="admin-card p-12 text-center font-mono text-zinc-500 text-xs">
            // NO SKILL CATEGORIES DEFINED. ADD ONE ABOVE TO POPULATE CAPABILITIES.
          </div>
        )}
      </div>
    </div>
  );
}
