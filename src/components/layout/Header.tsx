import Link from "next/link";
import Image from "next/image";
import { KakaoLoginButton } from "@/components/auth/KakaoLoginButton";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-[60px] border-b border-black/5 bg-[rgba(251,251,253,0.85)] backdrop-blur-xl">
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
        <nav className="flex items-center gap-8">
          <Link
            href="/about"
            className="text-sm font-medium text-[#86868B] transition-colors hover:text-[#1D1D1F]"
          >
            협회 소개
          </Link>
          <Link
            href="/seminars"
            className="text-sm font-medium text-[#86868B] transition-colors hover:text-[#1D1D1F]"
          >
            세미나/교육
          </Link>
          <Link
            href="/#inquiry"
            className="text-sm font-medium text-[#86868B] transition-colors hover:text-[#1D1D1F]"
          >
            학과 제휴
          </Link>
          <KakaoLoginButton />
        </nav>
      </div>
    </header>
  );
}
