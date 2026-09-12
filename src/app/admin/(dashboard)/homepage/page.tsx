import { prisma } from "@/lib/prisma";
import HomepageClient from "./HomepageClient";

export default async function AdminHomepagePage() {
  const sections = await prisma.homepageSection.findMany({
    orderBy: { order: "asc" },
    include: { featureFlag: true },
    where: { featureFlag: { key: { notIn: ["hero", "contact"] } } },
  });
  return <HomepageClient sections={sections} />;
}
