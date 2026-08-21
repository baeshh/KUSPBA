"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type AuthUser = {
  id: string;
  name: string;
};

export function KakaoLoginButton({
  compact = false,
  initialUser = null,
}: {
  compact?: boolean;
  initialUser?: AuthUser | null;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(initialUser);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const loginHref = `/api/auth/kakao/login?next=${encodeURIComponent(pathname || "/mypage")}`;

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/";
  };

  if (user) {
    if (compact) {
      return (
        <div className="flex flex-col gap-1 text-[15px]">
          <p className="px-3 py-2 text-sm font-medium text-[#427A72]">
            {user.name}님으로 로그인됨
          </p>
          <Link
            href="/mypage"
            className="block rounded-xl px-3 py-3.5 font-semibold text-[#1D1D1F] hover:bg-black/5"
          >
            마이페이지
          </Link>
          <button
            type="button"
            onClick={logout}
            className="block w-full rounded-xl px-3 py-3.5 text-left font-medium text-[#86868B] hover:bg-black/5 hover:text-[#1D1D1F]"
          >
            로그아웃
          </button>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Link
          href="/mypage"
          className="max-w-[120px] truncate text-sm font-semibold text-[#1D1D1F] hover:text-[#427A72]"
        >
          {user.name}님
        </Link>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-black/10 bg-white px-3 py-1.5 text-sm font-medium text-[#1D1D1F] transition-colors hover:bg-black/5"
        >
          로그아웃
        </button>
      </div>
    );
  }

  return (
    <Link
      href={loginHref}
      className="inline-flex w-full items-center justify-center rounded-full bg-[#FEE500] px-[18px] py-3 text-sm font-semibold text-black transition-colors hover:bg-[#E6CF00] lg:w-auto lg:py-2"
    >
      <span className="mr-1.5 font-extrabold">K</span>
      카카오 로그인
    </Link>
  );
}
