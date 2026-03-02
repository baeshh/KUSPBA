import { NextRequest, NextResponse } from "next/server";

/**
 * REST API 방식 카카오 로그인 - JavaScript SDK 없이 직접 리다이렉트
 * JavaScript 키/도메인 설정 없이 REST API 키만으로 동작
 */
export async function GET(request: NextRequest) {
  const restApiKey = process.env.KAKAO_REST_API_KEY;
  if (!restApiKey) {
    return NextResponse.json(
      { error: "KAKAO_REST_API_KEY is not configured" },
      { status: 500 }
    );
  }

  const redirectUri =
    process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI ||
    `${request.nextUrl.origin}/auth/kakao/callback`;

  const params = new URLSearchParams({
    client_id: restApiKey,
    redirect_uri: redirectUri,
    response_type: "code",
  });

  const authUrl = `https://kauth.kakao.com/oauth/authorize?${params.toString()}`;
  return NextResponse.redirect(authUrl);
}
