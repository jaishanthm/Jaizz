import { prisma } from "@/lib/prisma";
import BlogListClient from "./BlogListClient";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
  return <BlogListClient posts={posts} />;
}
