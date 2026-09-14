import { prisma } from "@/lib/prisma";
import InquiriesClient from "./InquiriesClient";

export default async function AdminInquiriesPage() {
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <InquiriesClient messages={messages} />;
}
