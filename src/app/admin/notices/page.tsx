import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { sanitizeNoticeHtml } from "@/lib/sanitize-notice-html";
import { NoticeRichEditor } from "@/components/NoticeRichEditor";
import { deleteNotice, saveNotice } from "../actions";

export default async function AdminNoticesPage() {
  await requireAdmin();
  const notices = await prisma.notice.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-sm font-black text-[#8ABFB2]">Notices</p>
        <h1 className="text-[36px] font-black tracking-[-0.04em]">공지사항 관리</h1>
      </div>

      <div className="mb-10">
        <NoticeRichEditor action={saveNotice} heading="새 공지 작성" submitLabel="공지 등록" />
      </div>

      <div className="space-y-5">
        {notices.map((notice) => (
          <section key={notice.id} className="space-y-3">
            <NoticeRichEditor
              action={saveNotice}
              heading="공지 수정"
              submitLabel="수정 저장"
              notice={{
                id: notice.id,
                title: notice.title,
                content: sanitizeNoticeHtml(notice.content),
                status: notice.status,
                viewCount: notice.viewCount,
              }}
            />
            <form action={deleteNotice} className="mt-3 text-right">
              <input type="hidden" name="id" value={notice.id} />
              <button className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600">
                삭제
              </button>
            </form>
          </section>
        ))}
      </div>
    </div>
  );
}
