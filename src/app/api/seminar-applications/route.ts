import { NextRequest, NextResponse } from "next/server";
import { MemberGrade } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

function memberGrade(value: unknown, isMember: boolean) {
  if (!isMember) return MemberGrade.BASIC;
  return Object.values(MemberGrade).includes(value as MemberGrade)
    ? (value as MemberGrade)
    : MemberGrade.REGULAR;
}

function fallbackFeeAmount(fee: string, isMember: boolean, submittedAmount: number) {
  if (isMember) return 0;
  const parsedFee = Number(fee.replace(/[^0-9]/g, ""));
  if (Number.isFinite(parsedFee) && parsedFee > 0) return parsedFee;
  return Number.isFinite(submittedAmount) && submittedAmount > 0 ? Math.floor(submittedAmount) : 0;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const seminarId = String(body.seminarId || "");
    const name = String(body.name || "").trim();
    const affiliation = String(body.affiliation || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const isMember = Boolean(body.isMember);
    const grade = memberGrade(body.memberGrade, isMember);
    const submittedAmount = Number(body.depositAmount || 0);

    if (!seminarId || !name || !affiliation || !phone || !email) {
      return NextResponse.json({ error: "필수 입력값이 누락되었습니다." }, { status: 400 });
    }

    const seminar = await prisma.seminar.findUnique({ where: { id: seminarId } });
    if (!seminar) {
      return NextResponse.json({ error: "프로그램을 찾을 수 없습니다." }, { status: 404 });
    }

    const hasGradePrices = [
      seminar.priceBasic,
      seminar.priceRegular,
      seminar.priceVip,
      seminar.pricePartner,
      seminar.priceSpecial,
    ].some((price) => price > 0);
    const depositAmount = hasGradePrices
      ? {
          BASIC: seminar.priceBasic,
          REGULAR: seminar.priceRegular,
          VIP: seminar.priceVip,
          PARTNER: seminar.pricePartner,
          SPECIAL: seminar.priceSpecial,
        }[grade]
      : fallbackFeeAmount(seminar.fee, isMember, submittedAmount);

    const sessionUser = await getCurrentUser();
    const user = sessionUser
      ? await prisma.user.update({
          where: { id: sessionUser.id },
          data: {
            name,
            phone,
            affiliation,
            email,
            grade: sessionUser.grade === "BASIC" ? grade : sessionUser.grade,
          },
        })
      : await prisma.user.upsert({
          where: { email },
          update: {
            name,
            phone,
            affiliation,
            grade,
          },
          create: {
            name,
            email,
            phone,
            affiliation,
            memberType: "ASSOCIATE",
            grade,
          },
        });

    const application = await prisma.seminarApplication.create({
      data: {
        seminarId,
        userId: user.id,
        name,
        affiliation,
        phone,
        email,
        isMember,
        depositAmount,
        depositStatus: depositAmount === 0 ? "WAIVED" : "PENDING",
      },
    });

    return NextResponse.json({ id: application.id });
  } catch (error) {
    console.error("Create seminar application error:", error);
    return NextResponse.json({ error: "신청 저장에 실패했습니다." }, { status: 500 });
  }
}
