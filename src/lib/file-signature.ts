// QA fix: `file.type` is a client-reported string — trivially spoofed by
// renaming a file or editing the upload request. Real validation checks
// the file's actual magic bytes against what the claimed MIME type should
// produce. A mismatch is rejected outright, regardless of what the
// filename, extension, or reported Content-Type claimed.

const SIGNATURES: Record<string, (buf: Buffer) => boolean> = {
  "image/jpeg": (b) => b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  "image/png": (b) =>
    b.length >= 8 &&
    [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a].every((byte, i) => b[i] === byte),
  "image/gif": (b) =>
    b.length >= 6 &&
    (b.subarray(0, 6).toString("ascii") === "GIF87a" || b.subarray(0, 6).toString("ascii") === "GIF89a"),
  "image/webp": (b) =>
    b.length >= 12 &&
    b.subarray(0, 4).toString("ascii") === "RIFF" &&
    b.subarray(8, 12).toString("ascii") === "WEBP",
  "application/pdf": (b) => b.length >= 5 && b.subarray(0, 5).toString("ascii") === "%PDF-",
};

export function matchesFileSignature(claimedMimeType: string, buffer: Buffer): boolean {
  const check = SIGNATURES[claimedMimeType];
  if (!check) return false; // unknown type — never treated as valid by default
  return check(buffer);
}
