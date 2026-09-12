"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ConfirmButton from "@/components/admin/ConfirmButton";
import { deleteBlogPost, publishBlogPost, unpublishBlogPost } from "@/lib/actions/blog";
import { useToast } from "@/components/admin/ToastProvider";

type Row = { id: string; title: string; status: string; publishedAt: Date | null };

export default function BlogListClient({ posts }: { posts: Row[] }) {
  const { toast } = useToast();
  const router = useRouter();
  async function wrap(fn: () => Promise<{ success: boolean; error?: string }>) {
    const res = await fn(); if (!res.success) toast(res.error, "error"); router.refresh();
  }
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl">Blog</h1>
        <Link href="/admin/blog/new" className="px-4 py-2 rounded-full text-sm" style={{ background: "var(--color-primary)", color: "white" }}>+ New Post</Link>
      </div>
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr style={{ borderBottom: "1px solid var(--color-border)" }}><th className="text-left p-3">Title</th><th className="text-left p-3">Status</th><th className="text-right p-3">Actions</th></tr></thead>
          <tbody>
            {posts.map((p) => (
              <tr key={p.id} style={{ borderBottom: "1px solid var(--color-border)" }}>
                <td className="p-3"><Link href={`/admin/blog/${p.id}`}>{p.title}</Link></td>
                <td className="p-3" style={{ color: p.status === "PUBLISHED" ? "var(--color-signal)" : "var(--color-text-muted)" }}>{p.status}</td>
                <td className="p-3 text-right space-x-2">
                  {p.status === "DRAFT"
                    ? <button onClick={() => wrap(() => publishBlogPost(p.id))} className="text-xs" style={{ color: "var(--color-primary)" }}>Publish</button>
                    : <button onClick={() => wrap(() => unpublishBlogPost(p.id))} className="text-xs" style={{ color: "var(--color-text-muted)" }}>Unpublish</button>}
                  <Link href={`/admin/blog/${p.id}`} className="text-xs" style={{ color: "var(--color-primary)" }}>Edit</Link>
                  <ConfirmButton itemLabel={p.title} onConfirm={() => wrap(() => deleteBlogPost(p.id))} />
                </td>
              </tr>
            ))}
            {posts.length === 0 && <tr><td colSpan={3} className="p-6 text-center" style={{ color: "var(--color-text-muted)" }}>Nothing here yet.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
