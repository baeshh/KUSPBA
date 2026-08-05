import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { sanitizeNoticeHtml } from "@/lib/sanitize-notice-html";
import { NoticesAdminClient } from "@/components/admin/NoticesAdminClient";

export default async function AdminNoticesPage() {
  await requireAdmin();
  const notices = await prisma.notice.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <NoticesAdminClient
      notices={notices.map((notice) => ({
        id: notice.id,
        title: notice.title,
        content: sanitizeNoticeHtml(notice.content),
        status: notice.status,
        viewCount: notice.viewCount,
        createdAtLabel: notice.createdAt.toLocaleDateString("ko-KR"),
      }))}
    />
  );
}
