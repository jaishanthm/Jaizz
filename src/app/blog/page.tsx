import Link from "next/link";
import { notFound } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getPublishedPosts } from "@/lib/data/blog";
import { resolvePageSEO } from "@/lib/seo";

export const revalidate = 1800;

export async function generateMetadata() {
  return resolvePageSEO(
    "/blog",
    "Technical Writing & Security Notes — Jaishanth M.",
    "Technical writings on web application penetration testing, Active Directory security, and offensive systems engineering by Jaishanth M."
  );
}

export default async function BlogPage() {
  if (!(await isFeatureEnabled("blog"))) notFound();
  const posts = await getPublishedPosts();

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Editorial Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-[var(--color-signal-red)]">TECHNICAL WRITING</span>
      </div>

      <div className="mb-16">
        <h1 className="font-editorial text-4xl sm:text-6xl font-black text-white mb-4 uppercase tracking-tight">
          Technical Writing & Notes
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-3xl leading-relaxed font-sans">
          Deep dives into reconnaissance mechanics, vulnerability vectors, and defensive architectural principles distilled from offensive security practice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-8 rounded-lg border border-[var(--color-border)] bg-[#101014] hover:border-white/20 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4 font-mono text-xs text-zinc-500">
                <span>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "Published"}
                </span>
                {post.readingTimeMins && (
                  <span className="text-zinc-400">
                    {post.readingTimeMins} MIN READ
                  </span>
                )}
              </div>

              <h2 className="font-editorial text-2xl font-bold text-white mb-3 group-hover:text-[var(--color-signal-red)] transition-colors leading-snug">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>

              {post.excerpt && (
                <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-6 font-sans">
                  {post.excerpt}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs">
              <Link
                href={`/blog/${post.slug}`}
                className="text-white hover:text-[var(--color-signal-red)] flex items-center gap-1.5 transition-colors font-semibold"
              >
                <span>Read Dispatch</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <p className="text-sm font-mono text-zinc-500">
            No technical notes published yet.
          </p>
        )}
      </div>
    </main>
  );
}
