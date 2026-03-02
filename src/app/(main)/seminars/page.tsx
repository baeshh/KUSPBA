import Link from "next/link";
import { SeminarsList } from "@/components/seminars/SeminarsList";
import { MOCK_SEMINARS } from "@/lib/seminars";

export default function SeminarsPage() {
  return (
    <main className="mx-auto max-w-[1200px] px-6 py-[120px]">
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 px-0 py-2 text-[15px] font-medium text-[#86868B] transition-colors hover:-translate-x-1 hover:text-[#427A72]"
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
        메인으로 돌아가기
      </Link>
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-[40px] font-bold tracking-[-0.03em] max-md:text-[32px]">
          세미나 & 교육 프로그램
        </h1>
        <p className="text-lg text-[#86868B]">
          제약/바이오 현업의 생생한 지식과 실무 경험을 연결합니다.
        </p>
      </div>

      <SeminarsList seminars={MOCK_SEMINARS} />
    </main>
  );
}
