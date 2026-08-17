"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type AuthUser = {
  id: string;
  name: string;
};

export function KakaoLoginButton({ compact = false }: { compact?: boolean }) {
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setUser(data.user ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  if (user === undefined) {
    return (
      <span className="inline-flex h-9 min-w-[108px] items-center justify-center rounded-full bg-black/5 px-4 text-sm text-[#86868B]">
        확인 중
      </span>
    );
  }

  if (user) {
    return (
      <div
        className={
          compact
            ? "flex flex-col gap-1 text-[15px]"
            : "flex flex-wrap items-center gap-x-2 gap-y-1 text-sm"
        }
      >
        <Link
          href="/mypage"
          className={`font-semibold text-[#1D1D1F] transition-colors hover:text-[#427A72] ${
            compact ? "block rounded-xl px-3 py-3.5 hover:bg-black/5" : ""
          }`}
        >
          {compact ? "마이페이지" : "마이페이지(내 신청내역·회원등급)"}
        </Link>
        {!compact ? (
          <span className="text-[#C7C7CC]" aria-hidden>
            /
          </span>
        ) : null}
        <button
          type="button"
          onClick={logout}
          className={`w-fit font-medium text-[#86868B] transition-colors hover:text-[#1D1D1F] ${
            compact ? "block w-full rounded-xl px-3 py-3.5 text-left hover:bg-black/5" : ""
          }`}
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <Link
      href="/api/auth/kakao/login"
      className="inline-flex w-full items-center justify-center rounded-full bg-[#FEE500] px-[18px] py-3 text-sm font-semibold text-black transition-colors hover:bg-[#E6CF00] lg:w-auto lg:py-2"
    >
      <span className="mr-1.5 font-extrabold">K</span>
      카카오 로그인
    </Link>
  );
}
