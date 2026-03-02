"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");

  useEffect(() => {
    const code = searchParams.get("code");
    const error = searchParams.get("error");

    if (error) {
      setStatus("error");
      return;
    }

    if (!code) {
      setStatus("error");
      return;
    }

    fetch("/api/auth/kakao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    })
      .then((res) => {
        if (res.ok) {
          setStatus("success");
          router.push("/");
        } else {
          setStatus("error");
        }
      })
      .catch(() => setStatus("error"));
  }, [searchParams, router]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6">
      {status === "loading" && (
        <p className="text-[#86868B]">로그인 처리 중...</p>
      )}
      {status === "success" && (
        <p className="text-[#427A72]">로그인 완료! 메인으로 이동합니다.</p>
      )}
      {status === "error" && (
        <div className="text-center">
          <p className="mb-4 text-[#86868B]">로그인에 실패했습니다.</p>
          <a
            href="/"
            className="text-[#427A72] font-semibold underline"
          >
            메인으로 돌아가기
          </a>
        </div>
      )}
    </div>
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center text-[#86868B]">로딩 중...</div>}>
      <CallbackContent />
    </Suspense>
  );
}
