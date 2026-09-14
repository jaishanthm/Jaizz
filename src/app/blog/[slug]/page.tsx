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
    title: post.seoTitle ?? `${post.title} — Jaishanth M.`,
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

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      { "@type": "ListItem", position: 2, name: "Blog", item: "/blog" },
      { "@type": "ListItem", position: 3, name: post.title },
    ],
  };

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Editorial Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-white transition-colors">BLOG</Link>
        <span>/</span>
        <span className="text-[var(--color-signal-red)]">{post.slug}</span>
      </div>

      <header className="mb-12">
        <div className="flex items-center gap-3 font-mono text-xs text-zinc-500 mb-4">
          <span>{post.publishedAt?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          <span>·</span>
          <span className="text-zinc-400">{post.readingTimeMins ? `${post.readingTimeMins} min read` : "5 min read"}</span>
        </div>
        <h1 className="font-editorial text-3xl sm:text-5xl font-black text-white mb-6 leading-tight">
          {post.title}
        </h1>
        {post.excerpt && (
          <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed font-sans">
            {post.excerpt}
          </p>
        )}
      </header>

      <article className="p-8 sm:p-12 rounded-lg border border-[var(--color-border)] bg-[#101014] mb-12">
        <div className="prose prose-invert max-w-none text-[var(--color-text-secondary)] leading-relaxed font-sans">
          <Markdown content={post.content} />
        </div>
      </article>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-6 border-t border-[var(--color-border)] font-mono text-xs">
          {post.tags.map(({ tag }) => (
            <Link
              key={tag.id}
              href={`/blog/tag/${tag.slug}`}
              className="px-3 py-1 rounded-xs bg-zinc-900 border border-white/[0.08] text-zinc-400 hover:text-white hover:border-[var(--color-signal-red)] transition-all"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}
