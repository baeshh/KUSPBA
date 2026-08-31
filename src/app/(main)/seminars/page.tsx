import Link from "next/link";
import { SeminarsList } from "@/components/seminars/SeminarsList";
import { prisma } from "@/lib/db";
import { seminarActiveApplicationCountInclude, serializeSeminarList } from "@/lib/seminars";
import { buildPageMetadata, type PageSeoKey } from "@/lib/seo";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";

const VALUE_LABELS: Record<string, string> = {
  connection: "연결",
  pioneer: "개척",
  foundation: "토대",
};

const VALUE_SEO: Record<string, PageSeoKey> = {
  foundation: "didimdol",
  connection: "jobSeminar",
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ value?: string }>;
}): Promise<Metadata> {
  const { value } = await searchParams;
  const key = value ? VALUE_SEO[value] ?? "programs" : "programs";
  return buildPageMetadata(key);
}

export default async function SeminarsPage({
  searchParams,
}: {
  searchParams: Promise<{ value?: string }>;
}) {
  const { value } = await searchParams;
  const valueLabel = value ? VALUE_LABELS[value] : null;
  const seminars = await prisma.seminar.findMany({
    orderBy: { createdAt: "desc" },
    ...seminarActiveApplicationCountInclude,
  });

  return (
    <main className="mx-auto max-w-[1200px] px-4 pb-16 pt-[calc(var(--header-offset)+20px)] sm:px-6 md:pb-20 md:pt-[120px]">
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
      <div className="mb-10 text-center md:mb-16">
        <h1 className="mb-3 break-keep text-[28px] font-bold tracking-[-0.03em] md:mb-4 md:text-[40px]">
          {valueLabel ? `${valueLabel} 프로그램` : "KUSPBA 프로그램"}
        </h1>
        <p className="break-keep text-[15px] leading-relaxed text-[#86868B] md:text-lg">
          {valueLabel
            ? `${valueLabel} 핵심가치와 연결된 프로그램만 보여드립니다.`
            : "제약·바이오산업의 생생한 지식과 실무 경험을 연결합니다."}
        </p>
        {valueLabel ? (
          <Link
            href="/seminars"
            className="mt-4 inline-block text-sm font-semibold text-[#427A72] hover:underline"
          >
            전체 프로그램 보기
          </Link>
        ) : null}
      </div>

      <SeminarsList seminars={serializeSeminarList(seminars)} valueFilter={value} />
    </main>
  );
}
