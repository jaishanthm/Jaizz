import Image from "next/image";
import { notFound } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getVisibleCertifications } from "@/lib/data/credentials";
import { resolvePageSEO } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return resolvePageSEO(
    "/certifications",
    "Credentials & Certifications — Jaishanth M",
    "Validated industry certifications in network security defense, ethical hacking methodology, and web application penetration testing."
  );
}

export default async function CertificationsPage() {
  if (!(await isFeatureEnabled("certifications"))) notFound();
  const certs = await getVisibleCertifications();

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Header breadcrumb & cyber tag */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-mono text-[var(--color-cool-cyan)] tracking-widest uppercase">
          // CREDENTIALS // VERIFIED CERTS
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-border-glow)] to-transparent" />
      </div>

      <div className="mb-12">
        <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-[var(--color-text-primary)] mb-4">
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
              className="glass-panel-elevated rounded-2xl border border-[var(--color-border)] hover:border-[var(--color-border-glow)] transition-all overflow-hidden flex flex-col justify-between"
            >
              <div>
                {c.imageMedia && (
                  <div className="relative w-full h-48 bg-[var(--color-bg-surface)] border-b border-[var(--color-border)] overflow-hidden">
                    <Image
                      src={c.imageMedia.url}
                      alt={c.name}
                      fill
                      className="object-cover opacity-90 hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg-surface)] via-transparent to-transparent opacity-70" />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs text-[var(--color-cool-cyan)] font-semibold">
                      {c.issuer}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono text-[10px] border border-emerald-500/30">
                      VERIFIED
                    </span>
                  </div>

                  <h2 className="font-heading text-xl font-bold text-[var(--color-text-primary)] mb-3">
                    {c.name}
                  </h2>

                  {c.description && (
                    <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed mb-4 font-sans">
                      {c.description}
                    </p>
                  )}

                  {c.credentialId && (
                    <div className="font-mono text-xs text-[var(--color-text-muted)] mb-2">
                      <span className="text-[var(--color-electric-blue)]">CREDENTIAL_ID:</span> {c.credentialId}
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-[var(--color-border-subtle)] flex items-center justify-between font-mono text-xs text-[var(--color-text-muted)]">
                <span>{issueDate ? `Issued ${issueDate}` : "Active"}</span>
                {c.verificationUrl ? (
                  <a
                    href={c.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--color-cool-cyan)] hover:underline flex items-center gap-1"
                  >
                    <span>Verify Credential</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <span className="text-[var(--color-cool-cyan)]">Authenticated</span>
                )}
              </div>
            </div>
          );
        })}

        {certs.length === 0 && (
          <p className="text-sm font-mono text-[var(--color-text-muted)]">
            No certifications published.
          </p>
        )}
      </div>
    </main>
  );
}
