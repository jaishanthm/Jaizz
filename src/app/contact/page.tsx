import { notFound } from "next/navigation";
import Link from "next/link";
import { isFeatureEnabled } from "@/lib/feature-flags";
import { getProfile, getVisibleSocialLinks } from "@/lib/data/profile";
import ContactForm from "@/components/ContactForm";
import { resolvePageSEO } from "@/lib/seo";
import SocialIcon from "@/components/SocialIcon";

export const revalidate = 3600;

export async function generateMetadata() {
  return resolvePageSEO(
    "/contact",
    "Contact & Direct Inquiries — Jaishanth M.",
    "Open a direct channel with Jaishanth M. for vulnerability disclosures, offensive security tooling collaborations, and red team opportunities."
  );
}

export default async function ContactPage() {
  if (!(await isFeatureEnabled("contact"))) notFound();
  const [profile, links] = await Promise.all([getProfile(), getVisibleSocialLinks()]);

  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      {/* Editorial Breadcrumb */}
      <div className="flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">HOME</Link>
        <span>/</span>
        <span className="text-[var(--color-signal-red)]">DIRECT TRANSMISSION</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Direct Info & Networks (5 cols) */}
        <div className="lg:col-span-5">
          <h1 className="font-editorial text-4xl sm:text-6xl font-black text-white mb-4 uppercase tracking-tight">
            Direct Transmission
          </h1>

          <p className="text-base text-[var(--color-text-secondary)] leading-relaxed mb-8 font-sans">
            Direct communications channel for vulnerability assessments, offensive tooling collaborations, and red team internship inquiries.
          </p>

          <div className="p-8 rounded-lg border border-[var(--color-border)] bg-[#101014] space-y-6 mb-8">
            <div>
              <span className="font-mono text-xs text-zinc-500 block mb-1 uppercase tracking-wider">
                PRIMARY TRANSMISSION INBOX
              </span>
              <a
                href={`mailto:${profile?.contactEmail || "jaishanthcys@gmail.com"}`}
                className="font-mono text-sm text-white hover:text-[var(--color-signal-red)] font-semibold transition-colors"
              >
                {profile?.contactEmail || "jaishanthcys@gmail.com"}
              </a>
            </div>

            <div className="pt-4 border-t border-white/[0.06]">
              <span className="font-mono text-xs text-zinc-500 block mb-1 uppercase tracking-wider">
                GEOGRAPHIC BASE
              </span>
              <span className="text-sm text-zinc-200 font-medium">
                Tamil Nadu, India
              </span>
            </div>

            <div className="pt-4 border-t border-white/[0.06]">
              <span className="font-mono text-xs text-zinc-500 block mb-1 uppercase tracking-wider">
                RESPONSE SLA
              </span>
              <span className="font-mono text-xs text-emerald-400">
                &lt; 24 HOURS ON DISCLOSURES & RESEARCH
              </span>
            </div>
          </div>

          <div>
            <span className="font-mono text-xs text-zinc-400 block uppercase tracking-wider mb-3">
              // VERIFIED NETWORKS
            </span>
            <div className="flex flex-wrap gap-2">
              {links.map((l) => (
                <a
                  key={l.id}
                  href={l.url}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="px-3.5 py-2 rounded-sm border border-[var(--color-border)] bg-zinc-900/60 hover:bg-zinc-900 hover:border-white/20 text-xs font-mono text-zinc-300 hover:text-white transition-all flex items-center gap-2"
                >
                  <SocialIcon platform={l.platform} iconKey={l.iconKey} className="w-3.5 h-3.5" />
                  <span>{l.platform}</span>
                  <span className="text-zinc-500">↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Transmission Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-8 sm:p-12 rounded-lg border border-[var(--color-border)] bg-[#101014]">
            <div className="flex items-center justify-between pb-4 mb-8 border-b border-white/[0.06] font-mono text-xs">
              <span className="text-zinc-300 flex items-center gap-2">
                <span className="status-pulsar" />
                DISPATCH FORM
              </span>
              <span className="text-zinc-500">AUTHENTICATED TLS</span>
            </div>

            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
}
