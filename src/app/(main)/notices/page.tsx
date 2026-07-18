import Link from "next/link";
import { prisma } from "@/lib/db";

export default async function NoticesPage() {
  const notices = await prisma.notice.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-[1000px] px-6 py-[120px]">
      <div className="mb-14 text-center">
        <p className="mb-3 text-lg font-bold text-[#8ABFB2]">Notice</p>
        <h1 className="mb-4 text-[40px] font-black tracking-[-0.04em] max-md:text-[32px]">
          공지사항
        </h1>
        <p className="text-lg text-[#86868B]">
          KUSPBA의 주요 소식과 안내를 확인하세요.
        </p>
      </div>

      <div className="space-y-4">
        {notices.map((notice) => (
          <Link
            key={notice.id}
            href={`/notices/${notice.id}`}
            className="block rounded-[24px] border border-black/10 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-sm font-bold text-[#86868B]">
              <span>{notice.publishedAt.toLocaleDateString("ko-KR")}</span>
              <span>조회 {notice.viewCount.toLocaleString()}</span>
            </div>
            <h2 className="text-2xl font-black tracking-[-0.03em]">{notice.title}</h2>
          </Link>
        ))}
        {notices.length === 0 && (
          <p className="rounded-[24px] bg-[#F8F9FA] p-10 text-center font-bold text-[#86868B]">
            등록된 공지사항이 없습니다.
          </p>
        )}
      </div>
    </main>
  );
}
