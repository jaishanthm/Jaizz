import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getVisibleCertifications } from "@/lib/data/credentials";
import { resolvePageSEO } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return resolvePageSEO(
    "/certifications",
    "Credentials & Certifications — Jaishanth M.",
    "Validated industry certifications in network security defense, ethical hacking methodology, and practical penetration testing."
  );
}

export default async function CertificationsPage() {
  if (!(await isFeatureEnabled("certifications"))) notFound();
  const certs = await getVisibleCertifications();

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Editorial Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-[var(--color-signal-red)]">CREDENTIALS & CERTIFICATIONS</span>
      </div>

      <div className="mb-16">
        <h1 className="font-editorial text-4xl sm:text-6xl font-black text-white mb-4 uppercase tracking-tight">
          Industry Certifications
        </h1>
        <p className="text-base sm:text-lg text-[var(--color-text-secondary)] max-w-3xl leading-relaxed font-sans">
          Proven competency certifications spanning network architecture defense, ethical hacking principles, and practical penetration testing methodologies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {certs.map((c) => {
          const issueDate = c.issueDate
            ? new Date(c.issueDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
            : null;

          return (
            <div
              key={c.id}
              className="rounded-lg border border-[var(--color-border)] bg-[#101014] overflow-hidden flex flex-col justify-between hover:border-white/20 transition-all"
            >
              <div>
                {c.imageMedia && (
                  <div className="relative w-full h-48 bg-zinc-950 border-b border-white/[0.06] overflow-hidden">
                    <Image
                      src={c.imageMedia.url}
                      alt={c.imageMedia.altText || c.name}
                      fill
                      className="object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
                    />
                  </div>
                )}

                <div className="p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs text-[var(--color-signal-red)] font-semibold">
                      {c.issuer}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">
                      VERIFIED
                    </span>
                  </div>

                  <h2 className="font-editorial text-xl sm:text-2xl font-bold text-white mb-3">
                    {c.name}
                  </h2>

                  {c.description && (
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 font-sans">
                      {c.description}
                    </p>
                  )}

                  {c.credentialId && (
                    <div className="font-mono text-xs text-zinc-500 mb-2">
                      <span className="text-zinc-400">CREDENTIAL ID:</span> {c.credentialId}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 sm:p-8 pt-0 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs text-zinc-500">
                <span>{issueDate ? `Issued ${issueDate}` : "Active"}</span>
                {c.verificationUrl ? (
                  <a
                    href={c.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-300 hover:text-[var(--color-signal-red)] transition-colors flex items-center gap-1"
                  >
                    <span>Verify Credential</span>
                    <span>↗</span>
                  </a>
                ) : (
                  <span className="text-zinc-400">Authenticated</span>
                )}
              </div>
            </div>
          );
        })}

        {certs.length === 0 && (
          <p className="text-sm font-mono text-zinc-500">
            No certifications published.
          </p>
        )}
      </div>
    </main>
  );
}
