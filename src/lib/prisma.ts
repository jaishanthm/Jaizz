import { PrismaClient } from "@prisma/client";

// Standard Next.js serverless-safe singleton pattern — prevents exhausting
// the connection pool from hot-reload creating a new client per request
// in dev. See Phase 8 §1 for the pooled/direct URL setup this relies on.

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
