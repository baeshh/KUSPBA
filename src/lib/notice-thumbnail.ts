/** 공지 본문 HTML에서 목록용 첫 번째 이미지 URL을 추출한다. */
export function extractNoticeThumbnail(html: string): string | null {
  if (!html) return null;

  const match = html.match(/<img\b[^>]*\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/i);
  if (!match) return null;

  const raw = (match[1] ?? match[2] ?? match[3] ?? "").trim();
  if (!raw) return null;

  // 디코딩된 엔티티가 섞일 수 있어 기본 정리
  const src = raw
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'");

  if (src.startsWith("/uploads/notices/") && !src.includes("..")) {
    return src;
  }

  if (/^https?:\/\//i.test(src) && !/[\u0000-\u001f]/.test(src)) {
    try {
      const url = new URL(src);
      if (url.protocol === "http:" || url.protocol === "https:") {
        return url.toString();
      }
    } catch {
      return null;
    }
  }

  return null;
}

export function isRecentNotice(publishedAt: Date, withinDays = 7) {
  const threshold = Date.now() - withinDays * 24 * 60 * 60 * 1000;
  return publishedAt.getTime() >= threshold;
}
