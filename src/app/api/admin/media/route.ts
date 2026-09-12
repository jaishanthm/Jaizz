import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";
import { matchesFileSignature } from "@/lib/file-signature";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Phase 1 §7 upload pipeline: MIME allowlist → size limit → Cloudinary →
// dimension extraction → Media row. altText is NOT collected here — it's
// required at the point a Media item gets attached to published content
// (Phase 4 §11), not at upload time, since the uploader may be uploading
// several images before deciding which goes where.

const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

export async function POST(req: NextRequest) {
  try {
    await requirePermission("media.upload");
  } catch {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });

  if (!ALLOWED_MIME.includes(file.type)) {
    return NextResponse.json({ success: false, error: `File type ${file.type} not allowed` }, { status: 400 });
  }
  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ success: false, error: "File exceeds 10MB limit" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  // QA fix: the MIME allowlist check above only looked at the client-
  // reported file.type. This checks what the file's bytes actually are —
  // a renamed/relabeled file that doesn't match its claimed type is
  // rejected here even though it passed the earlier check.
  if (!matchesFileSignature(file.type, buffer)) {
    return NextResponse.json(
      { success: false, error: "File content doesn't match its declared type." },
      { status: 400 }
    );
  }

  const uploadResult = await new Promise<{ secure_url: string; width?: number; height?: number; bytes: number }>((resolve, reject) => {
    cloudinary.uploader.upload_stream({ resource_type: "auto" }, (err, result) => {
      if (err || !result) reject(err);
      else resolve(result);
    }).end(buffer);
  });

  const media = await prisma.media.create({
    data: {
      url: uploadResult.secure_url,
      storageProvider: "CLOUDINARY",
      mimeType: file.type,
      sizeBytes: uploadResult.bytes,
      width: uploadResult.width,
      height: uploadResult.height,
    },
  });

  await writeAuditLog("CREATE", "Media", media.id, { fileName: file.name });

  return NextResponse.json({ success: true, data: media });
}
