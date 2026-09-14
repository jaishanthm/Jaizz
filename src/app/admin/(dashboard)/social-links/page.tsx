import { prisma } from "@/lib/prisma";
import SocialLinksClient from "./SocialLinksClient";

export default async function AdminSocialLinksPage() {
  const links = await prisma.socialLink.findMany({
    orderBy: { order: "asc" },
  });

  return <SocialLinksClient links={links} />;
}
