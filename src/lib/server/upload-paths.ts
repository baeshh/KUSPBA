import path from "path";

/** 런타임 업로드 루트. public/ 은 production에서 동적 파일이 안 열리므로 분리한다. */
export function getUploadRoot() {
  if (process.env.UPLOAD_DIR?.trim()) {
    return path.resolve(process.env.UPLOAD_DIR.trim());
  }
  return path.join(process.cwd(), "storage", "uploads");
}

export function getLegacyUploadRoot() {
  return path.join(process.cwd(), "public", "uploads");
}

export function assertInsideRoot(root: string, target: string) {
  const normalizedRoot = path.resolve(root);
  const normalizedTarget = path.resolve(target);
  if (
    normalizedTarget !== normalizedRoot
    && !normalizedTarget.startsWith(normalizedRoot + path.sep)
  ) {
    throw new Error("Invalid upload path");
  }
  return normalizedTarget;
}
