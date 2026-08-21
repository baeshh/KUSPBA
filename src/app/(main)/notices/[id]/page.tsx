import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { sanitizeNoticeHtml } from "@/lib/sanitize-notice-html";

interface NoticeDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: NoticeDetailPageProps) {
  const { id } = await params;
  const notice = await prisma.notice.findUnique({ where: { id } });
  return {
    title: notice ? `${notice.title} | KUSPBA` : "공지사항 | KUSPBA",
  };
}

export default async function NoticeDetailPage({ params }: NoticeDetailPageProps) {
  const { id } = await params;
  const notice = await prisma.notice.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  }).catch(() => null);

  if (!notice || notice.status !== "PUBLISHED") {
    notFound();
  }

  // 목록(최신순) 기준: 이전 = 더 오래된 글, 다음 = 더 최신 글
  const [previousNotice, nextNotice] = await Promise.all([
    prisma.notice.findFirst({
      where: {
        status: "PUBLISHED",
        OR: [
          { publishedAt: { lt: notice.publishedAt } },
          { publishedAt: notice.publishedAt, id: { lt: notice.id } },
        ],
      },
      orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
      select: { id: true, title: true },
    }),
    prisma.notice.findFirst({
      where: {
        status: "PUBLISHED",
        OR: [
          { publishedAt: { gt: notice.publishedAt } },
          { publishedAt: notice.publishedAt, id: { gt: notice.id } },
        ],
      },
      orderBy: [{ publishedAt: "asc" }, { id: "asc" }],
      select: { id: true, title: true },
    }),
  ]);

  return (
    <main className="mx-auto max-w-[900px] px-4 pb-16 pt-[calc(var(--header-offset)+20px)] sm:px-6 md:py-[120px]">
      <Link
        href="/notices"
        className="mb-8 inline-flex items-center gap-2 text-[15px] font-medium text-[#86868B] transition-colors hover:-translate-x-1 hover:text-[#427A72]"
      >
        ← 목록으로 돌아가기
      </Link>
      <article className="overflow-x-hidden rounded-[20px] border border-black/10 bg-white p-5 shadow-sm md:rounded-[28px] md:p-10">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm font-bold text-[#86868B]">
          {notice.pinOrder ? (
            <span className="rounded-full bg-[#1D1D1F] px-3 py-1 text-xs font-bold text-white">
              고정 {notice.pinOrder}
            </span>
          ) : null}
          <span>{notice.publishedAt.toLocaleDateString("ko-KR")}</span>
          <span>조회 {notice.viewCount.toLocaleString()}</span>
        </div>
        <h1 className="mb-6 break-keep text-[24px] font-black leading-tight tracking-[-0.04em] md:mb-8 md:text-[36px]">
          {notice.title}
        </h1>
        <div
          className="overflow-x-auto text-[16px] leading-relaxed text-[#555] md:text-lg [&_a]:font-bold [&_a]:text-[#427A72] [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[#8ABFB2] [&_blockquote]:bg-[#F8F9FA] [&_blockquote]:px-5 [&_blockquote]:py-4 [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-black [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-black [&_img]:my-6 [&_img]:h-auto [&_img]:max-h-[640px] [&_img]:max-w-full [&_img]:rounded-2xl [&_li]:ml-6 [&_ol]:my-4 [&_ol]:list-decimal [&_p]:my-4 [&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto [&_ul]:my-4 [&_ul]:list-disc"
          dangerouslySetInnerHTML={{ __html: sanitizeNoticeHtml(notice.content) }}
        />
      </article>

      <nav
        className="mt-8 grid gap-3 border-t border-black/10 pt-8 sm:grid-cols-2"
        aria-label="이전·다음 공지"
      >
        {previousNotice ? (
          <Link
            href={`/notices/${previousNotice.id}`}
            className="group rounded-2xl border border-black/10 bg-white px-5 py-4 transition hover:border-[#427A72]/30 hover:bg-[#F8F9FA]"
          >
            <p className="mb-1 text-sm font-semibold text-[#86868B]">← 이전 게시물</p>
            <p className="line-clamp-1 text-[15px] font-bold text-[#1D1D1F] transition-colors group-hover:text-[#427A72]">
              {previousNotice.title}
            </p>
          </Link>
        ) : (
          <div className="rounded-2xl border border-dashed border-black/10 px-5 py-4">
            <p className="mb-1 text-sm font-semibold text-[#A1A1A6]">← 이전 게시물</p>
            <p className="text-[15px] font-medium text-[#A1A1A6]">이전 게시물이 없습니다</p>
          </div>
        )}

        {nextNotice ? (
          <Link
            href={`/notices/${nextNotice.id}`}
            className="group rounded-2xl border border-black/10 bg-white px-5 py-4 text-right transition hover:border-[#427A72]/30 hover:bg-[#F8F9FA]"
          >
            <p className="mb-1 text-sm font-semibold text-[#86868B]">다음 게시물 →</p>
            <p className="line-clamp-1 text-[15px] font-bold text-[#1D1D1F] transition-colors group-hover:text-[#427A72]">
              {nextNotice.title}
            </p>
          </Link>
        ) : (
          <div className="rounded-2xl border border-dashed border-black/10 px-5 py-4 text-right">
            <p className="mb-1 text-sm font-semibold text-[#A1A1A6]">다음 게시물 →</p>
            <p className="text-[15px] font-medium text-[#A1A1A6]">다음 게시물이 없습니다</p>
          </div>
        )}
      </nav>
    </main>
  );
}
