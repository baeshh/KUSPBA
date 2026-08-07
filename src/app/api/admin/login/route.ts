import { NextResponse } from "next/server";
import {
  attachAdminSessionCookie,
  validateAdminPassword,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") || "").trim();
  const origin = new URL(request.url).origin;

  if (!validateAdminPassword(password)) {
    return NextResponse.redirect(new URL("/admin/login?error=1", origin), 303);
  }

  const response = NextResponse.redirect(new URL("/admin", origin), 303);
  await attachAdminSessionCookie(response);
  return response;
}
