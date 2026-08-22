import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { getMemberGradeOptions } from "@/lib/member-grades";
import { MembersAdminClient } from "@/components/admin/MembersAdminClient";

export default async function AdminMembersPage() {
  await requireAdmin();
  const [users, gradeOptions] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { applications: true } } },
    }),
    getMemberGradeOptions(),
  ]);

  return (
    <MembersAdminClient
      gradeOptions={gradeOptions}
      users={users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        affiliation: user.affiliation,
        school: user.school,
        department: user.department,
        academicYear: user.academicYear,
        memberType: user.memberType,
        alreadyMember: user.alreadyMember,
        claimedJoinName: user.claimedJoinName,
        claimedJoinSchool: user.claimedJoinSchool,
        claimedJoinDepartment: user.claimedJoinDepartment,
        membershipClaimStatus: user.membershipClaimStatus,
        grade: user.grade,
        requestedGrade: user.requestedGrade,
        role: user.role,
        memo: user.memo,
        profileCompleted: user.profileCompleted,
        applicationCount: user._count.applications,
        createdAtLabel: user.createdAt.toLocaleDateString("ko-KR"),
      }))}
    />
  );
}
