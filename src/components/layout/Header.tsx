"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { KakaoLoginButton } from "@/components/auth/KakaoLoginButton";
import { MEMBERSHIP_FORM_URL } from "@/lib/site";

type HeaderUser = {
  id: string;
  name: string;
};

export function Header({ currentUser = null }: { currentUser?: HeaderUser | null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileMenuOpen]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 bg-[rgba(251,251,253,0.92)] pt-[env(safe-area-inset-top)] backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-4 sm:h-16 sm:px-6">
        <Link href="/" className="flex min-w-0 items-center" onClick={closeMobileMenu}>
          <Image
            src="/logo-signature.png"
            alt="KUSPBA"
            width={160}
            height={65}
            className="h-8 w-auto sm:h-9"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-5 lg:flex lg:gap-8">
          <Link
            href="/about"
            className="text-sm font-medium text-[#86868B] transition-colors hover:text-[#1D1D1F]"
          >
            협회소개
          </Link>
          <Link
            href="/seminars"
            className="text-sm font-medium text-[#86868B] transition-colors hover:text-[#1D1D1F]"
          >
            KUSPBA 프로그램
          </Link>
          <a
            href={MEMBERSHIP_FORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#86868B] transition-colors hover:text-[#1D1D1F]"
          >
            협회원 및 학과가입
          </a>
          <Link
            href="/notices"
            className="text-sm font-medium text-[#86868B] transition-colors hover:text-[#1D1D1F]"
          >
            공지사항
          </Link>
          <KakaoLoginButton initialUser={currentUser} />
        </nav>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={mobileMenuOpen}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 text-[#555] transition hover:bg-black/5 lg:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 6h18M3 12h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="max-h-[calc(100dvh-3.5rem-env(safe-area-inset-top,0px))] overflow-y-auto border-t border-black/5 bg-white px-4 pb-5 pt-2 lg:hidden">
          <nav className="flex flex-col">
            <Link
              href="/about"
              onClick={closeMobileMenu}
              className="rounded-xl px-3 py-3.5 text-[15px] font-medium text-[#333] transition hover:bg-black/5"
            >
              협회소개
            </Link>
            <Link
              href="/seminars"
              onClick={closeMobileMenu}
              className="rounded-xl px-3 py-3.5 text-[15px] font-medium text-[#333] transition hover:bg-black/5"
            >
              KUSPBA 프로그램
            </Link>
            <a
              href={MEMBERSHIP_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobileMenu}
              className="rounded-xl px-3 py-3.5 text-[15px] font-medium text-[#333] transition hover:bg-black/5"
            >
              협회원 및 학과가입
            </a>
            <Link
              href="/notices"
              onClick={closeMobileMenu}
              className="rounded-xl px-3 py-3.5 text-[15px] font-medium text-[#333] transition hover:bg-black/5"
            >
              공지사항
            </Link>
            <div className="mt-2 px-1 pt-2" onClick={closeMobileMenu}>
              <KakaoLoginButton compact initialUser={currentUser} />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
