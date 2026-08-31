import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import {
  AdminCard,
  AdminCardBody,
  adminBtnOutlineClass,
  adminBtnPrimaryClass,
} from "@/components/admin/ui";

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-[#E5E8EB] bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.03)] transition hover:border-[#2D6A4F]/30 hover:shadow-[0_8px_20px_rgba(45,106,79,0.08)]"
    >
      <p className="mb-3 text-sm font-semibold text-[#8B95A1]">{label}</p>
      <p className="text-[32px] font-extrabold tracking-[-0.04em] text-[#191F28]">
        {value.toLocaleString()}
      </p>
    </Link>
  );
}

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [members, seminars, applications] = await Promise.all([
    prisma.user.count(),
    prisma.seminar.count(),
    prisma.seminarApplication.count(),
  ]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="회원" value={members} href="/admin/members" />
        <StatCard label="프로그램" value={seminars} href="/admin/seminars" />
        <StatCard label="신청자" value={applications} href="/admin/applications" />
      </div>

      <AdminCard>
        <AdminCardBody>
          <p className="mb-4 text-sm font-semibold text-[#4E5968]">빠른 실행</p>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/notices?new=1" className={adminBtnPrimaryClass}>
              + 새 공지 작성
            </Link>
            <Link href="/admin/seminars?new=1" className={adminBtnOutlineClass}>
              + 새 프로그램 등록
            </Link>
            <Link href="/admin/members" className={adminBtnOutlineClass}>
              회원 관리
            </Link>
            <Link href="/admin/applications" className={adminBtnOutlineClass}>
              신청·입금 관리
            </Link>
          </div>
        </AdminCardBody>
      </AdminCard>
    </div>
  );
}
