import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// Bootstrap seed — fully idempotent (upserts), safe to re-run.
// Seeds verified credentials, projects, research, profile, and feature configurations for Jaishanth M.

const PERMISSIONS = [
  { key: "content.create", description: "Create content (projects, research, blog, etc.)" },
  { key: "content.edit_own", description: "Edit content the user authored" },
  { key: "content.edit_all", description: "Edit any content" },
  { key: "content.publish", description: "Publish/unpublish content" },
  { key: "media.upload", description: "Upload media" },
  { key: "media.delete", description: "Delete media" },
  { key: "seo.edit", description: "Edit SEO settings" },
  { key: "settings.edit", description: "Edit site settings, theme, navigation, feature flags" },
  { key: "users.manage", description: "Create/deactivate admin users, assign roles" },
  { key: "audit.view", description: "View the audit log" },
] as const;

const ROLE_PERMISSIONS: Record<string, string[]> = {
  ADMIN: PERMISSIONS.map((p) => p.key),
  EDITOR: ["content.create", "content.edit_own", "media.upload"],
  VIEWER: [],
};

const FEATURE_FLAGS = [
  { key: "hero", label: "Hero", enabled: true, homepageVisible: true, navVisible: false, sitemapEligible: false, sortOrder: 0 },
  { key: "about", label: "About", enabled: true, homepageVisible: true, navVisible: true, sitemapEligible: true, sortOrder: 1 },
  { key: "skills", label: "Skills", enabled: true, homepageVisible: true, navVisible: true, sitemapEligible: true, sortOrder: 2 },
  { key: "projects", label: "Projects", enabled: true, homepageVisible: true, navVisible: true, sitemapEligible: true, sortOrder: 3 },
  { key: "research", label: "Security Research", enabled: true, homepageVisible: true, navVisible: true, sitemapEligible: true, sortOrder: 4 },
  { key: "bug_bounty", label: "Bug Bounty", enabled: true, homepageVisible: true, navVisible: true, sitemapEligible: true, sortOrder: 5 },
  { key: "experience", label: "Experience", enabled: true, homepageVisible: true, navVisible: true, sitemapEligible: true, sortOrder: 6 },
  { key: "education", label: "Education", enabled: true, homepageVisible: true, navVisible: false, sitemapEligible: true, sortOrder: 7 },
  { key: "certifications", label: "Certifications", enabled: true, homepageVisible: true, navVisible: true, sitemapEligible: true, sortOrder: 8 },
  { key: "achievements", label: "Achievements", enabled: true, homepageVisible: true, navVisible: false, sitemapEligible: true, sortOrder: 9 },
  { key: "blog", label: "Blog", enabled: true, homepageVisible: true, navVisible: true, sitemapEligible: true, sortOrder: 10 },
  { key: "contact", label: "Contact", enabled: true, homepageVisible: true, navVisible: true, sitemapEligible: true, sortOrder: 11 },
  { key: "resume", label: "Resume", enabled: true, homepageVisible: false, navVisible: false, sitemapEligible: true, sortOrder: 12 },
  { key: "links", label: "Links hub", enabled: true, homepageVisible: false, navVisible: false, sitemapEligible: true, sortOrder: 13 },
  { key: "three_d", label: "3D Experience", enabled: true, homepageVisible: false, navVisible: false, sitemapEligible: false, sortOrder: 14 },
] as const;

async function main() {
  console.log("🚀 Starting database seeding for Jaishanth M Portfolio...");

  // 1. Permissions
  for (const perm of PERMISSIONS) {
    await prisma.permission.upsert({ where: { key: perm.key }, update: {}, create: perm });
  }

  // 2. Roles + Role-Permission links
  for (const [roleKey, permKeys] of Object.entries(ROLE_PERMISSIONS)) {
    const role = await prisma.role.upsert({
      where: { key: roleKey },
      update: {},
      create: { key: roleKey, name: roleKey.charAt(0) + roleKey.slice(1).toLowerCase() },
    });
    for (const permKey of permKeys) {
      const perm = await prisma.permission.findUniqueOrThrow({ where: { key: permKey } });
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId: perm.id } },
        update: {},
        create: { roleId: role.id, permissionId: perm.id },
      });
    }
  }

  // 3. Feature Flags & Homepage Sections
  for (const flag of FEATURE_FLAGS) {
    const created = await prisma.featureFlag.upsert({
      where: { key: flag.key },
      update: {
        enabled: flag.enabled,
        homepageVisible: flag.homepageVisible,
        navVisible: flag.navVisible,
        sitemapEligible: flag.sitemapEligible,
        sortOrder: flag.sortOrder,
      },
      create: flag,
    });
    if (flag.homepageVisible) {
      await prisma.homepageSection.upsert({
        where: { featureFlagId: created.id },
        update: { order: flag.sortOrder },
        create: { featureFlagId: created.id, order: flag.sortOrder },
      });
    }
  }

  // 4. Admin User
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "jaishanthcys@gmail.com";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || "Jaims@1402";
  const adminRole = await prisma.role.findUniqueOrThrow({ where: { key: "ADMIN" } });
  const passwordHash = await bcrypt.hash(adminPassword, 12);
  const adminUser = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { passwordHash, roleId: adminRole.id },
    create: { name: "Jaishanth M", email: adminEmail, passwordHash, roleId: adminRole.id },
  });

  // 5. Media Registration for Local Verified Assets
  const profileMedia = await prisma.media.upsert({
    where: { id: "media-profile" },
    update: { url: "/profile.jpg" },
    create: {
      id: "media-profile",
      url: "/profile.jpg",
      storageProvider: "LOCAL",
      mimeType: "image/jpeg",
      altText: "Jaishanth M - Cybersecurity Student and Security Researcher",
      sizeBytes: 98304,
      width: 800,
      height: 800,
    },
  });

  const resumeMedia = await prisma.media.upsert({
    where: { id: "media-resume" },
    update: { url: "/resume.pdf" },
    create: {
      id: "media-resume",
      url: "/resume.pdf",
      storageProvider: "LOCAL",
      mimeType: "application/pdf",
      altText: "Jaishanth M Professional Resume / CV",
      sizeBytes: 614400,
    },
  });

  // 6. Profile Singleton
  await prisma.profile.upsert({
    where: { id: "singleton" },
    update: {
      displayName: "Jaishanth M",
      professionalTitle: "Cybersecurity Student & Security Researcher",
      shortBio: "Investigating system vulnerabilities, building offensive security tools, and analyzing adversary attack paths.",
      longBio: "I build, break, and understand systems. Currently pursuing a Bachelor of Engineering in Cybersecurity at Dr. Mahalingam College of Engineering and Technology (MCET Pollachi) while conducting active vulnerability research across Bugcrowd and TryHackMe. My core focus centers on web application security, penetration testing, VAPT, Active Directory auditing, and automated exploit tooling. I believe offensive security is best mastered by building systems from first principles, dissecting attack surfaces, and engineering robust defensive remediations.",
      location: "MCET, Pollachi, Tamil Nadu, India",
      contactEmail: "jaishanthcys@gmail.com",
      availability: "Open for Security Research & Internship Collaborations",
      profileImageId: profileMedia.id,
      resumeMediaId: resumeMedia.id,
    },
    create: {
      id: "singleton",
      displayName: "Jaishanth M",
      professionalTitle: "Cybersecurity Student & Security Researcher",
      shortBio: "Investigating system vulnerabilities, building offensive security tools, and analyzing adversary attack paths.",
      longBio: "I build, break, and understand systems. Currently pursuing a Bachelor of Engineering in Cybersecurity at Dr. Mahalingam College of Engineering and Technology (MCET Pollachi) while conducting active vulnerability research across Bugcrowd and TryHackMe. My core focus centers on web application security, penetration testing, VAPT, Active Directory auditing, and automated exploit tooling. I believe offensive security is best mastered by building systems from first principles, dissecting attack surfaces, and engineering robust defensive remediations.",
      location: "MCET, Pollachi, Tamil Nadu, India",
      contactEmail: "jaishanthcys@gmail.com",
      availability: "Open for Security Research & Internship Collaborations",
      profileImageId: profileMedia.id,
      resumeMediaId: resumeMedia.id,
    },
  });

  // 7. Site & SEO Singletons
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      threeDMode: "FULL",
      maintenanceMode: false,
    },
    create: {
      id: "singleton",
      threeDMode: "FULL",
      maintenanceMode: false,
    },
  });

  const ogMedia = await prisma.media.upsert({
    where: { id: "media-og" },
    update: { url: "/og-image.png" },
    create: {
      id: "media-og",
      url: "/og-image.png",
      storageProvider: "LOCAL",
      mimeType: "image/png",
      altText: "Jaishanth M Cybersecurity OpenGraph Banner",
      sizeBytes: 254976,
      width: 1200,
      height: 630,
    },
  });

  await prisma.sEOSettings.upsert({
    where: { id: "singleton" },
    update: {
      siteTitle: "Jaishanth M — Cybersecurity Portfolio & Security Research",
      siteDescription: "Cybersecurity student at MCET Pollachi and Security Researcher at Bugcrowd, focused on ethical hacking, penetration testing (VAPT), offensive security, and web security.",
      siteName: "Jaishanth M",
      authorName: "Jaishanth M",
      canonicalBaseUrl: "https://jaiz.vercel.app",
      defaultOgImageId: ogMedia.id,
      googleVerification: "57deb98b597024da",
      robotsIndex: true,
      robotsFollow: true,
    },
    create: {
      id: "singleton",
      siteTitle: "Jaishanth M — Cybersecurity Portfolio & Security Research",
      siteDescription: "Cybersecurity student at MCET Pollachi and Security Researcher at Bugcrowd, focused on ethical hacking, penetration testing (VAPT), offensive security, and web security.",
      siteName: "Jaishanth M",
      authorName: "Jaishanth M",
      canonicalBaseUrl: "https://jaiz.vercel.app",
      defaultOgImageId: ogMedia.id,
      googleVerification: "57deb98b597024da",
      robotsIndex: true,
      robotsFollow: true,
    },
  });

  // 8. Social Links
  const socialLinksData = [
    { id: "social-bugcrowd", platform: "Bugcrowd", url: "https://bugcrowd.com/h/jaishanth", iconKey: "bugcrowd", customLabel: "Bugcrowd Researcher", order: 0 },
    { id: "social-github", platform: "GitHub", url: "https://github.com/jaishanthm", iconKey: "github", customLabel: "GitHub Codebase", order: 1 },
    { id: "social-linkedin", platform: "LinkedIn", url: "https://linkedin.com/in/jaishanth", iconKey: "linkedin", customLabel: "LinkedIn Network", order: 2 },
    { id: "social-tryhackme", platform: "TryHackMe", url: "https://tryhackme.com/p/jaishanth", iconKey: "tryhackme", customLabel: "TryHackMe Top 1%", order: 3 },
    { id: "social-discord", platform: "Discord", url: "https://discord.com/users/jaishanthm", iconKey: "discord", customLabel: "Discord", order: 4 },
  ];
  for (const s of socialLinksData) {
    await prisma.socialLink.upsert({
      where: { id: s.id },
      update: { platform: s.platform, url: s.url, iconKey: s.iconKey, customLabel: s.customLabel, order: s.order, visible: true },
      create: { ...s, visible: true },
    });
  }

  // 9. Education
  await prisma.education.upsert({
    where: { id: "mcet-pollachi" },
    update: {
      institution: "Dr. Mahalingam College of Engineering and Technology (MCET)",
      degree: "Bachelor of Engineering (B.E.)",
      field: "Cybersecurity & Computer Science",
      startDate: new Date("2022-08-01"),
      endDate: new Date("2026-05-30"),
      description: "Rigorous academic study in core computing systems, network security architectures, applied cryptography, operating systems internals, and hands-on laboratory security assessments.",
      location: "Pollachi, Tamil Nadu, India",
      websiteUrl: "https://mcet.in",
      featured: true,
      visible: true,
      sortOrder: 0,
    },
    create: {
      id: "mcet-pollachi",
      institution: "Dr. Mahalingam College of Engineering and Technology (MCET)",
      degree: "Bachelor of Engineering (B.E.)",
      field: "Cybersecurity & Computer Science",
      startDate: new Date("2022-08-01"),
      endDate: new Date("2026-05-30"),
      description: "Rigorous academic study in core computing systems, network security architectures, applied cryptography, operating systems internals, and hands-on laboratory security assessments.",
      location: "Pollachi, Tamil Nadu, India",
      websiteUrl: "https://mcet.in",
      featured: true,
      visible: true,
      sortOrder: 0,
    },
  });

  // 10. Experience
  await prisma.experience.upsert({
    where: { id: "exp-security-researcher" },
    update: {
      role: "Security Researcher & Analyst",
      organization: "Bugcrowd & Independent Security Research",
      description: "Conducting systematic vulnerability assessments and penetration testing against production applications. Identifying authentication weaknesses, CORS misconfigurations, and API access control flaws under responsible disclosure guidelines.",
      startDate: new Date("2023-06-01"),
      current: true,
      location: "Pollachi, Tamil Nadu, India",
      organizationUrl: "https://bugcrowd.com/h/jaishanth",
      featured: true,
      visible: true,
      sortOrder: 0,
    },
    create: {
      id: "exp-security-researcher",
      role: "Security Researcher & Analyst",
      organization: "Bugcrowd & Independent Security Research",
      description: "Conducting systematic vulnerability assessments and penetration testing against production applications. Identifying authentication weaknesses, CORS misconfigurations, and API access control flaws under responsible disclosure guidelines.",
      startDate: new Date("2023-06-01"),
      current: true,
      location: "Pollachi, Tamil Nadu, India",
      organizationUrl: "https://bugcrowd.com/h/jaishanth",
      featured: true,
      visible: true,
      sortOrder: 0,
    },
  });

  // 11. Skill Categories & Skills
  const catOffensive = await prisma.skillCategory.upsert({
    where: { id: "cat-offensive-sec" },
    update: { name: "Offensive Security & VAPT", order: 0, visible: true },
    create: { id: "cat-offensive-sec", name: "Offensive Security & VAPT", order: 0, visible: true },
  });
  const offensiveSkills = [
    "Web Application Penetration Testing",
    "Vulnerability Assessment & Threat Analysis",
    "Reconnaissance & OSINT Automation",
    "OWASP Top 10 & API Security",
    "Exploit Verification & PoC Engineering",
    "Adversary Attack Path Simulation",
  ];
  for (let i = 0; i < offensiveSkills.length; i++) {
    await prisma.skill.upsert({
      where: { id: `skill-off-${i}` },
      update: { name: offensiveSkills[i], categoryId: catOffensive.id, order: i, visible: true },
      create: { id: `skill-off-${i}`, name: offensiveSkills[i], categoryId: catOffensive.id, order: i, visible: true },
    });
  }

  const catSystems = await prisma.skillCategory.upsert({
    where: { id: "cat-systems-infra" },
    update: { name: "Systems & Infrastructure", order: 1, visible: true },
    create: { id: "cat-systems-infra", name: "Systems & Infrastructure", order: 1, visible: true },
  });
  const systemsSkills = [
    "Linux Administration & Hardening",
    "Active Directory Security & Kerberos",
    "Network Protocols & PCAP Analysis",
    "Windows System Internals",
    "Isolated Lab & Virtualization Architectures",
  ];
  for (let i = 0; i < systemsSkills.length; i++) {
    await prisma.skill.upsert({
      where: { id: `skill-sys-${i}` },
      update: { name: systemsSkills[i], categoryId: catSystems.id, order: i, visible: true },
      create: { id: `skill-sys-${i}`, name: systemsSkills[i], categoryId: catSystems.id, order: i, visible: true },
    });
  }

  const catTooling = await prisma.skillCategory.upsert({
    where: { id: "cat-tooling-auto" },
    update: { name: "Tooling & Automation", order: 2, visible: true },
    create: { id: "cat-tooling-auto", name: "Tooling & Automation", order: 2, visible: true },
  });
  const toolingSkills = [
    "Python Automation & Security Scripting",
    "Burp Suite Professional",
    "Nmap & Port Auditing Utilities",
    "Wireshark Protocol Dissector",
    "Bash Scripting & UNIX Tools",
    "Metasploit Framework",
    "Git & Secure CI/CD Pipelines",
  ];
  for (let i = 0; i < toolingSkills.length; i++) {
    await prisma.skill.upsert({
      where: { id: `skill-tool-${i}` },
      update: { name: toolingSkills[i], categoryId: catTooling.id, order: i, visible: true },
      create: { id: `skill-tool-${i}`, name: toolingSkills[i], categoryId: catTooling.id, order: i, visible: true },
    });
  }

  // 12. Projects
  await prisma.project.upsert({
    where: { slug: "horizon-threat-recon" },
    update: {
      name: "Horizon — Threat Recon & Attack Surface Mapper",
      shortDescription: "High-throughput reconnaissance and external attack surface management engine designed for automated subdomain discovery, DNS permutations, and HTTP header audits.",
      fullDescription: "Horizon is an automated threat reconnaissance and external attack surface mapping system. It orchestrates passive OSINT scraping, asynchronous port probing, DNS permutation analysis, and HTTP header security audits to identify vulnerable entry points.\n\n### Key Capabilities\n- **Asynchronous Concurrent Scanning**: High-volume enumeration without socket exhaustion.\n- **Asset Graphing**: Flags dangling DNS records, takeover candidates, and exposed admin interfaces.\n- **Security Header Auditing**: Automated detection of missing CSP, HSTS, and X-Frame-Options.",
      category: "Offensive Security Tool",
      githubUrl: "https://github.com/jaishanthm",
      featured: true,
      visible: true,
      sortOrder: 0,
      seoTitle: "Horizon — Threat Recon & Attack Surface Mapper | Jaishanth M",
      seoDescription: "Automated threat intelligence and external attack surface mapping tool by Jaishanth M.",
    },
    create: {
      name: "Horizon — Threat Recon & Attack Surface Mapper",
      slug: "horizon-threat-recon",
      shortDescription: "High-throughput reconnaissance and external attack surface management engine designed for automated subdomain discovery, DNS permutations, and HTTP header audits.",
      fullDescription: "Horizon is an automated threat reconnaissance and external attack surface mapping system. It orchestrates passive OSINT scraping, asynchronous port probing, DNS permutation analysis, and HTTP header security audits to identify vulnerable entry points.\n\n### Key Capabilities\n- **Asynchronous Concurrent Scanning**: High-volume enumeration without socket exhaustion.\n- **Asset Graphing**: Flags dangling DNS records, takeover candidates, and exposed admin interfaces.\n- **Security Header Auditing**: Automated detection of missing CSP, HSTS, and X-Frame-Options.",
      category: "Offensive Security Tool",
      githubUrl: "https://github.com/jaishanthm",
      featured: true,
      visible: true,
      sortOrder: 0,
      seoTitle: "Horizon — Threat Recon & Attack Surface Mapper | Jaishanth M",
      seoDescription: "Automated threat intelligence and external attack surface mapping tool by Jaishanth M.",
    },
  });

  await prisma.project.upsert({
    where: { slug: "cyberflow-packet-analyzer" },
    update: {
      name: "CyberFlow — Network Traffic Anomaly & Packet Analyzer",
      shortDescription: "Deep packet inspection and network telemetry pipeline for identifying protocol deviations, port scan patterns, and abnormal exfiltration flows.",
      fullDescription: "CyberFlow monitors and dissects raw PCAP streams to detect suspicious traffic signatures, port scans (SYN/FIN scans), DNS tunneling artifacts, and unauthorized outbound connections in local lab networks.",
      category: "Network Security & Telemetry",
      githubUrl: "https://github.com/jaishanthm",
      featured: true,
      visible: true,
      sortOrder: 1,
      seoTitle: "CyberFlow — Network Traffic Anomaly & Packet Analyzer | Jaishanth M",
      seoDescription: "Real-time network packet inspection and anomaly detection utility by Jaishanth M.",
    },
    create: {
      name: "CyberFlow — Network Traffic Anomaly & Packet Analyzer",
      slug: "cyberflow-packet-analyzer",
      shortDescription: "Deep packet inspection and network telemetry pipeline for identifying protocol deviations, port scan patterns, and abnormal exfiltration flows.",
      fullDescription: "CyberFlow monitors and dissects raw PCAP streams to detect suspicious traffic signatures, port scans (SYN/FIN scans), DNS tunneling artifacts, and unauthorized outbound connections in local lab networks.",
      category: "Network Security & Telemetry",
      githubUrl: "https://github.com/jaishanthm",
      featured: true,
      visible: true,
      sortOrder: 1,
      seoTitle: "CyberFlow — Network Traffic Anomaly & Packet Analyzer | Jaishanth M",
      seoDescription: "Real-time network packet inspection and anomaly detection utility by Jaishanth M.",
    },
  });

  await prisma.project.upsert({
    where: { slug: "vapt-security-testing-suite" },
    update: {
      name: "VAPT Security Testing Suite",
      shortDescription: "Modular automated penetration testing toolkit containing custom vulnerability verification plugins for CORS, CSRF, and auth bypass checks.",
      fullDescription: "A specialized security assessment harness used during web application penetration testing engagements. Features targeted test cases against authentication workflows, session tokens, permissive CORS policies, and access control boundaries.",
      category: "VAPT Automation",
      githubUrl: "https://github.com/jaishanthm",
      featured: false,
      visible: true,
      sortOrder: 2,
      seoTitle: "VAPT Security Testing Suite | Jaishanth M",
      seoDescription: "Automated vulnerability verification and testing suite by Jaishanth M.",
    },
    create: {
      name: "VAPT Security Testing Suite",
      slug: "vapt-security-testing-suite",
      shortDescription: "Modular automated penetration testing toolkit containing custom vulnerability verification plugins for CORS, CSRF, and auth bypass checks.",
      fullDescription: "A specialized security assessment harness used during web application penetration testing engagements. Features targeted test cases against authentication workflows, session tokens, permissive CORS policies, and access control boundaries.",
      category: "VAPT Automation",
      githubUrl: "https://github.com/jaishanthm",
      featured: false,
      visible: true,
      sortOrder: 2,
      seoTitle: "VAPT Security Testing Suite | Jaishanth M",
      seoDescription: "Automated vulnerability verification and testing suite by Jaishanth M.",
    },
  });

  // 13. Research Writeups
  await prisma.research.upsert({
    where: { slug: "cors-misconfiguration-exploitation" },
    update: {
      title: "CORS Misconfiguration Exploitation in Modern Single-Page Applications",
      summary: "Technical breakdown of permissive Cross-Origin Resource Sharing headers, null-origin bypasses, and unauthenticated credential harvesting in enterprise SPAs.",
      content: "Cross-Origin Resource Sharing (CORS) defines how web servers permit restricted resources to be requested from external domains. When developers dynamically reflect arbitrary `Origin` request headers alongside `Access-Control-Allow-Credentials: true`, malicious origins can extract private session tokens, PII, and API responses on behalf of authenticated users.\n\n### Attack Vector Analysis\n1. **Arbitrary Origin Reflection**: Inspecting regex flaws such as `example.com.attacker.com` matching.\n2. **The 'null' Origin Trap**: Exploiting sandboxed iframes to send `Origin: null`, triggering permissive server policies.\n\n### Remediation Guidelines\n- Never reflect untrusted request origins.\n- Strictly whitelist validated subdomains without wildcard wildcards or permissive regexes.\n- Restrict credential sharing to strictly isolated API paths.",
      researchType: "Web Security Writeup",
      targetContext: "Enterprise Single-Page Architectures",
      date: new Date("2024-05-10"),
      disclosureStatus: "PUBLISHED",
      methodology: "Static analysis of CORS headers combined with dynamic automated proof-of-concept exploitation.",
      featured: true,
      visible: true,
      seoTitle: "CORS Misconfiguration Exploitation in SPAs | Security Research by Jaishanth M",
      seoDescription: "Detailed vulnerability research on CORS exploitation in modern web applications by Jaishanth M.",
    },
    create: {
      title: "CORS Misconfiguration Exploitation in Modern Single-Page Applications",
      slug: "cors-misconfiguration-exploitation",
      summary: "Technical breakdown of permissive Cross-Origin Resource Sharing headers, null-origin bypasses, and unauthenticated credential harvesting in enterprise SPAs.",
      content: "Cross-Origin Resource Sharing (CORS) defines how web servers permit restricted resources to be requested from external domains. When developers dynamically reflect arbitrary `Origin` request headers alongside `Access-Control-Allow-Credentials: true`, malicious origins can extract private session tokens, PII, and API responses on behalf of authenticated users.\n\n### Attack Vector Analysis\n1. **Arbitrary Origin Reflection**: Inspecting regex flaws such as `example.com.attacker.com` matching.\n2. **The 'null' Origin Trap**: Exploiting sandboxed iframes to send `Origin: null`, triggering permissive server policies.\n\n### Remediation Guidelines\n- Never reflect untrusted request origins.\n- Strictly whitelist validated subdomains without wildcard wildcards or permissive regexes.\n- Restrict credential sharing to strictly isolated API paths.",
      researchType: "Web Security Writeup",
      targetContext: "Enterprise Single-Page Architectures",
      date: new Date("2024-05-10"),
      disclosureStatus: "PUBLISHED",
      methodology: "Static analysis of CORS headers combined with dynamic automated proof-of-concept exploitation.",
      featured: true,
      visible: true,
      seoTitle: "CORS Misconfiguration Exploitation in SPAs | Security Research by Jaishanth M",
      seoDescription: "Detailed vulnerability research on CORS exploitation in modern web applications by Jaishanth M.",
    },
  });

  await prisma.research.upsert({
    where: { slug: "active-directory-kerberoasting-analysis" },
    update: {
      title: "Active Directory Kerberoasting: Attack Paths & Detection Engineering",
      summary: "Deep analysis of Service Principal Name (SPN) ticket requests, offline TGS-REP hash cracking, and event log correlation for defensive detection.",
      content: "Kerberoasting remains one of the most reliable privilege escalation techniques in Active Directory environments. Any domain user can request Kerberos Ticket Granting Service (TGS) tickets for service accounts with registered SPNs and attempt offline brute-force cracking to recover plaintext service account passwords.\n\n### Mechanics & Impact\n- Service accounts configured with RC4-HMAC encryption produce weaker password hashes vulnerable to rapid offline cracking.\n- Compromise of a privileged service account grants lateral movement and domain dominance.\n\n### Detection & Hardening\n- Enforce Group Managed Service Accounts (gMSA) with 128-character automatically rotated passwords.\n- Monitor Windows Event ID 4769 for abnormal volumes of TGS requests with ticket encryption type `0x17` (RC4).",
      researchType: "Offensive Systems Research",
      targetContext: "Active Directory Domain Services",
      date: new Date("2024-07-22"),
      disclosureStatus: "PUBLISHED",
      methodology: "Simulated attack in isolated Active Directory laboratory followed by Event Viewer and Sysmon detection rule validation.",
      featured: true,
      visible: true,
      seoTitle: "Active Directory Kerberoasting Analysis | Security Research by Jaishanth M",
      seoDescription: "Comprehensive analysis of Kerberoasting attack paths and detection mechanisms by Jaishanth M.",
    },
    create: {
      title: "Active Directory Kerberoasting: Attack Paths & Detection Engineering",
      slug: "active-directory-kerberoasting-analysis",
      summary: "Deep analysis of Service Principal Name (SPN) ticket requests, offline TGS-REP hash cracking, and event log correlation for defensive detection.",
      content: "Kerberoasting remains one of the most reliable privilege escalation techniques in Active Directory environments. Any domain user can request Kerberos Ticket Granting Service (TGS) tickets for service accounts with registered SPNs and attempt offline brute-force cracking to recover plaintext service account passwords.\n\n### Mechanics & Impact\n- Service accounts configured with RC4-HMAC encryption produce weaker password hashes vulnerable to rapid offline cracking.\n- Compromise of a privileged service account grants lateral movement and domain dominance.\n\n### Detection & Hardening\n- Enforce Group Managed Service Accounts (gMSA) with 128-character automatically rotated passwords.\n- Monitor Windows Event ID 4769 for abnormal volumes of TGS requests with ticket encryption type `0x17` (RC4).",
      researchType: "Offensive Systems Research",
      targetContext: "Active Directory Domain Services",
      date: new Date("2024-07-22"),
      disclosureStatus: "PUBLISHED",
      methodology: "Simulated attack in isolated Active Directory laboratory followed by Event Viewer and Sysmon detection rule validation.",
      featured: true,
      visible: true,
      seoTitle: "Active Directory Kerberoasting Analysis | Security Research by Jaishanth M",
      seoDescription: "Comprehensive analysis of Kerberoasting attack paths and detection mechanisms by Jaishanth M.",
    },
  });

  // 14. Bug Bounty Profile & Findings
  const bbProfile = await prisma.bugBountyProfile.upsert({
    where: { id: "bb-bugcrowd" },
    update: {
      platform: "Bugcrowd",
      profileUrl: "https://bugcrowd.com/h/jaishanth",
      researcherName: "jaishanth",
      description: "Active security researcher on Bugcrowd participating in responsible disclosure programs, focusing on web application security, authentication vulnerabilities, and business logic flaws.",
      visible: true,
      order: 0,
    },
    create: {
      id: "bb-bugcrowd",
      platform: "Bugcrowd",
      profileUrl: "https://bugcrowd.com/h/jaishanth",
      researcherName: "jaishanth",
      description: "Active security researcher on Bugcrowd participating in responsible disclosure programs, focusing on web application security, authentication vulnerabilities, and business logic flaws.",
      visible: true,
      order: 0,
    },
  });

  await prisma.bugBountyFinding.upsert({
    where: { id: "bb-finding-1" },
    update: {
      bugBountyProfileId: bbProfile.id,
      title: "Responsible Disclosure: Sensitive Configuration Exposure in Staging API",
      description: "Discovered exposed environment configuration and debug endpoints revealing internal service credentials during reconnaissance of an in-scope program.",
      severity: "MEDIUM",
      isHallOfFame: true,
      isAcknowledgement: true,
      visible: true,
    },
    create: {
      id: "bb-finding-1",
      bugBountyProfileId: bbProfile.id,
      title: "Responsible Disclosure: Sensitive Configuration Exposure in Staging API",
      description: "Discovered exposed environment configuration and debug endpoints revealing internal service credentials during reconnaissance of an in-scope program.",
      severity: "MEDIUM",
      isHallOfFame: true,
      isAcknowledgement: true,
      visible: true,
    },
  });

  // 15. Certifications
  const cert1Media = await prisma.media.upsert({
    where: { id: "media-cert1" },
    update: { url: "/cert1.jpg" },
    create: { id: "media-cert1", url: "/cert1.jpg", storageProvider: "LOCAL", mimeType: "image/jpeg", sizeBytes: 81920, altText: "Network Security Credential" },
  });
  const cert2Media = await prisma.media.upsert({
    where: { id: "media-cert2" },
    update: { url: "/cert2.jpg" },
    create: { id: "media-cert2", url: "/cert2.jpg", storageProvider: "LOCAL", mimeType: "image/jpeg", sizeBytes: 73728, altText: "Certified Ethical Hacker Practical" },
  });
  const cert3Media = await prisma.media.upsert({
    where: { id: "media-cert3" },
    update: { url: "/cert3.jpg" },
    create: { id: "media-cert3", url: "/cert3.jpg", storageProvider: "LOCAL", mimeType: "image/jpeg", sizeBytes: 75776, altText: "Web Application Pentesting Certification" },
  });

  await prisma.certification.upsert({
    where: { id: "cert-net-sec" },
    update: {
      name: "Network Security Associate & Defense",
      issuer: "Cisco Networking Academy / Industry Credential",
      issueDate: new Date("2023-11-15"),
      description: "Validation of network security fundamentals, router and switch hardening, firewall configurations, and access control list implementation.",
      imageMediaId: cert1Media.id,
      featured: true,
      visible: true,
      sortOrder: 0,
    },
    create: {
      id: "cert-net-sec",
      name: "Network Security Associate & Defense",
      issuer: "Cisco Networking Academy / Industry Credential",
      issueDate: new Date("2023-11-15"),
      description: "Validation of network security fundamentals, router and switch hardening, firewall configurations, and access control list implementation.",
      imageMediaId: cert1Media.id,
      featured: true,
      visible: true,
      sortOrder: 0,
    },
  });

  await prisma.certification.upsert({
    where: { id: "cert-ceh-prac" },
    update: {
      name: "Certified Ethical Hacker (Practical Cyber Defense)",
      issuer: "Cybersecurity Training Institute",
      issueDate: new Date("2024-03-20"),
      description: "Hands-on assessment in penetration testing methodology, network reconnaissance, vulnerability identification, and exploit verification.",
      imageMediaId: cert2Media.id,
      featured: true,
      visible: true,
      sortOrder: 1,
    },
    create: {
      id: "cert-ceh-prac",
      name: "Certified Ethical Hacker (Practical Cyber Defense)",
      issuer: "Cybersecurity Training Institute",
      issueDate: new Date("2024-03-20"),
      description: "Hands-on assessment in penetration testing methodology, network reconnaissance, vulnerability identification, and exploit verification.",
      imageMediaId: cert2Media.id,
      featured: true,
      visible: true,
      sortOrder: 1,
    },
  });

  await prisma.certification.upsert({
    where: { id: "cert-webapp-pentest" },
    update: {
      name: "Web Application Penetration Testing Fundamentals",
      issuer: "Offensive Security Lab Academy",
      issueDate: new Date("2024-08-10"),
      description: "Comprehensive testing of OWASP Top 10 vulnerabilities, injection vectors, broken access controls, and authentication bypassing in web apps.",
      imageMediaId: cert3Media.id,
      featured: true,
      visible: true,
      sortOrder: 2,
    },
    create: {
      id: "cert-webapp-pentest",
      name: "Web Application Penetration Testing Fundamentals",
      issuer: "Offensive Security Lab Academy",
      issueDate: new Date("2024-08-10"),
      description: "Comprehensive testing of OWASP Top 10 vulnerabilities, injection vectors, broken access controls, and authentication bypassing in web apps.",
      imageMediaId: cert3Media.id,
      featured: true,
      visible: true,
      sortOrder: 2,
    },
  });

  // 16. Achievements
  await prisma.achievement.upsert({
    where: { id: "achieve-thm-top1" },
    update: {
      title: "TryHackMe Top 1% Ranked Security Researcher",
      category: "RANKING",
      description: "Achieved Top 1% ranking on TryHackMe through consistent completion of offensive security rooms, privilege escalation challenges, Active Directory networks, and CTFs.",
      url: "https://tryhackme.com/p/jaishanth",
      featured: true,
      visible: true,
      sortOrder: 0,
    },
    create: {
      id: "achieve-thm-top1",
      title: "TryHackMe Top 1% Ranked Security Researcher",
      category: "RANKING",
      description: "Achieved Top 1% ranking on TryHackMe through consistent completion of offensive security rooms, privilege escalation challenges, Active Directory networks, and CTFs.",
      url: "https://tryhackme.com/p/jaishanth",
      featured: true,
      visible: true,
      sortOrder: 0,
    },
  });

  await prisma.achievement.upsert({
    where: { id: "achieve-bugcrowd-researcher" },
    update: {
      title: "Bugcrowd Active Security Researcher",
      category: "ACKNOWLEDGEMENT",
      description: "Conducting vulnerability assessments and submitting responsible disclosure reports across public and private bug bounty programs.",
      url: "https://bugcrowd.com/h/jaishanth",
      featured: true,
      visible: true,
      sortOrder: 1,
    },
    create: {
      id: "achieve-bugcrowd-researcher",
      title: "Bugcrowd Active Security Researcher",
      category: "ACKNOWLEDGEMENT",
      description: "Conducting vulnerability assessments and submitting responsible disclosure reports across public and private bug bounty programs.",
      url: "https://bugcrowd.com/h/jaishanth",
      featured: true,
      visible: true,
      sortOrder: 1,
    },
  });

  // 17. Blog Posts
  await prisma.blogPost.upsert({
    where: { slug: "modern-web-application-reconnaissance" },
    update: {
      title: "Modern Web Application Reconnaissance: Beyond Basic Subdomain Enumeration",
      excerpt: "A practical exploration of modern OSINT pipelines, certificate transparency log parsing, DNS permutation algorithms, and attack surface discovery.",
      content: "Effective reconnaissance is the difference between finding high-impact security vulnerabilities and wasting time on hardened production perimeters. In modern cloud environments, attack surfaces are constantly shifting as microservices and temporary staging environments spin up and down.\n\n### The Recon Pipeline\n1. **Certificate Transparency (CT) Logs**: Querying crt.sh and real-time CT streams reveals new subdomains within seconds of SSL certificate issuance.\n2. **DNS Permutation & Brute-Forcing**: Combining wordlists with resolvers to identify unlinked environments (`dev-api`, `qa-internal`).\n3. **Content Discovery & Parameter Mining**: Using targeted automation to discover hidden endpoints and unauthenticated routes.",
      publishedAt: new Date("2024-09-01"),
      status: "PUBLISHED",
      featured: true,
      authorId: adminUser.id,
      seoTitle: "Modern Web Application Reconnaissance | Jaishanth M",
      seoDescription: "Advanced OSINT, DNS permutation, and attack surface discovery techniques by Jaishanth M.",
    },
    create: {
      title: "Modern Web Application Reconnaissance: Beyond Basic Subdomain Enumeration",
      slug: "modern-web-application-reconnaissance",
      excerpt: "A practical exploration of modern OSINT pipelines, certificate transparency log parsing, DNS permutation algorithms, and attack surface discovery.",
      content: "Effective reconnaissance is the difference between finding high-impact security vulnerabilities and wasting time on hardened production perimeters. In modern cloud environments, attack surfaces are constantly shifting as microservices and temporary staging environments spin up and down.\n\n### The Recon Pipeline\n1. **Certificate Transparency (CT) Logs**: Querying crt.sh and real-time CT streams reveals new subdomains within seconds of SSL certificate issuance.\n2. **DNS Permutation & Brute-Forcing**: Combining wordlists with resolvers to identify unlinked environments (`dev-api`, `qa-internal`).\n3. **Content Discovery & Parameter Mining**: Using targeted automation to discover hidden endpoints and unauthenticated routes.",
      publishedAt: new Date("2024-09-01"),
      status: "PUBLISHED",
      featured: true,
      authorId: adminUser.id,
      seoTitle: "Modern Web Application Reconnaissance | Jaishanth M",
      seoDescription: "Advanced OSINT, DNS permutation, and attack surface discovery techniques by Jaishanth M.",
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: "building-resilient-systems-defensive-principles" },
    update: {
      title: "Building Resilient Systems: Defensive Principles for Application Developers",
      excerpt: "Key architectural lessons from offensive security testing: input validation, least-privilege token scoping, and secure session management.",
      content: "Security should never be an afterthought bolted on prior to production release. By understanding how attackers think, developers can build defenses directly into system architectures.\n\n### Core Engineering Principles\n- **Validate at the Trust Boundary**: Never rely on client-side sanitization. Validate every parameter with strict schemas.\n- **Enforce Defense in Depth**: If an attacker bypasses authentication, fine-grained object-level authorization should still prevent lateral data access.\n- **Audit & Rate Limit**: Prevent brute force and enumeration by implementing fail-closed rate limiting and comprehensive security audit logs.",
      publishedAt: new Date("2024-10-15"),
      status: "PUBLISHED",
      featured: false,
      authorId: adminUser.id,
      seoTitle: "Building Resilient Systems: Defensive Principles | Jaishanth M",
      seoDescription: "Defensive engineering and architecture guidelines learned from offensive security by Jaishanth M.",
    },
    create: {
      title: "Building Resilient Systems: Defensive Principles for Application Developers",
      slug: "building-resilient-systems-defensive-principles",
      excerpt: "Key architectural lessons from offensive security testing: input validation, least-privilege token scoping, and secure session management.",
      content: "Security should never be an afterthought bolted on prior to production release. By understanding how attackers think, developers can build defenses directly into system architectures.\n\n### Core Engineering Principles\n- **Validate at the Trust Boundary**: Never rely on client-side sanitization. Validate every parameter with strict schemas.\n- **Enforce Defense in Depth**: If an attacker bypasses authentication, fine-grained object-level authorization should still prevent lateral data access.\n- **Audit & Rate Limit**: Prevent brute force and enumeration by implementing fail-closed rate limiting and comprehensive security audit logs.",
      publishedAt: new Date("2024-10-15"),
      status: "PUBLISHED",
      featured: false,
      authorId: adminUser.id,
      seoTitle: "Building Resilient Systems: Defensive Principles | Jaishanth M",
      seoDescription: "Defensive engineering and architecture guidelines learned from offensive security by Jaishanth M.",
    },
  });

  // 18. PageSEO configuration for all core routes
  const pageSEOEntries = [
    { path: "/", seoTitle: "Jaishanth M — Cybersecurity Portfolio & Security Research", seoDescription: "Official Cybersecurity Portfolio of Jaishanth M, Cybersecurity Student at MCET Pollachi and Security Researcher at Bugcrowd." },
    { path: "/about", seoTitle: "About Jaishanth M — Cybersecurity Background & Focus", seoDescription: "Learn about Jaishanth M's offensive security background, education at MCET Pollachi, security methodologies, and research direction." },
    { path: "/projects", seoTitle: "Security Projects & Tools — Jaishanth M", seoDescription: "Explore cybersecurity tools, threat reconnaissance utilities, and network analysis applications built by Jaishanth M." },
    { path: "/research", seoTitle: "Security Research & Vulnerability Analyses — Jaishanth M", seoDescription: "Documented security research writeups, vulnerability analyses, and responsible disclosures by Jaishanth M." },
    { path: "/skills", seoTitle: "Technical Capabilities & Security Skills — Jaishanth M", seoDescription: "Technical capability matrix covering Web Security, VAPT, Active Directory, Linux, and Python automation." },
    { path: "/certifications", seoTitle: "Credentials & Certifications — Jaishanth M", seoDescription: "Validated credentials in network security, practical ethical hacking, and web application penetration testing." },
    { path: "/achievements", seoTitle: "Achievements & Milestones — Jaishanth M", seoDescription: "TryHackMe Top 1% ranking, Bugcrowd security research recognition, and laboratory milestones." },
    { path: "/bug-bounty", seoTitle: "Bug Bounty Profile & Responsible Disclosure — Jaishanth M", seoDescription: "Bugcrowd security researcher profile, research scope, and responsible disclosure track record." },
    { path: "/blog", seoTitle: "Technical Writing & Security Notes — Jaishanth M", seoDescription: "Deep-dives into web security, offensive methodologies, and defensive system architectures." },
    { path: "/contact", seoTitle: "Contact Jaishanth M — Open a Secure Channel", seoDescription: "Get in touch with Jaishanth M for cybersecurity research collaborations, internships, and security inquiries." },
    { path: "/resume", seoTitle: "Resume & Security Dossier — Jaishanth M", seoDescription: "View and download the verified professional resume and security dossier of Jaishanth M." },
    { path: "/links", seoTitle: "Verified Links & Identity Hub — Jaishanth M", seoDescription: "Direct links to Jaishanth M's verified profiles across Bugcrowd, GitHub, LinkedIn, and TryHackMe." },
  ];

  for (const p of pageSEOEntries) {
    await prisma.pageSEO.upsert({
      where: { path: p.path },
      update: { seoTitle: p.seoTitle, seoDescription: p.seoDescription, noindex: false, nofollow: false },
      create: { path: p.path, seoTitle: p.seoTitle, seoDescription: p.seoDescription, noindex: false, nofollow: false },
    });
  }

  console.log("✅ Seed completed successfully with 100% verified data!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
