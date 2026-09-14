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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 mb-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="uppercase tracking-widest text-red-400 font-semibold">// INTEL JOURNAL & ARTICLES</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Blog & Writeups</h1>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Manage cybersecurity articles, walkthroughs, methodology papers, and public writeups.
          </p>
        </div>
        <Link href="/admin/blog/new" className="admin-btn-primary whitespace-nowrap">
          + New Post
        </Link>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-sans border-collapse">
            <thead>
              <tr className="border-b border-white/[0.08] bg-black/40 text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4 font-semibold">Post Title</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {posts.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/admin/blog/${p.id}`}
                      className="font-medium text-zinc-200 group-hover:text-white group-hover:underline decoration-red-500/50 underline-offset-4 transition-colors block"
                    >
                      {p.title}
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium ${
                        p.status === "PUBLISHED"
                          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                          : "bg-zinc-800 border border-white/10 text-zinc-500"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          p.status === "PUBLISHED" ? "bg-emerald-400 animate-pulse" : "bg-zinc-600"
                        }`}
                      />
                      <span>{p.status}</span>
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                    {p.status === "DRAFT" ? (
                      <button
                        onClick={() => wrap(() => publishBlogPost(p.id))}
                        className="admin-btn-secondary !py-1 !px-2.5 text-[11px] !border-emerald-500/30 !text-emerald-400 hover:!bg-emerald-500/10"
                      >
                        Publish Now
                      </button>
                    ) : (
                      <button
                        onClick={() => wrap(() => unpublishBlogPost(p.id))}
                        className="admin-btn-secondary !py-1 !px-2.5 text-[11px]"
                      >
                        Unpublish
                      </button>
                    )}
                    <Link
                      href={`/admin/blog/${p.id}`}
                      className="admin-btn-secondary !py-1 !px-2.5 text-[11px]"
                    >
                      Edit
                    </Link>
                    <ConfirmButton itemLabel={p.title} onConfirm={() => wrap(() => deleteBlogPost(p.id))} />
                  </td>
                </tr>
              ))}
              {posts.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-12 px-4 text-center font-mono text-xs text-zinc-500">
                    // NO BLOG ARTICLES PUBLISHED.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
