import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ApplicationForm } from "@/components/seminars/ApplicationForm";
import { prisma } from "@/lib/db";
import { getMemberGradeLabels } from "@/lib/member-grades";
import {
  formatSeminarPrice,
  getSeminarPriceByGrade,
  hasSeminarGradePrices,
  seminarActiveApplicationCountInclude,
  SEMINAR_MEMBER_GRADES,
  serializeSeminarList,
} from "@/lib/seminars";
import { RemainingCapacity } from "@/components/seminars/RemainingCapacity";
import { getCurrentUser, toPublicAuthUser } from "@/lib/auth";
import { findActiveUserApplication } from "@/lib/seminar-applications";

export const dynamic = "force-dynamic";

interface SeminarDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: SeminarDetailPageProps) {
  const { id } = await params;
  const seminar = await prisma.seminar.findUnique({ where: { id } });
  return {
    title: seminar ? `${seminar.title} | KUSPBA` : "세미나 상세 | KUSPBA",
  };
}

export default async function SeminarDetailPage({ params }: SeminarDetailPageProps) {
  const { id } = await params;
  const seminarRecord = await prisma.seminar.findUnique({
    where: { id },
    ...seminarActiveApplicationCountInclude,
  });

  if (!seminarRecord) {
    notFound();
  }

  const [seminar] = serializeSeminarList([seminarRecord]);
  const [gradeLabels, currentUser] = await Promise.all([
    getMemberGradeLabels(),
    getCurrentUser(),
  ]);
  const existingApplication = currentUser
    ? await findActiveUserApplication(prisma, seminar.id, currentUser)
    : null;
  const isClosed = seminar.status === "closed" || seminar.status === "ended";
  const recruitmentClosed = (isClosed || seminar.isFull) && !existingApplication;
  const hasGradePrices = hasSeminarGradePrices(seminar.prices);
  const gradePrices = SEMINAR_MEMBER_GRADES.map((grade) => ({
    grade,
    label: gradeLabels[grade],
    amount: getSeminarPriceByGrade(seminar.prices, grade),
  }));

  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-16 pt-[calc(var(--header-offset)+20px)] sm:px-6 md:pb-20 md:pt-[120px]">
      <Link
        href="/seminars"
        className="mb-8 inline-flex items-center gap-2 text-[15px] font-medium text-[#86868B] transition-colors hover:-translate-x-1 hover:text-[#427A72]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="19" y1="12" x2="5" y2="12" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        목록으로 돌아가기
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-16">
        <div>
          <span
            className={`mb-4 inline-block rounded-lg px-3 py-1.5 text-[13px] font-semibold ${
              recruitmentClosed
                ? "bg-[#F5F5F7] text-[#A1A1A6]"
                : "bg-[#427A72]/10 text-[#427A72]"
            }`}
          >
            {recruitmentClosed ? "마감" : "모집 중"}
          </span>
          <h1 className="mb-5 break-keep text-[26px] font-bold leading-tight md:mb-6 md:text-[40px]">
            {seminar.title}
          </h1>

          <div className="mb-8 rounded-2xl border border-black/[0.08] bg-white p-4 md:mb-10 md:p-6">
            <div className="space-y-3 text-[15px]">
              <div className="flex gap-4">
                <span className="w-20 shrink-0 font-semibold text-[#86868B]">
                  일시
                </span>
                <span className="font-medium">{seminar.eventDate}</span>
              </div>
              <div className="flex gap-4">
                <span className="w-20 shrink-0 font-semibold text-[#86868B]">
                  장소
                </span>
                <span className="font-medium">{seminar.location}</span>
              </div>
              <div className="flex gap-4">
                <span className="w-20 shrink-0 font-semibold text-[#86868B]">
                  모집인원
                </span>
                <span className="font-medium">{seminar.capacity}</span>
              </div>
              {seminar.remainingSeats !== null && (
                <div className="flex gap-4">
                  <span className="w-20 shrink-0 font-semibold text-[#86868B]">
                    잔여인원
                  </span>
                  <span
                    className={`font-semibold ${
                      seminar.isFull
                        ? "text-[#A1A1A6]"
                        : seminar.remainingSeats <= 5
                          ? "text-[#C2410C]"
                          : "text-[#427A72]"
                    }`}
                  >
                    {seminar.isFull ? "마감 (0명)" : `${seminar.remainingSeats}명`}
                    {seminar.capacityLimit !== null ? (
                      <span className="ml-1 font-normal text-[#86868B]">
                        / {seminar.capacityLimit}명
                      </span>
                    ) : null}
                  </span>
                </div>
              )}
              <div className="flex gap-4">
                <span className="w-20 shrink-0 font-semibold text-[#86868B]">
                  참가비
                </span>
                <div className="flex-1">
                  {hasGradePrices ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {gradePrices.map((price) => (
                        <div
                          key={price.grade}
                          className="flex items-center justify-between rounded-xl bg-[#F5F5F7] px-3 py-2"
                        >
                          <span className="text-sm font-bold text-[#427A72]">{price.label}</span>
                          <span className="font-bold">{formatSeminarPrice(price.amount)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span className="font-medium">{seminar.fee}</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="relative mb-8 h-[220px] w-full overflow-hidden rounded-[20px] border border-black/[0.08] bg-[#E8F0EE] md:mb-10 md:h-[400px]">
            {seminar.imageUrl.startsWith("/uploads/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={seminar.imageUrl}
                alt={seminar.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <Image
                src={seminar.imageUrl}
                alt={seminar.title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            )}
          </div>

          <div>
            <h3 className="mb-4 mt-10 text-2xl font-bold">세미나 소개</h3>
            <div className="space-y-4">
              {seminar.description.map((paragraph, i) => (
                <p key={i} className="text-base leading-relaxed text-[#86868B]">
                  {paragraph}
                </p>
              ))}
            </div>

            {seminar.program.length > 0 && (
              <>
                <h3 className="mb-4 mt-10 text-2xl font-bold">프로그램 안내</h3>
                <ul className="list-disc space-y-2 pl-5 text-[16px] leading-relaxed text-[#86868B]">
                  {seminar.program.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>

        {!recruitmentClosed && (
          <ApplicationForm
            seminarId={seminar.id}
            fee={
              hasGradePrices
                ? formatSeminarPrice(seminar.prices.priceBasic)
                : seminar.fee.startsWith("무료")
                ? "무료"
                : seminar.fee.split(" ")[0] ?? seminar.fee
            }
            hasFee={hasGradePrices || seminar.fee.includes("원")}
            prices={seminar.prices}
            hasGradePrices={hasGradePrices}
            gradeLabels={gradeLabels}
            capacity={seminar.capacity}
            appliedCount={seminar.appliedCount}
            remainingSeats={seminar.remainingSeats}
            capacityLimit={seminar.capacityLimit}
            isFull={seminar.isFull}
            currentUser={currentUser ? toPublicAuthUser(currentUser) : null}
            existingApplicationId={existingApplication?.id ?? null}
          />
        )}

        {recruitmentClosed && (
          <aside className="rounded-[24px] border border-black/[0.08] bg-[#F5F5F7] p-6 md:p-8">
            {seminar.remainingSeats !== null ? (
              <RemainingCapacity
                capacity={seminar.capacity}
                appliedCount={seminar.appliedCount}
                remainingSeats={seminar.remainingSeats}
                capacityLimit={seminar.capacityLimit}
                isFull={seminar.isFull}
              />
            ) : null}
            <p className="text-center font-semibold text-[#86868B]">
              {seminar.isFull && !isClosed
                ? "정원이 마감되어 신청할 수 없습니다."
                : "신청이 마감되었습니다."}
            </p>
          </aside>
        )}
      </div>
    </main>
  );
}
