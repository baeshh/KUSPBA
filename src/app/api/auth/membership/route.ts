import { NextRequest, NextResponse } from "next/server";
import { MemberGrade, MembershipClaimStatus } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { MEMBER_SELECTABLE_GRADES } from "@/lib/member-grades";
import { formatAffiliation, isPlaceholderName } from "@/lib/profile";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }
  if (!user.profileCompleted) {
    return NextResponse.json(
      { error: "회원정보 설정 후 이용할 수 있습니다.", code: "PROFILE_REQUIRED" },
      { status: 403 },
    );
  }

  const body = await request.json().catch(() => ({}));
  const name = String(body.name || user.name || "").trim();
  const school = String(body.school || user.school || "").trim();
  const department = String(body.department || user.department || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || user.email || "").trim();
  const requestedGrade = body.requestedGrade as MemberGrade;
  const alreadyMember = Boolean(body.alreadyMember);
  const affiliation = formatAffiliation(school, department);

  if (isPlaceholderName(name) || name.length < 2) {
    return NextResponse.json({ error: "이름을 입력해 주세요." }, { status: 400 });
  }
  if (!school || !department || !phone || !email) {
    return NextResponse.json({ error: "학교, 학과, 연락처, 이메일을 모두 입력해 주세요." }, { status: 400 });
  }

  if (!MEMBER_SELECTABLE_GRADES.includes(requestedGrade as (typeof MEMBER_SELECTABLE_GRADES)[number])) {
    return NextResponse.json({ error: "신청할 회원 등급을 선택해 주세요." }, { status: 400 });
  }

  const claimedJoinName = alreadyMember ? name : null;
  const claimedJoinSchool = alreadyMember ? school : null;
  const claimedJoinDepartment = alreadyMember ? department : null;

  const claimUnchanged =
    user.alreadyMember &&
    user.claimedJoinName === claimedJoinName &&
    user.claimedJoinSchool === claimedJoinSchool &&
    user.claimedJoinDepartment === claimedJoinDepartment;

  const membershipClaimStatus = alreadyMember
    ? claimUnchanged && user.membershipClaimStatus === MembershipClaimStatus.VERIFIED
      ? MembershipClaimStatus.VERIFIED
      : MembershipClaimStatus.PENDING
    : MembershipClaimStatus.NONE;

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      name,
      school,
      department,
      affiliation,
      phone,
      email,
      requestedGrade,
      gradeRequestedAt: new Date(),
      alreadyMember,
      claimedJoinName,
      claimedJoinSchool,
      claimedJoinDepartment,
      membershipClaimStatus,
    },
  });

  return NextResponse.json({
    ok: true,
    requestedGrade: updated.requestedGrade,
    membershipClaimStatus: updated.membershipClaimStatus,
  });
}
