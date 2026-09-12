import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import GenericForm from "@/components/admin/GenericForm";
import { updateCertification } from "@/lib/actions/certifications";

const FIELDS = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "issuer", label: "Issuer", type: "text", required: true },
  { key: "credentialId", label: "Credential ID", type: "text" },
  { key: "issueDate", label: "Issue date", type: "date", required: true },
  { key: "expirationDate", label: "Expiration date", type: "date" },
  { key: "verificationUrl", label: "Verification URL", type: "url" },
  { key: "description", label: "Description", type: "textarea" },
] as const;

export default async function EditCertificationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cert = await prisma.certification.findUnique({ where: { id } });
  if (!cert) notFound();

  const initial = {
    name: cert.name, issuer: cert.issuer, credentialId: cert.credentialId ?? "",
    issueDate: cert.issueDate.toISOString().slice(0, 10),
    expirationDate: cert.expirationDate?.toISOString().slice(0, 10) ?? "",
    verificationUrl: cert.verificationUrl ?? "", description: cert.description ?? "",
  };

  return (
    <>
      <h1 className="text-2xl mb-6">Edit Certification</h1>
      <GenericForm fields={[...FIELDS]} initial={initial} backHref="/admin/certifications" onUpdate={updateCertification} id={id} />
    </>
  );
}
