import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { getMemberGradeLabels } from "@/lib/member-grades";
import { updateApplication } from "../actions";

const depositOptions = [
  ["PENDING", "입금 대기"],
  ["CONFIRMED", "입금 확인"],
  ["WAIVED", "입금 면제"],
  ["CANCELLED", "취소"],
];

export default async function AdminApplicationsPage() {
  await requireAdmin();
  const [applications, gradeLabels] = await Promise.all([
    prisma.seminarApplication.findMany({
      orderBy: { createdAt: "desc" },
      include: { seminar: true, user: true },
    }),
    getMemberGradeLabels(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-sm font-black text-[#8ABFB2]">Applications</p>
        <h1 className="text-[36px] font-black tracking-[-0.04em]">신청/입금 확인</h1>
      </div>

      <div className="space-y-4">
        {applications.map((application) => {
          const gradeKey = application.isMember
            ? (application.user?.grade ?? "REGULAR")
            : "BASIC";
          const gradeLabel = gradeLabels[gradeKey] ?? gradeKey;

          return (
            <section key={application.id} className="rounded-[24px] border border-black/10 bg-white p-5 shadow-sm">
              <div className="mb-4 grid gap-3 md:grid-cols-4">
                <div>
                  <p className="text-xs font-bold text-[#86868B]">신청자</p>
                  <p className="font-black">{application.name}</p>
                  <p className="text-sm text-[#555]">{application.email}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#86868B]">프로그램</p>
                  <p className="font-bold">{application.seminar.title}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#86868B]">소속/연락처</p>
                  <p className="font-bold">{application.affiliation}</p>
                  <p className="text-sm text-[#555]">{application.phone}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-[#86868B]">금액/회원</p>
                  <p className="font-bold">{application.depositAmount.toLocaleString()}원</p>
                  <p className="text-sm text-[#555]">
                    {application.isMember ? `협회원 · ${gradeLabel}` : `일반 · ${gradeLabel}`}
                  </p>
                </div>
              </div>

              <form action={updateApplication} className="grid gap-3 md:grid-cols-[200px_1fr_auto]">
                <input type="hidden" name="id" value={application.id} />
                <select
                  name="depositStatus"
                  defaultValue={application.depositStatus}
                  className="rounded-xl border border-black/10 px-3 py-2 text-sm"
                >
                  {depositOptions.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <input
                  name="memo"
                  defaultValue={application.memo ?? ""}
                  placeholder="관리 메모"
                  className="rounded-xl border border-black/10 px-3 py-2 text-sm"
                />
                <button className="rounded-xl bg-[#427A72] px-4 py-2 text-sm font-bold text-white">
                  상태 저장
                </button>
              </form>
            </section>
          );
        })}
      </div>
    </div>
  );
}
