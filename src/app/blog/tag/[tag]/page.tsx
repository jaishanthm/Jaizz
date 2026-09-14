import { notFound } from "next/navigation";
import Link from "next/link";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getPostsByTag } from "@/lib/data/blog";

export const revalidate = 1800;

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  return { title: `Tagged: ${tag} — Jaishanth M.` };
}

export default async function BlogTagPage({ params }: { params: Promise<{ tag: string }> }) {
  if (!(await isFeatureEnabled("blog"))) notFound();
  const { tag } = await params;
  const posts = await getPostsByTag(tag);
  if (posts.length === 0) notFound();

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      {/* Editorial Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-white transition-colors">BLOG</Link>
        <span>/</span>
        <span className="text-[var(--color-signal-red)]">#{tag}</span>
      </div>

      <div className="mb-12">
        <span className="text-xs font-mono text-[var(--color-signal-red)] uppercase tracking-wider block mb-2">
          TAGGED DISPATCHES
        </span>
        <h1 className="font-editorial text-4xl sm:text-5xl font-black text-white">
          #{tag}
        </h1>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="block p-8 rounded-lg border border-[var(--color-border)] bg-[#101014] hover:border-white/20 transition-all group"
          >
            <div className="font-mono text-xs text-zinc-500 mb-2">
              {post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                : "Published"}
            </div>
            <h2 className="font-editorial text-2xl font-bold text-white group-hover:text-[var(--color-signal-red)] transition-colors mb-3">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-base text-[var(--color-text-secondary)] leading-relaxed font-sans">
                {post.excerpt}
              </p>
            )}
          </Link>
        ))}
      </div>
    </main>
  );
}
