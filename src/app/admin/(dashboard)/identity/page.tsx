import { prisma } from "@/lib/prisma";
import IdentityClient from "./IdentityClient";

export default async function AdminIdentityPage() {
  const profile = await prisma.profile.findUniqueOrThrow({ where: { id: "singleton" } });
  const mediaItems = await prisma.media.findMany({ select: { id: true, altText: true, url: true } });
  return <IdentityClient initial={profile} mediaItems={mediaItems} />;
}
