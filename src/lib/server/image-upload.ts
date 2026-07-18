import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Map([
  ["image/jpeg", [".jpg", ".jpeg"]],
  ["image/png", [".png"]],
  ["image/webp", [".webp"]],
  ["image/gif", [".gif"]],
]);

export async function saveUploadedImage(file: File, folder: string) {
  const allowedExtensions = ALLOWED_IMAGE_TYPES.get(file.type);
  const extension = path.extname(file.name).toLowerCase();

  if (!allowedExtensions || !allowedExtensions.includes(extension)) {
    throw new Error("jpg, png, webp, gif 이미지만 업로드할 수 있습니다.");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("이미지는 5MB 이하만 업로드할 수 있습니다.");
  }

  const filename = `${Date.now()}-${randomUUID()}${extension}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", folder);
  await mkdir(uploadDir, { recursive: true });
  await writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));

  return `/uploads/${folder}/${filename}`;
}
