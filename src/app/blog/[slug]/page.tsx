import Link from "next/link";
import { notFound } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getPostBySlug } from "@/lib/data/blog";
import Markdown from "@/components/Markdown";

export const revalidate = 1800;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.seoTitle ?? `${post.title} — Jaishanth M`,
    description: post.seoDescription ?? post.excerpt ?? undefined,
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!(await isFeatureEnabled("blog"))) notFound();
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: post.author.name },
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)] mb-8">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
        <span>/</span>
        <span className="text-[var(--color-cool-cyan)]">{post.slug}</span>
      </div>

      <header className="mb-10">
        <div className="flex items-center gap-3 font-mono text-xs text-[var(--color-text-muted)] mb-3">
          <span>{post.publishedAt?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          <span>·</span>
          <span className="text-[var(--color-cool-cyan)]">{post.readingTimeMins ? `${post.readingTimeMins} min read` : "5 min read"}</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-[var(--color-text-primary)] mb-4 leading-tight">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed font-sans">
            {post.excerpt}
          </p>
        )}
      </header>

      <article className="glass-card p-8 sm:p-10 rounded-2xl border border-[var(--color-border)] mb-12">
        <div className="prose prose-invert max-w-none text-[var(--color-text-secondary)] leading-relaxed">
          <Markdown content={post.content} />
        </div>
      </article>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-6 border-t border-[var(--color-border)] font-mono text-xs">
          {post.tags.map(({ tag }) => (
            <span key={tag.id} className="px-3 py-1 rounded-lg glass-card border border-[var(--color-border)] text-[var(--color-cool-cyan)]">
              #{tag.name}
            </span>
          ))}
        </div>
      )}
    </main>
  );
}
