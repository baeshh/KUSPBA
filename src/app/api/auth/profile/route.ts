import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ensureUserSchema } from "@/lib/ensure-user-schema";
import {
  ACADEMIC_YEAR_OPTIONS,
  formatAffiliation,
  isPlaceholderName,
} from "@/lib/profile";
import { formatPhone, normalizeEmail } from "@/lib/format";

function parseProfileBody(body: Record<string, unknown>) {
  const name = String(body.name || "").trim();
  const school = String(body.school || "").trim();
  const department = String(body.department || "").trim();
  const academicYear = String(body.academicYear || "").trim();
  const phone = formatPhone(String(body.phone || "").trim());
  const emailRaw = String(body.email || "").trim();
  const email = emailRaw ? normalizeEmail(emailRaw) : "";
  const agreeTerms = body.agreeTerms === true;
  const agreePrivacyCollect = body.agreePrivacyCollect === true;

  if (isPlaceholderName(name) || name.length < 2) {
    return { error: "이름을 입력해 주세요." };
  }
  if (!school) {
    return { error: "학교를 입력해 주세요." };
  }
  if (!department) {
    return { error: "학과를 입력해 주세요." };
  }
  if (!ACADEMIC_YEAR_OPTIONS.includes(academicYear as (typeof ACADEMIC_YEAR_OPTIONS)[number])) {
    return { error: "학년을 선택해 주세요." };
  }
  if (!phone) {
    return { error: "연락처를 입력해 주세요." };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "이메일 형식이 올바르지 않습니다." };
  }
  if (!agreeTerms || !agreePrivacyCollect) {
    return { error: "필수 약관에 모두 동의해 주세요." };
  }

  const agreedAt = new Date();

  return {
    data: {
      name,
      school,
      department,
      academicYear,
      phone,
      email: email || null,
      affiliation: formatAffiliation(school, department),
      profileCompleted: true,
      termsAgreedAt: agreedAt,
      privacyCollectAgreedAt: agreedAt,
    },
  };
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      school: user.school,
      department: user.department,
      academicYear: user.academicYear,
      affiliation: user.affiliation,
      profileCompleted: user.profileCompleted,
    },
  });
}

export async function PUT(request: NextRequest) {
  try {
    await ensureUserSchema(prisma);

    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
    }

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ error: "잘못된 요청입니다." }, { status: 400 });
    }

    const parsed = parseProfileBody(body);
    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    if (parsed.data.email) {
      const emailTaken = await prisma.user.findFirst({
        where: {
          email: parsed.data.email,
          NOT: { id: user.id },
        },
        select: { id: true },
      });
      if (emailTaken) {
        return NextResponse.json(
          { error: "이미 사용 중인 이메일입니다. 다른 이메일을 입력하거나 비워 주세요." },
          { status: 409 },
        );
      }
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: parsed.data,
    });

    return NextResponse.json({
      ok: true,
      profileCompleted: updated.profileCompleted,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json(
        { error: "이미 사용 중인 이메일입니다. 다른 이메일을 입력하거나 비워 주세요." },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "회원정보 저장에 실패했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 },
    );
  }
}
