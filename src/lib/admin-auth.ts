import { createHash, timingSafeEqual } from "crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import type { NextResponse } from "next/server";

const ADMIN_SESSION_COOKIE = "kuspba_admin";
const DEV_ADMIN_PASSWORD = "kuspba-admin";

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD || DEV_ADMIN_PASSWORD;
}

/** 비밀번호 평문 대신 세션 토큰을 쿠키에 저장한다. */
export function getAdminSessionToken() {
  return createHash("sha256")
    .update(`kuspba-admin-session:v1:${getAdminPassword()}`)
    .digest("hex");
}

function tokensMatch(a: string, b: string) {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  if (left.length !== right.length) return false;
  return timingSafeEqual(left, right);
}

/**
 * Secure 쿠키는 HTTPS에서만 브라우저가 저장한다.
 * NODE_ENV=production 만으로 secure=true 하면 HTTP(EC2 IP 등) 배포에서
 * 로그인 직후 탭 이동 시 세션이 사라진다.
 */
export async function shouldUseSecureAdminCookie() {
  const forced = process.env.ADMIN_COOKIE_SECURE?.toLowerCase();
  if (forced === "true" || forced === "1") return true;
  if (forced === "false" || forced === "0") return false;

  const headerStore = await headers();
  const forwarded = headerStore.get("x-forwarded-proto")
    ?? headerStore.get("x-forwarded-protocol");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim().toLowerCase() === "https";
  }

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL
    || process.env.SITE_URL
    || "";
  if (siteUrl.startsWith("https://")) return true;
  if (siteUrl.startsWith("http://")) return false;

  return false;
}

export async function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: await shouldUseSecureAdminCookie(),
    maxAge: 60 * 60 * 8,
    path: "/",
  };
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!value) return false;

  const expected = getAdminSessionToken();
  // 구버전(비밀번호 평문) 쿠키도 한동안 허용
  if (value === getAdminPassword()) return true;
  return tokensMatch(value, expected);
}

export async function requireAdmin() {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(
    ADMIN_SESSION_COOKIE,
    getAdminSessionToken(),
    await getAdminSessionCookieOptions(),
  );
}

/** Route Handler 응답에 세션 쿠키를 직접 붙일 때 사용 */
export async function attachAdminSessionCookie(response: NextResponse) {
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    getAdminSessionToken(),
    await getAdminSessionCookieOptions(),
  );
  return response;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    ...(await getAdminSessionCookieOptions()),
    maxAge: 0,
  });
}

export function validateAdminPassword(password: string) {
  return password === getAdminPassword();
}
