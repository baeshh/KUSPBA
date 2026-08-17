import { NextRequest, NextResponse } from "next/server";
import { MemberGrade, MemberType } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { MEMBER_SELECTABLE_GRADES } from "@/lib/member-grades";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const affiliation = String(body.affiliation || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || user.email || "").trim();
  const requestedGrade = body.requestedGrade as MemberGrade;
  const memberType = Object.values(MemberType).includes(body.memberType)
    ? (body.memberType as MemberType)
    : MemberType.ASSOCIATE;

  if (!affiliation || !phone || !email) {
    return NextResponse.json({ error: "소속, 연락처, 이메일을 모두 입력해 주세요." }, { status: 400 });
  }

  if (!MEMBER_SELECTABLE_GRADES.includes(requestedGrade as (typeof MEMBER_SELECTABLE_GRADES)[number])) {
    return NextResponse.json({ error: "신청할 회원 등급을 선택해 주세요." }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: {
      affiliation,
      phone,
      email,
      memberType,
      requestedGrade,
      gradeRequestedAt: new Date(),
    },
  });

  return NextResponse.json({
    ok: true,
    requestedGrade: updated.requestedGrade,
  });
}
