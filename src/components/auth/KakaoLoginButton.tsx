"use client";

import { useCallback, useEffect, useState } from "react";
import { loadKakaoScript } from "@/lib/kakao";

export function KakaoLoginButton() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (!key) {
      console.warn("NEXT_PUBLIC_KAKAO_JS_KEY is not set");
      setReady(false);
      return;
    }
    loadKakaoScript().then(() => {
      if (typeof window !== "undefined" && window.Kakao && !window.Kakao.isInitialized?.()) {
        window.Kakao.init(key);
      }
      setReady(true);
    });
  }, []);

  const handleLogin = useCallback(() => {
    if (!ready || typeof window === "undefined" || !window.Kakao) {
      return;
    }
    const redirectUri = `${window.location.origin}/auth/kakao/callback`;
    // 디버그: 콘솔에서 실제 사용되는 redirect URI 확인
    if (process.env.NODE_ENV === "development") {
      console.log("[Kakao] redirectUri:", redirectUri);
    }
    window.Kakao.Auth.authorize({ redirectUri });
  }, [ready]);

  return (
    <button
      type="button"
      onClick={handleLogin}
      className="inline-flex items-center justify-center rounded-full bg-[#FEE500] px-[18px] py-2 text-sm font-semibold text-black transition-colors hover:bg-[#E6CF00] disabled:opacity-50"
    >
      <span className="mr-1.5 font-extrabold">K</span>
      카카오 로그인
    </button>
  );
}
