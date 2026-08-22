import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { ensureUserSchemaOnce } from "@/lib/ensure-user-schema";
import { getMemberGradeLabels } from "@/lib/member-grades";
import { ApplicationsAdminClient } from "@/components/admin/ApplicationsAdminClient";

export default async function AdminApplicationsPage() {
  await requireAdmin();
  await ensureUserSchemaOnce(prisma);
  const [applications, gradeLabels] = await Promise.all([
    prisma.seminarApplication.findMany({
      orderBy: { createdAt: "desc" },
      include: { seminar: true, user: true },
    }),
    getMemberGradeLabels(),
  ]);

  return (
    <ApplicationsAdminClient
      applications={applications.map((application) => {
        const gradeKey = application.isMember
          ? (application.user?.grade ?? "REGULAR")
          : "BASIC";
        return {
          id: application.id,
          name: application.name,
          email: application.email,
          phone: application.phone,
          affiliation: application.affiliation,
          seminarTitle: application.seminar.title,
          depositAmount: application.depositAmount,
          depositStatus: application.depositStatus,
          memo: application.memo,
          isMember: application.isMember,
          gradeKey,
          gradeLabel: gradeLabels[gradeKey] ?? gradeKey,
        };
      })}
    />
  );
}
