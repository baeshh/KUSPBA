import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";

function StatCard({ label, value, href }: { label: string; value: number; href: string }) {
  return (
    <Link
      href={href}
      className="rounded-[24px] border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <p className="mb-3 text-sm font-bold text-[#86868B]">{label}</p>
      <p className="text-[36px] font-black tracking-[-0.04em]">{value.toLocaleString()}</p>
    </Link>
  );
}

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
    take: 6,
    include: { seminar: true },
  });

  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-sm font-black text-[#8ABFB2]">Dashboard</p>
        <h1 className="text-[36px] font-black tracking-[-0.04em]">어드민 대시보드</h1>
      </div>

      <div className="mb-10 grid gap-4 md:grid-cols-5">
        <StatCard label="회원" value={members} href="/admin/members" />
        <StatCard label="프로그램" value={seminars} href="/admin/seminars" />
        <StatCard label="신청자" value={applications} href="/admin/applications" />
        <StatCard label="입금 대기" value={pendingDeposits} href="/admin/applications" />
        <StatCard label="공지사항" value={notices} href="/admin/notices" />
      </div>

      <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-xl font-black">최근 프로그램 신청</h2>
          <Link href="/admin/applications" className="text-sm font-bold text-[#427A72]">
            전체 보기 →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-[#86868B]">
              <tr className="border-b border-black/10">
                <th className="py-3">신청자</th>
                <th className="py-3">프로그램</th>
                <th className="py-3">소속</th>
                <th className="py-3">입금</th>
                <th className="py-3">신청일</th>
              </tr>
            </thead>
            <tbody>
              {recentApplications.map((application) => (
                <tr key={application.id} className="border-b border-black/5">
                  <td className="py-3 font-bold">{application.name}</td>
                  <td className="py-3">{application.seminar.title}</td>
                  <td className="py-3">{application.affiliation}</td>
                  <td className="py-3">{application.depositStatus}</td>
                  <td className="py-3">{application.createdAt.toLocaleDateString("ko-KR")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
