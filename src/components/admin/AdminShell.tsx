"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/app/admin/actions";

const navItems: Array<{ href: string; label: string; exact?: boolean }> = [
  { href: "/admin", label: "대시보드", exact: true },
  { href: "/admin/members", label: "회원 관리" },
  { href: "/admin/seminars", label: "프로그램 관리" },
  { href: "/admin/applications", label: "신청/입금 확인" },
  { href: "/admin/notices", label: "공지사항 관리" },
];

function titleFromPath(pathname: string) {
  const found = navItems.find((item) =>
    item.exact ? pathname === item.href : pathname.startsWith(item.href),
  );
  return found?.label ?? "관리자";
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F2F4F6] text-[#191F28] antialiased">
      <aside className="flex w-[260px] shrink-0 flex-col border-r border-[#E5E8EB] bg-white">
        <div className="flex h-[72px] items-center border-b border-[#E5E8EB] px-6">
          <Link href="/admin" className="text-lg font-extrabold tracking-[-0.03em]">
            KUSPBA Admin
          </Link>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center rounded-xl px-4 py-3 text-[15px] font-semibold transition ${
                  active
                    ? "bg-[#EAF0EC] text-[#2D6A4F]"
                    : "text-[#4E5968] hover:bg-[#F2F4F6] hover:text-[#191F28]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[#E5E8EB] p-4">
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#8B95A1] transition hover:bg-[#F2F4F6] hover:text-[#191F28]"
            >
              로그아웃
            </button>
          </form>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#E5E8EB] bg-white px-6 md:px-10">
          <h1 className="text-lg font-bold tracking-[-0.02em]">{titleFromPath(pathname)}</h1>
          <div className="flex items-center gap-3 text-sm font-semibold text-[#4E5968]">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2D6A4F] text-xs font-bold text-white">
              A
            </span>
            관리자님
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
}
