import { prisma } from "@/lib/prisma";
import { getMediaUsage } from "@/lib/actions/media";
import MediaClient from "./MediaClient";

export default async function AdminMediaPage() {
  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  try {
    const withUsage = await Promise.all(
      media.map(async (m) => ({ ...m, usage: await getMediaUsage(m.id) }))
    );
    return <MediaClient items={withUsage} />;
  } catch {
    // getMediaUsage now enforces its own permission check (QA fix) — a
    // VIEWER reaching this URL directly (sidebar hides the link, but a URL
    // isn't a security boundary) gets a plain denial, not an uncaught
    // server-component crash.
    return <p style={{ color: "var(--color-text-muted)" }}>You don&apos;t have permission to view media.</p>;
  }
}
