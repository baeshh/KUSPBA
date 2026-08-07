import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { assertInsideRoot, getUploadRoot } from "@/lib/server/upload-paths";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", [".jpg", ".jpeg"]],
  ["image/png", [".png"]],
  ["image/webp", [".webp"]],
  ["image/gif", [".gif"]],
]);

function resolveExtension(file: File) {
  const byMime = ALLOWED_IMAGE_TYPES.get(file.type);
  if (byMime?.length) {
    const fromName = path.extname(file.name).toLowerCase();
    if (fromName && byMime.includes(fromName)) {
      return fromName === ".jpeg" ? ".jpg" : fromName;
    }
    return byMime[0] === ".jpeg" ? ".jpg" : byMime[0];
  }

  const extension = path.extname(file.name).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(extension)) {
    return extension === ".jpeg" ? ".jpg" : extension;
  }

  return null;
}

export async function saveUploadedImage(file: File, folder: string) {
  const extension = resolveExtension(file);
  if (!extension) {
    throw new Error("jpg, png, webp, gif 이미지만 업로드할 수 있습니다.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("이미지는 5MB 이하만 업로드할 수 있습니다.");
  }

  const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "");
  if (!safeFolder) {
    throw new Error("업로드 폴더가 올바르지 않습니다.");
  }

  const filename = `${Date.now()}-${randomUUID()}${extension}`;
  const uploadDir = assertInsideRoot(getUploadRoot(), path.join(getUploadRoot(), safeFolder));
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));

  return `/uploads/${safeFolder}/${filename}`;
}
