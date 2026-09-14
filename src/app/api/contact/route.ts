import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, contactRateLimit } from "@/lib/rate-limit";
import { isFeatureEnabled } from "@/lib/feature-flags";

// Phase 1 §12 / Phase 7 §4 — server-side validation is the real gate,
// client-side is UX only. Rate limiting now backed by Upstash (Stage 7),
// replacing the earlier in-memory-counter TODO.

const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.string().min(1).max(150),
  message: z.string().min(10).max(5000),
});

export async function POST(req: NextRequest) {
  const enabled = await isFeatureEnabled("contact");
  if (!enabled) {
    return NextResponse.json({ success: false, error: "Contact feature is disabled." }, { status: 403 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const ipHash = crypto.createHash("sha256").update(ip).digest("hex");

  const { allowed } = await checkRateLimit(contactRateLimit, ipHash);
  if (!allowed) {
    return NextResponse.json({ success: false, error: "Too many messages sent. Please try again later." }, { status: 429 });
  }

  // req.json() throws on malformed JSON — was unguarded, producing an
  // uncontrolled 500 for any caller sending a bad body (whether malicious
  // or just a misbehaving client). A malformed request is a 400, not a
  // server error.
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Malformed request body." }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid input" }, { status: 400 });
  }

  await prisma.contactMessage.create({
    data: { ...parsed.data, ipHash },
  });

  return NextResponse.json({ success: true });
}
