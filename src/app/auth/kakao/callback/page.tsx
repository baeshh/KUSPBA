"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [errorDetail, setErrorDetail] = useState<string | null>(null);

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

    const redirectUri = `${window.location.origin}/auth/kakao/callback`;
    fetch("/api/auth/kakao", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, redirectUri }),
    })
      .then(async (res) => {
        if (res.ok) {
          setStatus("success");
          router.push("/");
        } else {
          const data = await res.json().catch(() => ({}));
          console.error("Kakao auth error:", data);
          setStatus("error");
          setErrorDetail(data.details || data.error || JSON.stringify(data));
        }
      })
      .catch((e) => {
        setStatus("error");
        setErrorDetail(e?.message || "네트워크 오류");
      });
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
          {errorDetail && (
            <pre className="mb-4 max-h-32 overflow-auto rounded bg-gray-100 px-3 py-2 text-left text-xs text-red-600">
              {typeof errorDetail === "string" ? errorDetail : JSON.stringify(errorDetail)}
            </pre>
          )}
          <p className="mb-4 text-xs text-[#86868B]">
            <a href="/debug" className="text-[#427A72] underline">/debug</a>에서 Redirect URI를 확인한 뒤,
            카카오 디벨로퍼스(플랫폼 → Web → Redirect URI)에 동일하게 등록했는지 확인해 주세요.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="/debug" className="text-[#427A72] font-semibold underline">디버그 확인</a>
            <a href="/" className="text-[#427A72] font-semibold underline">메인으로 돌아가기</a>
          </div>
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
