import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hasRequiredProfileFields } from "@/lib/profile";

export async function POST(request: NextRequest) {
  try {
    const { code, redirectUri: clientRedirectUri } = await request.json();
    const redirectUri =
      process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ||
      clientRedirectUri ||
      `${request.headers.get("origin") || request.nextUrl.origin}/auth/kakao/callback`;
    const restApiKey = process.env.KAKAO_REST_API_KEY;
    const clientSecret = process.env.KAKAO_CLIENT_SECRET;

    if (!code || !restApiKey) {
      return NextResponse.json(
        { error: "Missing code or KAKAO_REST_API_KEY" },
        { status: 400 }
      );
    }

    const tokenBody: Record<string, string> = {
      grant_type: "authorization_code",
      client_id: restApiKey,
      redirect_uri: redirectUri,
      code,
    };
    if (clientSecret) {
      tokenBody.client_secret = clientSecret;
    }

    const tokenRes = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams(tokenBody),
    });

    if (!tokenRes.ok) {
      const err = await tokenRes.text();
      console.error("Kakao token error:", err);
      return NextResponse.json(
        { error: "Token exchange failed", details: err },
        { status: 400 }
      );
    }

    const tokenData = await tokenRes.json();
    const { access_token } = tokenData;

    const userRes = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    if (!userRes.ok) {
      return NextResponse.json({ error: "User info fetch failed" }, { status: 400 });
    }

    const userData = await userRes.json();
    const kakaoId = String(userData.id);
    if (!kakaoId || kakaoId === "undefined") {
      return NextResponse.json({ error: "Kakao user id is missing" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { kakaoId } });
    let user = existing
      ? existing
      : await prisma.user.create({
          data: {
            kakaoId,
            name: "",
            profileCompleted: false,
          },
        });

    if (!user.profileCompleted && hasRequiredProfileFields(user)) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { profileCompleted: true },
      });
    }

    const needsProfileSetup = !user.profileCompleted;

    const response = NextResponse.json({
      id: kakaoId,
      isNew: !existing,
      needsProfileSetup,
    });

    response.cookies.set("kakao_user", kakaoId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Kakao auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
