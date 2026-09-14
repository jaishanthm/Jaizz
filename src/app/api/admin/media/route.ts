import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";
import { matchesFileSignature } from "@/lib/file-signature";
import fs from "fs";
import path from "path";

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

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

  if (!matchesFileSignature(file.type, buffer)) {
    return NextResponse.json(
      { success: false, error: "File content doesn't match its declared type." },
      { status: 400 }
    );
  }

  let finalUrl: string;
  let storageProvider: "CLOUDINARY" | "LOCAL" = "LOCAL";
  let width: number | undefined;
  let height: number | undefined;
  const sizeBytes = file.size;

  // Try Cloudinary if keys exist
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    try {
      const uploadResult = await new Promise<{ secure_url: string; width?: number; height?: number; bytes: number }>((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: "auto" }, (err, result) => {
          if (err || !result) reject(err);
          else resolve(result);
        }).end(buffer);
      });
      finalUrl = uploadResult.secure_url;
      storageProvider = "CLOUDINARY";
      width = uploadResult.width;
      height = uploadResult.height;
    } catch (err: any) {
      console.warn("Cloudinary upload failed, falling back to local vault:", err.message);
      finalUrl = "";
    }
  } else {
    finalUrl = "";
  }

  // Local filesystem vault fallback
  if (!finalUrl) {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const ext = path.extname(file.name) || (file.type === "application/pdf" ? ".pdf" : ".png");
    const sanitizedBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `${Date.now()}-${sanitizedBase}${ext}`;
    const filePath = path.join(uploadsDir, filename);

    fs.writeFileSync(filePath, buffer);
    finalUrl = `/uploads/${filename}`;
    storageProvider = "LOCAL";
  }

  const defaultAlt = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");

  const media = await prisma.media.create({
    data: {
      url: finalUrl,
      storageProvider,
      mimeType: file.type,
      sizeBytes,
      width,
      height,
      altText: defaultAlt,
    },
  });

  await writeAuditLog("CREATE", "Media", media.id, { fileName: file.name, storageProvider });

  return NextResponse.json({ success: true, data: media });
}
