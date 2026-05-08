"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { KakaoLoginButton } from "@/components/auth/KakaoLoginButton";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-black/5 bg-[rgba(251,251,253,0.9)] backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="KUSPBA"
            width={120}
            height={32}
            className="h-8 w-auto"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
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
          <Link
            href="/#inquiry"
            className="text-sm font-medium text-[#86868B] transition-colors hover:text-[#1D1D1F]"
          >
            협회원 및 학과가입
          </Link>
          <Link
            href="/#notice-board"
            className="text-sm font-medium text-[#86868B] transition-colors hover:text-[#1D1D1F]"
          >
            공지사항/게시판
          </Link>
          <KakaoLoginButton />
        </nav>

        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="모바일 메뉴 열기"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-black/10 text-[#555] transition hover:bg-black/5 md:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
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
        <div className="border-t border-black/5 bg-white px-6 pb-6 pt-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link
              href="/about"
              onClick={closeMobileMenu}
              className="rounded-md px-2 py-2 text-sm font-medium text-[#555] transition hover:bg-black/5 hover:text-[#1D1D1F]"
            >
              협회소개
            </Link>
            <Link
              href="/seminars"
              onClick={closeMobileMenu}
              className="rounded-md px-2 py-2 text-sm font-medium text-[#555] transition hover:bg-black/5 hover:text-[#1D1D1F]"
            >
              KUSPBA 프로그램
            </Link>
            <Link
              href="/#inquiry"
              onClick={closeMobileMenu}
              className="rounded-md px-2 py-2 text-sm font-medium text-[#555] transition hover:bg-black/5 hover:text-[#1D1D1F]"
            >
              협회원 및 학과가입
            </Link>
            <Link
              href="/#notice-board"
              onClick={closeMobileMenu}
              className="rounded-md px-2 py-2 text-sm font-medium text-[#555] transition hover:bg-black/5 hover:text-[#1D1D1F]"
            >
              공지사항/게시판
            </Link>
            <div className="pt-2">
              <KakaoLoginButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
