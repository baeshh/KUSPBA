import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/db";
import {
  extractNoticeThumbnail,
  isRecentNotice,
} from "@/lib/notice-thumbnail";

const PAGE_SIZE = 9;

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="7" y1="17" x2="17" y2="7" />
      <polyline points="7 7 17 7 17 17" />
    </svg>
  );
}

function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);
  for (let i = current - 1; i <= current + 1; i += 1) {
    if (i >= 1 && i <= total) pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  for (let i = 0; i < sorted.length; i += 1) {
    const page = sorted[i];
    if (i > 0 && page - sorted[i - 1] > 1) result.push("…");
    result.push(page);
  }
  return result;
}

export default async function NoticesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const requestedPage = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);

  const totalItems = await prisma.notice.count({
    where: { status: "PUBLISHED" },
  });
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const notices = await prisma.notice.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <main className="mx-auto max-w-[1040px] px-4 pb-16 pt-[calc(var(--header-offset)+20px)] sm:px-6 md:py-[100px]">
      <div className="mb-12">
        <h1 className="mb-3 text-[28px] font-extrabold tracking-[-0.04em] text-[#191919] md:text-[40px]">
          공지사항
        </h1>
        <p className="text-[15px] font-medium text-[#8B95A1] md:text-lg">
          KUSPBA의 새로운 소식과 활동을 확인해보세요.
        </p>
      </div>

      {notices.length === 0 ? (
        <p className="rounded-[24px] bg-[#F9FAFB] p-10 text-center font-bold text-[#8B95A1]">
          등록된 공지사항이 없습니다.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-7 lg:grid-cols-3">
            {notices.map((notice) => {
              const thumbnail = extractNoticeThumbnail(notice.content);
              const isNew = isRecentNotice(notice.publishedAt);

              return (
                <Link
                  key={notice.id}
                  href={`/notices/${notice.id}`}
                  className="group flex min-h-[260px] flex-col overflow-hidden rounded-[24px] border border-transparent bg-[#F9FAFB] transition-all duration-[400ms] ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-2 hover:border-[#E5E8EB] hover:bg-white hover:shadow-[0_24px_48px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.03)]"
                >
                  {thumbnail ? (
                    <div className="relative h-[180px] w-full overflow-hidden bg-[#E5E8EB]">
                      {thumbnail.startsWith("/") ? (
                        <Image
                          src={thumbnail}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 100vw, 310px"
                          className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.08]"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumbnail}
                          alt=""
                          className="h-full w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-[1.08]"
                        />
                      )}
                    </div>
                  ) : null}

                  <div className="flex flex-1 flex-col p-5 md:p-7">
                    <div className="mb-5 flex items-start justify-between gap-3">
                      <span
                        className={`rounded-lg px-3 py-1.5 text-[13px] font-bold ${
                          isNew
                            ? "bg-[#427A72]/10 text-[#427A72]"
                            : "bg-[#E5E8EB] text-[#4E5968]"
                        }`}
                      >
                        {isNew ? "최신" : "안내"}
                      </span>
                      <ArrowIcon className="shrink-0 text-[#B0B8C1] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#427A72]" />
                    </div>

                    <h2 className="mb-8 line-clamp-2 text-[20px] font-bold leading-[1.4] tracking-[-0.4px] text-[#191919]">
                      {notice.title}
                    </h2>

                    <div className="mt-auto flex items-center gap-4 text-sm font-medium text-[#8B95A1]">
                      <span>
                        {notice.publishedAt.toLocaleDateString("ko-KR")}
                      </span>
                      <span>조회 {notice.viewCount.toLocaleString()}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {totalPages > 1 ? (
            <nav
              className="mt-16 flex justify-center gap-2"
              aria-label="공지사항 페이지"
            >
              <Link
                href={page <= 2 ? "/notices" : `/notices?page=${page - 1}`}
                aria-disabled={page === 1}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                  page === 1
                    ? "pointer-events-none text-[#86868B] opacity-50"
                    : "text-[#86868B] hover:bg-black/5"
                }`}
              >
                &lt;
              </Link>

              {pageNumbers(page, totalPages).map((item, index) =>
                item === "…" ? (
                  <span
                    key={`ellipsis-${index}`}
                    className="flex h-10 w-10 items-center justify-center text-sm text-[#86868B]"
                  >
                    …
                  </span>
                ) : (
                  <Link
                    key={item}
                    href={item === 1 ? "/notices" : `/notices?page=${item}`}
                    className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                      page === item
                        ? "bg-[#1D1D1F] text-white"
                        : "text-[#86868B] hover:bg-black/5"
                    }`}
                  >
                    {item}
                  </Link>
                ),
              )}

              <Link
                href={`/notices?page=${Math.min(totalPages, page + 1)}`}
                aria-disabled={page === totalPages}
                className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                  page === totalPages
                    ? "pointer-events-none text-[#86868B] opacity-50"
                    : "text-[#86868B] hover:bg-black/5"
                }`}
              >
                &gt;
              </Link>
            </nav>
          ) : null}
        </>
      )}
    </main>
  );
}
