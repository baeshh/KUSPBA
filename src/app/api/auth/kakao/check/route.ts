import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasJsKey: !!process.env.NEXT_PUBLIC_KAKAO_JS_KEY,
    hasRestKey: !!process.env.KAKAO_REST_API_KEY,
    jsKeyPrefix: process.env.NEXT_PUBLIC_KAKAO_JS_KEY
      ? `${process.env.NEXT_PUBLIC_KAKAO_JS_KEY.slice(0, 8)}...`
      : null,
  });
}
