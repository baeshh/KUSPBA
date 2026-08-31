import Link from "next/link";

export function TermsPageLayout({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto max-w-[760px] px-4 pb-16 pt-[calc(var(--header-offset)+20px)] sm:px-6 md:pb-20 md:pt-[120px]">
      <Link
        href="/"
        className="mb-10 inline-flex items-center gap-2 text-[15px] font-medium text-[#86868B] transition-colors hover:-translate-x-1 hover:text-[#427A72]"
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
      <h1 className="mb-8 break-keep text-[28px] font-bold tracking-[-0.03em] text-[#1D1D1F] md:text-[36px]">
        {title}
      </h1>
      <div className="rounded-[24px] border border-black/[0.08] bg-white p-6 text-[15px] leading-relaxed text-[#555] md:p-10">
        {children}
      </div>
    </main>
  );
}
