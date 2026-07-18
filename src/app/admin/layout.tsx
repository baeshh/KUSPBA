import Link from "next/link";
import { logoutAdmin } from "./actions";

const navItems = [
  { href: "/admin", label: "대시보드" },
  { href: "/admin/seminars", label: "프로그램 관리" },
  { href: "/admin/applications", label: "신청/입금 확인" },
  { href: "/admin/members", label: "회원 관리" },
  { href: "/admin/notices", label: "공지사항 관리" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#1D1D1F]">
      <header className="border-b border-black/10 bg-white">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-4 px-6 py-4">
          <Link href="/admin" className="text-xl font-black tracking-[-0.03em]">
            KUSPBA Admin
          </Link>
          <nav className="flex flex-wrap items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full px-4 py-2 text-sm font-bold text-[#555] transition hover:bg-[#E8F0EE] hover:text-[#1D1D1F]"
              >
                {item.label}
              </Link>
            ))}
            <form action={logoutAdmin}>
              <button
                type="submit"
                className="rounded-full bg-[#1D1D1F] px-4 py-2 text-sm font-bold text-white transition hover:bg-black"
              >
                로그아웃
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[1280px] px-6 py-10">{children}</main>
    </div>
  );
}
