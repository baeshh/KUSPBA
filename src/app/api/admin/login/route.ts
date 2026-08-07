import { NextResponse } from "next/server";
import {
  attachAdminSessionCookie,
  validateAdminPassword,
} from "@/lib/admin-auth";

/**
 * 프록시 뒤에서 request.url origin이 localhost로 잡히면
 * 브라우저가 "사이트에 연결할 수 없음"이 된다.
 */
function resolvePublicOrigin(request: Request) {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL
    || process.env.SITE_URL
    || "";
  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      // ignore invalid env
    }
  }

  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host");
  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto = forwardedProto || "http";

  if (host) {
    return `${proto}://${host}`;
  }

  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") || "").trim();
  const origin = resolvePublicOrigin(request);

  if (!validateAdminPassword(password)) {
    return NextResponse.redirect(new URL("/admin/login?error=1", origin), 303);
  }

  const response = NextResponse.redirect(new URL("/admin", origin), 303);
  await attachAdminSessionCookie(response);
  return response;
}
