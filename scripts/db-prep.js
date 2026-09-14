const { execSync } = require("child_process");

if (process.env.DATABASE_URL) {
  try {
    console.log("Applying database schema to PostgreSQL...");
    execSync("npx prisma db push --skip-generate", { stdio: "inherit" });
    console.log("Seeding initial CMS profile and content...");
    execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
  } catch (err) {
    console.warn("Database preparation notice:", err.message);
  }
}
