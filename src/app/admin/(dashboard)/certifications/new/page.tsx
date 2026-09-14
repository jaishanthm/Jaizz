import { prisma } from "@/lib/prisma";
import CertificationForm from "../CertificationForm";

export default async function NewCertificationPage() {
  const mediaItems = await prisma.media.findMany({
    select: { id: true, url: true, altText: true, mimeType: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="pb-4 border-b border-white/[0.08]">
        <span className="text-[11px] font-mono tracking-widest text-red-500 uppercase font-semibold">
          CREDENTIALS // PROVISION RECORD
        </span>
        <h1 className="text-2xl font-bold text-white tracking-tight mt-0.5">
          New Certification
        </h1>
        <p className="text-xs text-zinc-400 font-mono mt-1">
          Register an offensive security credential with verified badge artwork and authority verification.
        </p>
      </div>

      <CertificationForm mediaItems={mediaItems} />
    </div>
  );
}
