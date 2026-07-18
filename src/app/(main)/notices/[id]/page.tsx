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

  return (
    <main className="mx-auto max-w-[900px] px-6 py-[120px]">
      <Link
        href="/notices"
        className="mb-8 inline-flex items-center gap-2 text-[15px] font-medium text-[#86868B] transition-colors hover:-translate-x-1 hover:text-[#427A72]"
      >
        ← 목록으로 돌아가기
      </Link>
      <article className="rounded-[28px] border border-black/10 bg-white p-8 shadow-sm md:p-10">
        <div className="mb-6 flex flex-wrap items-center gap-3 text-sm font-bold text-[#86868B]">
          <span>{notice.publishedAt.toLocaleDateString("ko-KR")}</span>
          <span>조회 {notice.viewCount.toLocaleString()}</span>
        </div>
        <h1 className="mb-8 text-[36px] font-black leading-tight tracking-[-0.04em]">
          {notice.title}
        </h1>
        <div
          className="text-lg leading-relaxed text-[#555] [&_a]:font-bold [&_a]:text-[#427A72] [&_blockquote]:my-6 [&_blockquote]:border-l-4 [&_blockquote]:border-[#8ABFB2] [&_blockquote]:bg-[#F8F9FA] [&_blockquote]:px-5 [&_blockquote]:py-4 [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-black [&_h3]:mb-3 [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-black [&_img]:my-8 [&_img]:max-h-[640px] [&_img]:max-w-full [&_img]:rounded-2xl [&_li]:ml-6 [&_ol]:my-4 [&_ol]:list-decimal [&_p]:my-4 [&_ul]:my-4 [&_ul]:list-disc"
          dangerouslySetInnerHTML={{ __html: sanitizeNoticeHtml(notice.content) }}
        />
      </article>
    </main>
  );
}
