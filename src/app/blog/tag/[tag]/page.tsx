import { notFound } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getPostsByTag } from "@/lib/data/blog";

export const revalidate = 1800;

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }) {
  const { tag } = await params;
  return { title: `Tagged: ${tag} — Jaishanth M` };
}

export default async function BlogTagPage({ params }: { params: Promise<{ tag: string }> }) {
  if (!(await isFeatureEnabled("blog"))) notFound();
  const { tag } = await params;
  const posts = await getPostsByTag(tag);
  if (posts.length === 0) notFound();

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <p className="text-sm mb-2" style={{ color: "var(--color-text-muted)" }}>Home / Blog / Tagged: {tag}</p>
      <h1 className="text-3xl mb-8">Tagged: {tag}</h1>
      <div className="grid gap-6">
        {posts.map((post) => (
          <a key={post.id} href={`/blog/${post.slug}`} className="glass-card block p-6">
            <h2 className="text-xl">{post.title}</h2>
          </a>
        ))}
      </div>
    </main>
  );
}
