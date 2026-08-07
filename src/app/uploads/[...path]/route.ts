import { readFile, stat } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import {
  assertInsideRoot,
  getLegacyUploadRoot,
  getUploadRoot,
} from "@/lib/server/upload-paths";

export const runtime = "nodejs";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
};

async function readUpload(filePath: string) {
  await stat(filePath);
  return readFile(filePath);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const segments = (await params).path ?? [];
  if (
    segments.length === 0
    || segments.some((segment) => !segment || segment.includes("..") || segment.includes("\0"))
  ) {
    return new NextResponse("Not found", { status: 404 });
  }

  const candidates = [
    assertInsideRoot(getUploadRoot(), path.join(getUploadRoot(), ...segments)),
    assertInsideRoot(getLegacyUploadRoot(), path.join(getLegacyUploadRoot(), ...segments)),
  ];

  for (const filePath of candidates) {
    try {
      const buffer = await readUpload(filePath);
      const ext = path.extname(filePath).toLowerCase();
      return new NextResponse(buffer, {
        headers: {
          "Content-Type": MIME[ext] || "application/octet-stream",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch {
      // try next candidate
    }
  }

  return new NextResponse("Not found", { status: 404 });
}
