import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  getMemberGradeLabels,
  getMemberGradeOptions,
  MEMBER_SELECTABLE_GRADES,
} from "@/lib/member-grades";
import { MembershipApplyForm } from "@/components/auth/MembershipApplyForm";

export const metadata = {
  title: "마이페이지 | KUSPBA",
  description: "내 신청내역과 회원 등급을 확인하고, 회원 등급을 신청합니다.",
};

export default async function MyPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/api/auth/kakao/login");
  }

  const [gradeLabels, gradeOptions, applications] = await Promise.all([
    getMemberGradeLabels(),
    getMemberGradeOptions(),
    prisma.seminarApplication.findMany({
      where: {
        OR: [
          { userId: user.id },
          ...(user.email ? [{ email: user.email }] : []),
        ],
      },
      include: { seminar: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  const selectableGrades = gradeOptions.filter((option) =>
    (MEMBER_SELECTABLE_GRADES as readonly string[]).includes(option.value),
  );
  const currentGradeLabel = gradeLabels[user.grade] ?? user.grade;
  const requestedGradeLabel = user.requestedGrade
    ? (gradeLabels[user.requestedGrade] ?? user.requestedGrade)
    : null;
  const isPending =
    Boolean(user.requestedGrade) && user.requestedGrade !== user.grade;

  return (
    <div className="mx-auto max-w-[880px] px-4 pb-16 pt-[calc(var(--header-offset)+20px)] sm:px-6 md:pb-24 md:pt-[120px]">
      <p className="mb-2 text-sm font-bold text-[#8ABFB2]">My Page</p>
      <h1 className="mb-2 break-keep text-[26px] font-black tracking-[-0.03em] text-[#222] md:text-[40px]">
        {user.name}님, 환영합니다
      </h1>
      <p className="mb-10 text-[#666]">
        내 신청내역과 회원 등급을 한곳에서 확인하고, 로그인과 함께 등급 신청도 할 수 있습니다.
      </p>

      <section className="mb-8 rounded-[20px] border border-[#C1E4D7]/80 bg-[#F7FFFC] p-5 md:rounded-[24px] md:p-8">
        <p className="mb-1 text-sm font-bold text-[#8ABFB2]">회원 등급</p>
        <p className="text-2xl font-black tracking-[-0.03em] text-[#222]">
          {currentGradeLabel}
        </p>
        {isPending && requestedGradeLabel ? (
          <p className="mt-2 text-sm font-medium text-[#427A72]">
            {requestedGradeLabel} 등급 신청이 접수되어 심사 중입니다.
          </p>
        ) : (
          <p className="mt-2 text-sm text-[#666]">
            현재 반영된 회원 등급입니다. 프로그램 참가비에 적용됩니다.
          </p>
        )}
      </section>

      <section className="mb-10">
        <MembershipApplyForm
          name={user.name}
          email={user.email ?? ""}
          phone={user.phone ?? ""}
          affiliation={user.affiliation ?? ""}
          memberType={user.memberType}
          requestedGrade={user.requestedGrade ?? ""}
          gradeOptions={selectableGrades}
          alreadyRequested={Boolean(user.requestedGrade)}
        />
      </section>

      <section>
        <h2 className="mb-4 text-xl font-black tracking-[-0.03em] text-[#222]">
          내 신청내역
        </h2>
        {applications.length === 0 ? (
          <div className="rounded-[24px] border border-black/8 bg-white px-6 py-10 text-center">
            <p className="mb-4 text-[#666]">아직 신청한 프로그램이 없습니다.</p>
            <Link
              href="/seminars"
              className="inline-flex items-center justify-center rounded-full bg-[#373737] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#222]"
            >
              프로그램 보러 가기
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {applications.map((application) => (
              <li
                key={application.id}
                className="rounded-[20px] border border-black/8 bg-white px-5 py-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-[#222]">
                      {application.seminar.title}
                    </p>
                    <p className="mt-1 text-sm text-[#666]">
                      신청일 {application.createdAt.toLocaleDateString("ko-KR")} ·{" "}
                      {application.isMember ? "협회원" : "일반"}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#F8F9FA] px-3 py-1 text-xs font-bold text-[#555]">
                    {application.depositStatus === "CONFIRMED"
                      ? "입금 확인"
                      : application.depositStatus === "WAIVED"
                        ? "입금 면제"
                        : application.depositStatus === "CANCELLED"
                          ? "취소"
                          : "입금 대기"}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
