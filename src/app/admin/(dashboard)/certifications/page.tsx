import { prisma } from "@/lib/prisma";
import CertificationsListClient from "./CertificationsListClient";

export default async function AdminCertificationsPage() {
  const items = await prisma.certification.findMany({ orderBy: { sortOrder: "asc" } });
  return <CertificationsListClient items={items} />;
}
