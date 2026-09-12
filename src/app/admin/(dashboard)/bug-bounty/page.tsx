import { prisma } from "@/lib/prisma";
import BugBountyAdminClient from "./BugBountyAdminClient";

export default async function AdminBugBountyPage() {
  const profiles = await prisma.bugBountyProfile.findMany({
    orderBy: { order: "asc" },
    include: { findings: true },
  });
  return <BugBountyAdminClient profiles={profiles} />;
}
