import { prisma } from "@/lib/prisma";
import FeatureFlagsClient from "./FeatureFlagsClient";

export default async function AdminFeatureFlagsPage() {
  const flags = await prisma.featureFlag.findMany({ orderBy: { sortOrder: "asc" } });
  return <FeatureFlagsClient flags={flags} />;
}
