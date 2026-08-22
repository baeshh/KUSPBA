import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { MemberGrade } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { syncSeminarCapacity } from "@/lib/seminar-capacity-sync";
import { findActiveUserApplication } from "@/lib/seminar-applications";
import { formatAffiliation } from "@/lib/profile";
import { buildSeminarGradeOptions, hasSeminarGradePrices } from "@/lib/seminars";

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

class ApplicationError extends Error {
  constructor(
    public status: number,
    message: string,
    public code?: string,
  ) {
    super(message);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const seminarId = String(body.seminarId || "");
    const name = String(body.name || "").trim();
    const school = String(body.school || "").trim();
    const department = String(body.department || "").trim();
    const affiliation = formatAffiliation(school, department) || String(body.affiliation || "").trim();
    const phone = String(body.phone || "").trim();
    const email = String(body.email || "").trim();
    const isMember = Boolean(body.isMember);
    const grade = memberGrade(body.memberGrade, isMember);
    const submittedAmount = Number(body.depositAmount || 0);

    if (!seminarId || !name || !affiliation || !phone || !email) {
      return NextResponse.json({ error: "필수 입력값이 누락되었습니다." }, { status: 400 });
    }

    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: "로그인 후 신청해 주세요." }, { status: 401 });
    }
    if (!sessionUser.profileCompleted) {
      return NextResponse.json(
        { error: "회원정보 설정 후 신청할 수 있습니다.", code: "PROFILE_REQUIRED" },
        { status: 403 },
      );
    }

    const application = await prisma.$transaction(async (tx) => {
      const seminar = await tx.seminar.findUnique({ where: { id: seminarId } });
      if (!seminar) {
        throw new ApplicationError(404, "프로그램을 찾을 수 없습니다.");
      }
      if (seminar.status !== "RECRUITING") {
        throw new ApplicationError(409, "신청이 마감된 프로그램입니다.", "CLOSED");
      }

      const existing = await findActiveUserApplication(tx, seminarId, sessionUser);
      if (existing) {
        throw new ApplicationError(409, "이미 신청한 프로그램입니다. 취소 후 다시 신청할 수 있습니다.", "ALREADY_APPLIED");
      }

      const before = await syncSeminarCapacity(tx, seminarId, seminar.capacity);
      if (before.isFull) {
        throw new ApplicationError(409, "정원이 마감되어 신청할 수 없습니다.", "FULL");
      }

      const prices = {
        priceBasic: seminar.priceBasic,
        priceRegular: seminar.priceRegular,
        priceVip: seminar.priceVip,
        pricePartner: seminar.pricePartner,
        priceSpecial: seminar.priceSpecial,
      };
      const gradeOptions = buildSeminarGradeOptions(prices, {}, seminar.gradeConfig);
      const selectedGrade = gradeOptions.find((option) => option.grade === grade && option.enabled);
      if (!selectedGrade) {
        throw new ApplicationError(400, "선택할 수 없는 회원 등급입니다.");
      }
      const hasGradePrices = hasSeminarGradePrices(prices, seminar.gradeConfig);
      const depositAmount = hasGradePrices
        ? selectedGrade.price
        : fallbackFeeAmount(seminar.fee, isMember, submittedAmount);

      const user = await tx.user.update({
        where: { id: sessionUser.id },
        data: {
          name,
          phone,
          school: school || undefined,
          department: department || undefined,
          affiliation,
          email,
          grade: sessionUser.grade === "BASIC" ? grade : sessionUser.grade,
        },
      });

      const created = await tx.seminarApplication.create({
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

      const after = await syncSeminarCapacity(tx, seminarId, seminar.capacity);
      if (after.capacityLimit !== null && after.appliedCount > after.capacityLimit) {
        throw new ApplicationError(409, "정원이 마감되어 신청할 수 없습니다.", "FULL");
      }

      return created;
    });

    revalidatePath("/seminars");
    revalidatePath(`/seminars/${seminarId}`);
    revalidatePath("/mypage");

    return NextResponse.json({ id: application.id });
  } catch (error) {
    if (error instanceof ApplicationError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: error.status },
      );
    }
    console.error("Create seminar application error:", error);
    return NextResponse.json({ error: "신청 저장에 실패했습니다." }, { status: 500 });
  }
}
