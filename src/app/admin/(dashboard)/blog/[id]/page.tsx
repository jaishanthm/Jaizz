import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import BlogForm from "../BlogForm";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();
  return (<><h1 className="text-2xl mb-6">Edit Post</h1><BlogForm initial={{ id: post.id, title: post.title, slug: post.slug, excerpt: post.excerpt, content: post.content }} /></>);
}
