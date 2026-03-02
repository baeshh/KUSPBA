import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getSeminarById } from "@/lib/seminars";
import { ApplicationForm } from "@/components/seminars/ApplicationForm";

interface SeminarDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: SeminarDetailPageProps) {
  const { id } = await params;
  const seminar = getSeminarById(id);
  return {
    title: seminar ? `${seminar.title} | KUSPBA` : "세미나 상세 | KUSPBA",
  };
}

export default async function SeminarDetailPage({ params }: SeminarDetailPageProps) {
  const { id } = await params;
  const seminar = getSeminarById(id);

  if (!seminar) {
    notFound();
  }

  const isClosed = seminar.status === "closed" || seminar.status === "ended";

  return (
    <main className="mx-auto max-w-[1200px] px-6 pb-20 pt-[120px]">
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

      <div className="grid gap-16 lg:grid-cols-[1fr_400px] lg:gap-16">
        <div>
          <span
            className={`mb-4 inline-block rounded-lg px-3 py-1.5 text-[13px] font-semibold ${
              isClosed
                ? "bg-[#F5F5F7] text-[#A1A1A6]"
                : "bg-[#427A72]/10 text-[#427A72]"
            }`}
          >
            {isClosed ? "마감" : "모집 중"}
          </span>
          <h1 className="mb-6 text-[40px] font-bold leading-tight max-md:text-[32px]">
            {seminar.title}
          </h1>

          <div className="mb-10 rounded-2xl border border-black/[0.08] bg-white p-6">
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
              <div className="flex gap-4">
                <span className="w-20 shrink-0 font-semibold text-[#86868B]">
                  참가비
                </span>
                <span className="font-medium">{seminar.fee}</span>
              </div>
            </div>
          </div>

          <div className="relative mb-10 h-[400px] w-full overflow-hidden rounded-[20px] border border-black/[0.08] bg-[#E8F0EE]">
            <Image
              src={seminar.imageUrl}
              alt={seminar.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority
            />
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

        {!isClosed && (
          <ApplicationForm
            seminarId={seminar.id}
            fee={
              seminar.fee.startsWith("무료")
                ? "무료"
                : seminar.fee.split(" ")[0] ?? seminar.fee
            }
            hasFee={seminar.fee.includes("원")}
          />
        )}

        {isClosed && (
          <aside className="rounded-[24px] border border-black/[0.08] bg-[#F5F5F7] p-8">
            <p className="text-center font-semibold text-[#86868B]">
              신청이 마감되었습니다.
            </p>
          </aside>
        )}
      </div>
    </main>
  );
}
