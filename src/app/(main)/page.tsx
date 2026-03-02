import Link from "next/link";
import { ProgramCard } from "@/components/seminars/ProgramCard";

// TODO: API에서 실제 데이터 fetch로 교체
const MOCK_SEMINARS = [
  {
    id: "1",
    title: "2026 상반기 제약/바이오 직무 탐색 세미나",
    applicationPeriod: "2026.03.10 - 03.25",
    status: "recruiting" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1582719478250-c894090bdcb1?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "2",
    title: "[일대일 멘토링] 현직자와 함께하는 진로 설계",
    applicationPeriod: "2026.03.15 - 03.30",
    status: "recruiting" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=600",
  },
  {
    id: "3",
    title: "기업 연계 실전 프로젝트 1기",
    applicationPeriod: "2026.01.01 - 01.31",
    status: "ended" as const,
    imageUrl:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="px-6 pb-20 pt-[180px] text-center">
        <h1 className="mb-6 text-[56px] font-bold leading-[1.15] max-md:text-[40px]">
          <span
            className="bg-gradient-to-br from-[#427A72] to-[#4A6C82] bg-clip-text text-transparent"
          >
            우리는 머뭅니다.
            <br />
            당신이 머물지 않도록.
          </span>
        </h1>
        <p className="mx-auto mb-10 max-w-[600px] text-xl leading-relaxed text-[#86868B]">
          전국 유일의 대학생제약바이오산업협회.
          <br />
          지식을 잇고, 변화를 만들며, 내일을 준비하는 든든한 디딤돌이 됩니다.
        </p>
        <div className="flex justify-center gap-3">
          <Link
            href="/#programs"
            className="inline-flex items-center justify-center rounded-full bg-[#1D1D1F] px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-black"
          >
            진행 중인 세미나 보기
          </Link>
          <Link
            href="/#about"
            className="inline-flex items-center justify-center rounded-full border border-black/15 px-6 py-3 text-[15px] font-semibold transition-colors hover:bg-black/[0.03]"
          >
            협회 알아보기
          </Link>
        </div>
      </section>

      {/* Programs */}
      <section id="programs" className="border-t border-black/5 px-6 py-[120px]">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-16 text-center">
            <h2 className="mb-3 text-4xl font-bold">세미나 & 교육 프로그램</h2>
            <p className="text-lg text-[#86868B]">
              KUSPBA와 함께 제약/바이오 현업의 생생한 지식을 경험하세요.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_SEMINARS.map((seminar) => (
              <ProgramCard key={seminar.id} {...seminar} />
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry Banner */}
      <section id="inquiry" className="px-6 py-16">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col items-center rounded-[24px] bg-gradient-to-br from-[#427A72] to-[#4A6C82] px-12 py-12 text-center text-white md:px-[48px] md:py-[48px]">
            <h2 className="mb-3 text-2xl font-semibold md:text-[28px]">
              학과 단위로 KUSPBA와 함께하세요
            </h2>
            <p className="mb-6 max-w-[500px] text-base opacity-90">
              타 대학 제약/바이오 학과 학생들과의 탄탄한 네트워크. 학과 단위
              가입은 별도 문의를 통해 수동 등록으로 진행됩니다.
            </p>
            <a
              href="#"
              className="inline-flex items-center justify-center rounded-full bg-white px-7 py-3.5 text-[15px] font-semibold text-[#427A72] transition-colors hover:bg-[#F5F5F7]"
            >
              💬 카카오톡으로 가입 문의하기
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
