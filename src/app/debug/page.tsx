"use client";

import { useEffect, useState } from "react";

export default function DebugPage() {
  const [info, setInfo] = useState<{
    origin: string;
    redirectUri: string;
    hasJsKey: boolean;
    apiCheck: { hasJsKey?: boolean; hasRestKey?: boolean } | null;
  } | null>(null);

  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    setInfo({
      origin,
      redirectUri: `${origin}/auth/kakao/callback`,
      hasJsKey: !!process.env.NEXT_PUBLIC_KAKAO_JS_KEY,
      apiCheck: null,
    });

    fetch("/api/auth/kakao/check")
      .then((r) => r.json())
      .then((data) => {
        setInfo((prev) => (prev ? { ...prev, apiCheck: data } : null));
      })
      .catch(() => {});
  }, []);

  if (!info) return <div className="p-8">로딩 중...</div>;

  return (
    <div className="mx-auto max-w-lg space-y-6 p-8 font-mono text-sm">
      <h1 className="text-xl font-bold">카카오 로그인 디버그</h1>
      <div className="space-y-2 rounded-lg bg-gray-100 p-4">
        <p>
          <strong>현재 접속 URL:</strong> {info.origin}
        </p>
        <p>
          <strong>사용되는 Redirect URI:</strong>
          <br />
          <code className="break-all text-amber-700">{info.redirectUri}</code>
        </p>
        <p>
          <strong>클라이언트 JS키:</strong> {info.hasJsKey ? "있음" : "없음"}
        </p>
        {info.apiCheck && (
          <>
            <p>
              <strong>API REST키:</strong> {info.apiCheck.hasRestKey ? "있음" : "없음"}
            </p>
            <p>
              <strong>API JS키:</strong> {info.apiCheck.hasJsKey ? "있음" : "없음"}
            </p>
          </>
        )}
      </div>
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <p className="font-semibold text-amber-800">
          ↑ 위 &quot;사용되는 Redirect URI&quot; 값을 카카오 디벨로퍼스에 그대로 등록하세요.
        </p>
        <p className="mt-2 text-amber-700">
          플랫폼 → Web → Redirect URI에 추가
        </p>
      </div>
      <a href="/" className="text-blue-600 underline">
        메인으로 돌아가기
      </a>
    </div>
  );
}
