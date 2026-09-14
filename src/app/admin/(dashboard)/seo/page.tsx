import { prisma } from "@/lib/prisma";
import SEOClient from "./SEOClient";

export default async function AdminSEOPage() {
  const [settings, pages] = await Promise.all([
    prisma.sEOSettings.findUniqueOrThrow({ where: { id: "singleton" } }),
    prisma.pageSEO.findMany(),
  ]);
  return <SEOClient initial={settings} pages={pages} />;
}
