import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CertificationForm from "../CertificationForm";

export default async function EditCertificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cert = await prisma.certification.findUnique({
    where: { id },
    include: { imageMedia: true },
  });
  if (!cert) notFound();

  const mediaItems = await prisma.media.findMany({
    select: { id: true, url: true, altText: true, mimeType: true },
    orderBy: { createdAt: "desc" },
  });

  const initial = {
    id: cert.id,
    name: cert.name,
    issuer: cert.issuer,
    credentialId: cert.credentialId ?? "",
    issueDate: cert.issueDate.toISOString().slice(0, 10),
    expirationDate: cert.expirationDate?.toISOString().slice(0, 10) ?? "",
    verificationUrl: cert.verificationUrl ?? "",
    imageMediaId: cert.imageMediaId ?? null,
    imageMedia: cert.imageMedia
      ? {
          id: cert.imageMedia.id,
          url: cert.imageMedia.url,
          altText: cert.imageMedia.altText,
          mimeType: cert.imageMedia.mimeType,
        }
      : null,
    description: cert.description ?? "",
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="pb-4 border-b border-white/[0.08]">
        <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
          CREDENTIALS // RECORD MODIFICATION
        </span>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
          Edit Certification: {cert.name}
        </h1>
        <p className="text-xs text-zinc-400 font-mono mt-1">
          Update credential metadata, verification anchors, and badge asset photo.
        </p>
      </div>

      <CertificationForm initial={initial} mediaItems={mediaItems} />
    </div>
  );
}
