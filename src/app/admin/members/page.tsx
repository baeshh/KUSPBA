import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { getMemberGradeOptions } from "@/lib/member-grades";
import { deleteUser, updateMemberGradeLabels, updateUser } from "../actions";

const memberTypes = [
  ["ASSOCIATE", "협회원"],
  ["DEPARTMENT", "학과회원"],
];

const roles = [
  ["USER", "일반"],
  ["ADMIN", "관리자"],
];

export default async function AdminMembersPage() {
  await requireAdmin();
  const [users, gradeOptions] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { applications: true } } },
    }),
    getMemberGradeOptions(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-sm font-black text-[#8ABFB2]">Members</p>
        <h1 className="text-[36px] font-black tracking-[-0.04em]">회원 관리</h1>
      </div>

      <section className="mb-8 rounded-[24px] border border-black/10 bg-white p-5 shadow-sm">
        <h2 className="mb-2 text-lg font-black">회원 등급 이름 설정</h2>
        <p className="mb-4 text-sm text-[#86868B]">
          등급 키(BASIC~SPECIAL)는 유지되고, 화면에 표시되는 이름만 변경됩니다. 가격·회원 배정에도 이 이름이 반영됩니다.
        </p>
        <form action={updateMemberGradeLabels} className="grid gap-3 md:grid-cols-5">
          {gradeOptions.map((grade) => (
            <label key={grade.value} className="block">
              <span className="mb-1 block text-xs font-bold text-[#86868B]">{grade.value}</span>
              <input
                name={`label_${grade.value}`}
                defaultValue={grade.label}
                className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
              />
            </label>
          ))}
          <div className="md:col-span-5">
            <button className="rounded-xl bg-[#1D1D1F] px-4 py-2 text-sm font-bold text-white">
              등급 이름 저장
            </button>
          </div>
        </form>
      </section>

      <div className="space-y-4">
        {users.map((user) => (
          <section key={user.id} className="rounded-[24px] border border-black/10 bg-white p-5 shadow-sm">
            <form action={updateUser} className="grid gap-3 md:grid-cols-4">
              <input type="hidden" name="id" value={user.id} />
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-[#86868B]">회원 이름</span>
                <input
                  name="name"
                  defaultValue={user.name}
                  required
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-[#86868B]">이메일</span>
                <input
                  name="email"
                  defaultValue={user.email ?? ""}
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-[#86868B]">연락처</span>
                <input
                  name="phone"
                  defaultValue={user.phone ?? ""}
                  placeholder="연락처"
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-[#86868B]">소속</span>
                <input
                  name="affiliation"
                  defaultValue={user.affiliation ?? ""}
                  placeholder="소속"
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-[#86868B]">회원 유형</span>
                <select
                  name="memberType"
                  defaultValue={user.memberType}
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                >
                  {memberTypes.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-[#86868B]">회원 등급</span>
                <select
                  name="grade"
                  defaultValue={user.grade}
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                >
                  {gradeOptions.map((grade) => (
                    <option key={grade.value} value={grade.value}>{grade.label}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-[#86868B]">권한</span>
                <select
                  name="role"
                  defaultValue={user.role}
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                >
                  {roles.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-[#86868B]">관리 메모</span>
                <input
                  name="memo"
                  defaultValue={user.memo ?? ""}
                  placeholder="관리 메모"
                  className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm"
                />
              </label>
              <div className="flex items-center justify-between gap-3 md:col-span-4">
                <p className="text-sm font-bold text-[#86868B]">
                  신청 {user._count.applications}건 · 가입일 {user.createdAt.toLocaleDateString("ko-KR")}
                </p>
                <button className="rounded-xl bg-[#427A72] px-4 py-2 text-sm font-bold text-white">
                  회원 정보 저장
                </button>
              </div>
            </form>
            <form action={deleteUser} className="mt-3 text-right">
              <input type="hidden" name="id" value={user.id} />
              <button className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600">
                회원 삭제
              </button>
            </form>
          </section>
        ))}
      </div>
    </div>
  );
}
