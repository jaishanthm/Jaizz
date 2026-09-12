import Link from "next/link";
import { notFound } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getPublishedPosts } from "@/lib/data/blog";
import { resolvePageSEO } from "@/lib/seo";

export const revalidate = 1800;

export async function generateMetadata() {
  return resolvePageSEO(
    "/blog",
    "Technical Writing & Security Notes — Jaishanth M",
    "Technical writings on web application penetration testing, Active Directory security, and offensive systems engineering by Jaishanth M."
  );
}

export default async function BlogPage() {
  if (!(await isFeatureEnabled("blog"))) notFound();
  const posts = await getPublishedPosts();

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Header breadcrumb & cyber tag */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-mono text-[var(--color-cool-cyan)] tracking-widest uppercase">
          // DISPATCHES // TECHNICAL WRITING
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-border-glow)] to-transparent" />
      </div>

      <div className="mb-12">
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-[var(--color-text-primary)] mb-4">
          Technical Writing & Security Notes
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-3xl leading-relaxed font-sans">
          Deep dives into reconnaissance mechanics, vulnerability vectors, and defensive architectural principles distilled from offensive security practice.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map((post) => (
          <div
            key={post.id}
            className="glass-panel-elevated p-8 rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-border-glow)] transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="flex items-center justify-between mb-4 font-mono text-xs text-[var(--color-text-muted)]">
                <span>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                    : "Published"}
                </span>
                {post.readingTimeMins && (
                  <span className="text-[var(--color-cool-cyan)]">
                    {post.readingTimeMins} MIN READ
                  </span>
                )}
              </div>

              <h2 className="font-heading text-2xl font-bold text-[var(--color-text-primary)] mb-3 group-hover:text-[var(--color-cool-cyan)] transition-colors leading-snug">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>

              {post.excerpt && (
                <p className="text-sm sm:text-base text-[var(--color-text-secondary)] leading-relaxed mb-6 font-sans">
                  {post.excerpt}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
              <Link
                href={`/blog/${post.slug}`}
                className="text-xs font-mono text-[var(--color-cool-cyan)] hover:underline flex items-center gap-1.5"
              >
                <span>Read Dispatch</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <p className="text-sm font-mono text-[var(--color-text-muted)]">
            No technical notes published yet.
          </p>
        )}
      </div>
    </main>
  );
}
