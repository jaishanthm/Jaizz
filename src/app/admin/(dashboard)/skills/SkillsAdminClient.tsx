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
    <>
      <h1 className="text-2xl mb-6">Skills</h1>
      <p className="text-xs mb-6" style={{ color: "var(--color-text-muted)" }}>
        No percentages or ratings — grouped categories only, per the brief.
      </p>

      <form
        onSubmit={(e) => { e.preventDefault(); wrap(() => createSkillCategory(newCategory)).then(() => setNewCategory("")); }}
        className="flex gap-2 mb-8"
      >
        <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="New category name"
          className="flex-1 px-4 py-2 rounded-md bg-transparent" style={{ border: "1px solid var(--color-border)" }} />
        <button type="submit" className="px-4 py-2 rounded-full text-sm" style={{ background: "var(--color-primary)", color: "white" }}>Add category</button>
      </form>

      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.id} className="glass-card p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg">{cat.name}</h2>
              <div className="flex items-center gap-3">
                <button onClick={() => wrap(() => setSkillCategoryVisible(cat.id, !cat.visible))} className="text-xs" style={{ color: cat.visible ? "var(--color-signal)" : "var(--color-text-muted)" }}>
                  {cat.visible ? "Visible" : "Hidden"}
                </button>
                <ConfirmButton itemLabel={cat.name} onConfirm={() => wrap(() => deleteSkillCategory(cat.id))} />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {cat.skills.map((s) => (
                <span key={s.id} className="px-3 py-1.5 rounded-full text-sm flex items-center gap-2" style={{ border: "1px solid var(--color-border)" }}>
                  {s.name}
                  <button onClick={() => wrap(() => setSkillVisible(s.id, !s.visible))} style={{ color: s.visible ? "var(--color-signal)" : "var(--color-text-muted)" }}>●</button>
                  <button onClick={() => wrap(() => deleteSkill(s.id))} style={{ color: "#f87171" }}>×</button>
                </span>
              ))}
            </div>
            <form
              onSubmit={(e) => { e.preventDefault(); const val = newSkill[cat.id] ?? ""; wrap(() => createSkill(cat.id, val)).then(() => setNewSkill({ ...newSkill, [cat.id]: "" })); }}
              className="flex gap-2"
            >
              <input value={newSkill[cat.id] ?? ""} onChange={(e) => setNewSkill({ ...newSkill, [cat.id]: e.target.value })} placeholder="New skill"
                className="flex-1 px-3 py-1.5 rounded-md bg-transparent text-sm" style={{ border: "1px solid var(--color-border)" }} />
              <button type="submit" className="px-3 py-1.5 rounded-md text-sm" style={{ border: "1px solid var(--color-primary)", color: "var(--color-primary)" }}>Add</button>
            </form>
          </div>
        ))}
        {categories.length === 0 && <p style={{ color: "var(--color-text-muted)" }}>No categories yet — add one above.</p>}
      </div>
    </>
  );
}
