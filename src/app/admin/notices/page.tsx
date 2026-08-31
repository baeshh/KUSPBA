import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { sanitizeNoticeHtml } from "@/lib/sanitize-notice-html";
import { NoticesAdminClient } from "@/components/admin/NoticesAdminClient";

export default async function AdminNoticesPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  await requireAdmin();
  const { new: newParam } = await searchParams;
  const notices = await prisma.notice.findMany({ orderBy: { createdAt: "desc" } });
  const sorted = [...notices].sort((a, b) => {
    if (a.pinOrder != null && b.pinOrder != null) return a.pinOrder - b.pinOrder;
    if (a.pinOrder != null) return -1;
    if (b.pinOrder != null) return 1;
    return b.createdAt.getTime() - a.createdAt.getTime();
  });

  return (
    <NoticesAdminClient
      autoOpenCreate={newParam === "1"}
      notices={sorted.map((notice) => ({
        id: notice.id,
        title: notice.title,
        content: sanitizeNoticeHtml(notice.content),
        status: notice.status,
        viewCount: notice.viewCount,
        pinOrder: notice.pinOrder,
        createdAtLabel: notice.createdAt.toLocaleDateString("ko-KR"),
      }))}
    />
  );
}
