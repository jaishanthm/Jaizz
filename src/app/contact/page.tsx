import { notFound } from "next/navigation";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getProfile, getVisibleSocialLinks } from "@/lib/data/profile";
import ContactForm from "@/components/ContactForm";
import { resolvePageSEO } from "@/lib/seo";

export const revalidate = 3600;

export async function generateMetadata() {
  return resolvePageSEO(
    "/contact",
    "Contact & Secure Channel — Jaishanth M",
    "Open a secure channel with Jaishanth M for ethical vulnerability disclosures, security research inquiries, and collaborations."
  );
}

export default async function ContactPage() {
  if (!(await isFeatureEnabled("contact"))) notFound();
  const [profile, links] = await Promise.all([getProfile(), getVisibleSocialLinks()]);

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      {/* Header breadcrumb & cyber tag */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-mono text-[var(--color-cool-cyan)] tracking-widest uppercase">
          // COMMS // SECURE CHANNEL
        </span>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-[var(--color-border-glow)] to-transparent" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct info & Availability */}
        <div className="lg:col-span-5">
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold text-[var(--color-text-primary)] mb-4">
            Open a Secure Channel
          </h1>

          <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-8 font-sans">
            Direct communications line for vulnerability assessments, security research collaborations, and offensive security internships.
          </p>

          <div className="glass-panel-elevated p-6 rounded-2xl border border-[var(--color-border-glow)] space-y-4 mb-6">
            <div>
              <span className="font-mono text-xs text-[var(--color-text-muted)] block mb-1">
                PRIMARY TRANSMISSION INBOX
              </span>
              <a
                href="mailto:jaishanthcys@gmail.com"
                className="font-mono text-sm text-[var(--color-cool-cyan)] hover:underline font-semibold"
              >
                jaishanthcys@gmail.com
              </a>
            </div>

            <div className="pt-3 border-t border-[var(--color-border-subtle)]">
              <span className="font-mono text-xs text-[var(--color-text-muted)] block mb-1">
                OPERATIONAL BASE
              </span>
              <span className="text-sm text-[var(--color-text-primary)] font-medium">
                MCET Pollachi, Tamil Nadu, India
              </span>
            </div>

            <div className="pt-3 border-t border-[var(--color-border-subtle)]">
              <span className="font-mono text-xs text-[var(--color-text-muted)] block mb-1">
                RESPONSE SLA
              </span>
              <span className="font-mono text-xs text-emerald-400">
                &lt; 24 HOURS ON BUSINESS DISCLOSURES
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs text-[var(--color-cool-cyan)] block uppercase">
              // VERIFIED RESEARCH NETWORKS
            </span>
            <div className="flex flex-wrap gap-2">
              {links.map((l) => (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl glass-card text-xs font-mono text-[var(--color-text-secondary)] hover:text-white hover:border-[var(--color-cool-cyan)] transition-colors"
                >
                  {l.platform} ↗
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Encrypted Form */}
        <div className="lg:col-span-7">
          <div className="glass-panel-elevated p-8 rounded-2xl border border-[var(--color-border)] shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-[var(--color-border-subtle)] font-mono text-xs">
              <span className="text-[var(--color-cool-cyan)] flex items-center gap-2">
                <span className="status-dot-pulsar" />
                SECURE TRANSMISSION PROTOCOL
              </span>
              <span className="text-[var(--color-text-muted)]">TLS 1.3 / ENCRYPTED</span>
            </div>

            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
