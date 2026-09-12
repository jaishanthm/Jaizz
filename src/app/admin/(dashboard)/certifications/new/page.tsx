import GenericForm from "@/components/admin/GenericForm";
import { createCertification } from "@/lib/actions/certifications";

const FIELDS = [
  { key: "name", label: "Name", type: "text", required: true },
  { key: "issuer", label: "Issuer", type: "text", required: true },
  { key: "credentialId", label: "Credential ID", type: "text" },
  { key: "issueDate", label: "Issue date", type: "date", required: true },
  { key: "expirationDate", label: "Expiration date", type: "date" },
  { key: "verificationUrl", label: "Verification URL", type: "url" },
  { key: "description", label: "Description", type: "textarea" },
] as const;

export default function NewCertificationPage() {
  return (
    <>
      <h1 className="text-2xl mb-6">New Certification</h1>
      <GenericForm fields={[...FIELDS]} backHref="/admin/certifications" onCreate={createCertification} />
    </>
  );
}
