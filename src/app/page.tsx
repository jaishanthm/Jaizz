import { resolvePageSEO } from "@/lib/seo";
import { getHomepageFlags } from "@/lib/feature-flags";
import { getProfile } from "@/lib/data/profile";
import { prisma } from "@/lib/prisma";
import HeroSection from "@/components/HeroSection";
import {
  AboutSection, ExperienceSection, SkillsSection, ProjectsSection,
  ResearchSection, CertificationsSection, BlogSection, ContactSection,
  EducationSection, AchievementsSection, BugBountySection
} from "@/components/HomepageSections";

export const revalidate = 1800;

export async function generateMetadata() {
  return resolvePageSEO(
    "/",
    "Jaishanth M",
    "Cybersecurity student, researcher, and software developer."
  );
}

// Phase 5 §3's resolveSectionComponent, implemented for real — one switch
// keyed by flag key, not per-section conditionals scattered through the
// page. Admin reordering (Stage 5's Homepage screen) changes what this
// array renders and in what order, with zero code changes required.
const SECTION_MAP: Record<string, () => Promise<React.ReactNode> | React.ReactNode> = {
  about: AboutSection,
  experience: ExperienceSection,
  skills: SkillsSection,
  projects: ProjectsSection,
  research: ResearchSection,
  certifications: CertificationsSection,
  blog: BlogSection,
  contact: ContactSection,
  education: EducationSection,
  achievements: AchievementsSection,
  bug_bounty: BugBountySection
};

export default async function HomePage() {
  const [profile, homepageFlags, siteSettings] = await Promise.all([
    getProfile(),
    getHomepageFlags(),
    prisma.siteSettings.findUniqueOrThrow({ where: { id: "singleton" } }),
  ]);

  if (!profile) return null; // seed guarantees this row exists; defensive only

  const threeDFlag = await prisma.featureFlag.findUnique({ where: { key: "three_d" } });
  const enabledFlagKeys = new Set(homepageFlags.map((f) => f.key));

  return (
    <>
      <HeroSection
        profile={profile}
        threeDEnabled={threeDFlag?.enabled ?? false}
        threeDMode={siteSettings.threeDMode}
        enabledFlags={enabledFlagKeys}
      />
      {homepageFlags
        .filter((f) => !["hero", "resume", "links", "three_d"].includes(f.key))
        .map((flag) => {
          const Component = SECTION_MAP[flag.key];
          return Component ? <Component key={flag.key} /> : null;
        })}
    </>
  );
}
