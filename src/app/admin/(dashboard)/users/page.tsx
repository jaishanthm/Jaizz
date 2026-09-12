import { prisma } from "@/lib/prisma";
import UsersClient from "./UsersClient";

export default async function AdminUsersPage() {
  const users = await prisma.adminUser.findMany({ include: { role: true }, orderBy: { createdAt: "asc" } });
  return <UsersClient users={users} />;
}
