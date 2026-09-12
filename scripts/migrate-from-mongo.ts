import mongoose from "mongoose";
import { PrismaClient } from "@prisma/client";
import { v2 as cloudinary } from "cloudinary";

// One-time content migration — Phase 1 §10 pipeline: export → verify →
// normalize → insert. Run manually once during cutover (`npm run
// db:migrate-mongo`), never part of CI/deploy, per Phase 8 §4's split from
// the bootstrap seed.
//
// WHAT THIS SCRIPT DOES automatically: Projects, Certifications, Blog
// posts (slugs preserved exactly, per the Phase 3 redirect plan), Social
// links.
//
// WHAT IT DELIBERATELY DOES NOT DO: touch AdminUser/credentials (already
// handled by the security-closeout-fixed bootstrap seed — re-migrating the
// old Mongo user would reintroduce exactly the plaintext-adjacent pattern
// that got fixed), or auto-map `ContentSection`'s freeform Mixed-type JSON
// into typed Profile fields. That collection's actual shape can only be
// known by looking at real data, which isn't available from this sandbox —
// guessing a field mapping against an unseen schema would be exactly the
// kind of unverified assumption Phase 1 §10 rules out. Instead, this script
// logs every ContentSection document's raw contents for manual review and
// manual entry through the new /admin UI (which is a five-minute task once
// you can actually see the data, versus a fragile guess now).
//
// Everything inserted with unverified claims (ranks, stats) goes in with
// visible: false — reviewed and flipped on manually via /admin, never
// auto-published.

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const prisma = new PrismaClient();

// Minimal schemas matching Phase 0's audit of portfolio-main's models —
// only the fields this script actually reads.
const OldProject = mongoose.model("Project", new mongoose.Schema({
  title: String, description: String, longDescription: String, category: String,
  githubUrl: String, liveUrl: String, visible: Boolean, featured: Boolean,
}, { strict: false }));

const OldCertificate = mongoose.model("Certificate", new mongoose.Schema({
  title: String, issuer: String, date: Date, verifyUrl: String, image: String, visible: Boolean,
}, { strict: false }));

const OldBlogPost = mongoose.model("BlogPost", new mongoose.Schema({
  title: String, excerpt: String, content: String, slug: String, coverImage: String,
  tags: [String], visible: Boolean, createdAt: Date,
}, { strict: false }));

const OldSocialMedia = mongoose.model("SocialMedia", new mongoose.Schema({
  platform: String, url: String, order: Number, enabled: Boolean, customLabel: String,
}, { strict: false }));

const OldContentSection = mongoose.model("ContentSection", new mongoose.Schema({
  sectionId: String, data: mongoose.Schema.Types.Mixed,
}, { strict: false }));

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// Base64 images get re-uploaded to Cloudinary (Phase 1 §7 — no Base64 in
// Postgres); URLs that are already Cloudinary/remote are used as-is.
async function ensureMedia(imageValue: string | null | undefined): Promise<string | null> {
  if (!imageValue) return null;
  if (imageValue.startsWith("data:")) {
    const result = await cloudinary.uploader.upload(imageValue);
    const media = await prisma.media.create({
      data: { url: result.secure_url, storageProvider: "CLOUDINARY", mimeType: result.resource_type === "image" ? "image/jpeg" : "application/octet-stream", sizeBytes: result.bytes, width: result.width, height: result.height },
    });
    return media.id;
  }
  const media = await prisma.media.create({
    data: { url: imageValue, storageProvider: "CLOUDINARY", mimeType: "image/jpeg", sizeBytes: 0 },
  });
  return media.id;
}

async function migrateProjects() {
  const projects = await OldProject.find();
  let count = 0;
  for (const p of projects) {
    const slug = slugify(p.get("title") ?? "untitled");
    const exists = await prisma.project.findUnique({ where: { slug } });
    if (exists) continue;
    await prisma.project.create({
      data: {
        name: p.get("title") ?? "Untitled",
        slug,
        shortDescription: p.get("description") ?? "",
        fullDescription: p.get("longDescription") ?? undefined,
        category: p.get("category") ?? undefined,
        githubUrl: p.get("githubUrl") ?? undefined,
        liveUrl: p.get("liveUrl") ?? undefined,
        visible: false, // reviewed manually before going live, even if it was visible in the old app
        featured: p.get("featured") ?? false,
        sortOrder: count,
      },
    });
    count++;
  }
  console.log(`Projects migrated: ${count}`);
}

async function migrateCertifications() {
  const certs = await OldCertificate.find();
  let count = 0;
  for (const c of certs) {
    const imageMediaId = await ensureMedia(c.get("image"));
    await prisma.certification.create({
      data: {
        name: c.get("title") ?? "Untitled",
        issuer: c.get("issuer") ?? "Unknown issuer",
        issueDate: c.get("date") ?? new Date(),
        verificationUrl: c.get("verifyUrl") ?? undefined,
        imageMediaId: imageMediaId ?? undefined,
        visible: false,
        sortOrder: count,
      },
    });
    count++;
  }
  console.log(`Certifications migrated: ${count}`);
}

async function migrateBlogPosts(adminUserId: string) {
  const posts = await OldBlogPost.find();
  let count = 0;
  for (const post of posts) {
    // Slug preserved exactly, per the Phase 3 redirect plan's assumption
    // that migration guarantees this — if it didn't, that plan's "no
    // redirect needed for /blog/[slug]" line would be wrong.
    const slug = post.get("slug");
    if (!slug) { console.warn(`Skipping post "${post.get("title")}" — no slug in source data.`); continue; }
    const exists = await prisma.blogPost.findUnique({ where: { slug } });
    if (exists) continue;

    const coverImageId = await ensureMedia(post.get("coverImage"));
    await prisma.blogPost.create({
      data: {
        title: post.get("title") ?? "Untitled",
        slug,
        excerpt: post.get("excerpt") ?? undefined,
        content: post.get("content") ?? "",
        coverImageId: coverImageId ?? undefined,
        authorId: adminUserId,
        status: "DRAFT", // never auto-published, regardless of old `visible` value
        createdAt: post.get("createdAt") ?? new Date(),
      },
    });
    count++;
  }
  console.log(`Blog posts migrated: ${count} (all as DRAFT — publish manually after review)`);
}

async function migrateSocialLinks() {
  const links = await OldSocialMedia.find();
  let count = 0;
  for (const link of links) {
    await prisma.socialLink.create({
      data: {
        platform: link.get("platform") ?? "Unknown",
        url: link.get("url") ?? "",
        order: link.get("order") ?? count,
        visible: false, // reviewed manually — old SocialMedia.enabled isn't trusted blindly
        customLabel: link.get("customLabel") ?? undefined,
      },
    });
    count++;
  }
  console.log(`Social links migrated: ${count}`);
}

async function logContentSectionsForManualReview() {
  const sections = await OldContentSection.find();
  console.log(`\n--- ContentSection documents (${sections.length}) — manual review required ---`);
  console.log("These contain your home/about copy in a freeform shape this script can't");
  console.log("safely guess a field mapping for. Enter this content through /admin/hero,");
  console.log("/admin/about, etc. by hand — it's a few minutes of copy-paste, not worth");
  console.log("risking a wrong automated mapping for.\n");
  for (const section of sections) {
    console.log(`sectionId: ${section.get("sectionId")}`);
    console.log(JSON.stringify(section.get("data"), null, 2));
    console.log("---");
  }
}

async function main() {
  if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is required for this script.");
  await mongoose.connect(process.env.MONGODB_URI);

  const admin = await prisma.adminUser.findFirst({ where: { role: { key: "ADMIN" } } });
  if (!admin) throw new Error("No ADMIN user found — run `npm run db:seed` first.");

  await migrateProjects();
  await migrateCertifications();
  await migrateBlogPosts(admin.id);
  await migrateSocialLinks();
  await logContentSectionsForManualReview();

  console.log("\nMigration complete. Everything was inserted hidden/draft — review and publish manually through /admin.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => {
    await mongoose.disconnect();
    await prisma.$disconnect();
  });
