import { prisma } from "@/lib/prisma";
import NavigationClient from "./NavigationClient";

export default async function AdminNavigationPage() {
  const items = await prisma.navigationItem.findMany({ orderBy: { order: "asc" } });
  return <NavigationClient items={items} />;
}
