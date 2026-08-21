export function getSafeAuthRedirect(value: string | null | undefined) {
  if (!value) return "/mypage";

  let decoded = value;
  try {
    decoded = decodeURIComponent(value);
  } catch {
    decoded = value;
  }

  if (
    !decoded.startsWith("/") ||
    decoded.startsWith("//") ||
    decoded.startsWith("/api/") ||
    decoded.startsWith("/auth/")
  ) {
    return "/mypage";
  }

  return decoded;
}
