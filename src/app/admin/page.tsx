import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import {
  AdminCard,
  AdminCardBody,
  AdminCardHeader,
  StatusBadge,
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

const depositLabel: Record<string, string> = {
  PENDING: "입금 대기",
  CONFIRMED: "입금 확인",
  WAIVED: "입금 면제",
  CANCELLED: "취소",
};

export default async function AdminDashboardPage() {
  await requireAdmin();

  const [members, seminars, applications, pendingDeposits, notices] = await Promise.all([
    prisma.user.count(),
    prisma.seminar.count(),
    prisma.seminarApplication.count(),
    prisma.seminarApplication.count({ where: { depositStatus: "PENDING" } }),
    prisma.notice.count(),
  ]);

  const recentApplications = await prisma.seminarApplication.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    include: { seminar: true },
  });

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="회원" value={members} href="/admin/members" />
        <StatCard label="프로그램" value={seminars} href="/admin/seminars" />
        <StatCard label="신청자" value={applications} href="/admin/applications" />
        <StatCard label="입금 대기" value={pendingDeposits} href="/admin/applications" />
        <StatCard label="공지사항" value={notices} href="/admin/notices" />
      </div>

      <AdminCard>
        <AdminCardHeader
          title="최근 프로그램 신청"
          action={
            <Link href="/admin/applications" className="text-sm font-semibold text-[#2D6A4F]">
              전체 보기 →
            </Link>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-[#E5E8EB]">
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">신청자</th>
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">프로그램</th>
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">소속</th>
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">입금</th>
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">신청일</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-8 py-16 text-center text-sm text-[#8B95A1]">
                    아직 신청 내역이 없습니다.
                  </td>
                </tr>
              ) : (
                recentApplications.map((application) => (
                  <tr key={application.id} className="border-b border-[#E5E8EB] last:border-b-0 hover:bg-[#F2F4F6]">
                    <td className="px-8 py-4 text-sm font-semibold">{application.name}</td>
                    <td className="px-8 py-4 text-sm text-[#4E5968]">{application.seminar.title}</td>
                    <td className="px-8 py-4 text-sm text-[#4E5968]">{application.affiliation}</td>
                    <td className="px-8 py-4">
                      <StatusBadge
                        tone={
                          application.depositStatus === "PENDING"
                            ? "warning"
                            : application.depositStatus === "CONFIRMED" || application.depositStatus === "WAIVED"
                              ? "success"
                              : "muted"
                        }
                      >
                        {depositLabel[application.depositStatus] ?? application.depositStatus}
                      </StatusBadge>
                    </td>
                    <td className="px-8 py-4 text-sm text-[#8B95A1]">
                      {application.createdAt.toLocaleDateString("ko-KR")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </AdminCard>
    </div>
  );
}
