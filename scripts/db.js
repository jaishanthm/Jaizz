const { execSync, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const projectRoot = path.resolve(__dirname, "..");
const binDir = path.join(projectRoot, "node_modules/@embedded-postgres/linux-x64/native/bin");
const dbDir = path.join(projectRoot, ".db");
const dataDir = path.join(dbDir, "data");
const logFile = path.join(dbDir, "postgres.log");

const initdb = path.join(binDir, "initdb");
const pg_ctl = path.join(binDir, "pg_ctl");

const action = process.argv[2] || "start";

if (!fs.existsSync(binDir)) {
  console.error("Postgres binaries not found. Run: npm install");
  process.exit(1);
}

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

function isRunning() {
  const res = spawnSync(pg_ctl, ["-D", dataDir, "status"], { encoding: "utf8" });
  if (res.status === 0) return true;
  try {
    const ss = spawnSync("ss", ["-lnt", "sport = :5432"], { encoding: "utf8" });
    if (ss.stdout && ss.stdout.includes(":5432")) return true;
  } catch (e) {}
  return false;
}

if (action === "init" || !fs.existsSync(path.join(dataDir, "PG_VERSION"))) {
  console.log("Initializing database cluster in .db/data...");
  execSync(`"${initdb}" -D "${dataDir}" -U postgres --auth=trust`, { stdio: "inherit" });
}

if (action === "start") {
  if (isRunning()) {
    console.log("Database is already running.");
  } else {
    console.log("Starting PostgreSQL on port 5432...");
    execSync(`"${pg_ctl}" -D "${dataDir}" -l "${logFile}" -o "-p 5432 -k /tmp" start`, { stdio: "inherit" });
  }

  // Ensure portfolio db exists
  const { Client } = require("pg");
  const client = new Client({ connectionString: "postgresql://postgres@localhost:5432/postgres" });
  client.connect().then(async () => {
    try {
      const res = await client.query("SELECT 1 FROM pg_database WHERE datname = 'portfolio'");
      if (res.rows.length === 0) {
        console.log("Creating database 'portfolio'...");
        await client.query("CREATE DATABASE portfolio;");
      }
    } finally {
      await client.end();
    }
  }).catch((err) => {
    console.error("Failed checking/creating database:", err.message);
  });
} else if (action === "stop") {
  if (isRunning()) {
    console.log("Stopping PostgreSQL...");
    execSync(`"${pg_ctl}" -D "${dataDir}" stop`, { stdio: "inherit" });
  } else {
    console.log("Database is not running.");
  }
} else if (action === "status") {
  const res = spawnSync(pg_ctl, ["-D", dataDir, "status"], { stdio: "inherit" });
  process.exit(res.status);
}
