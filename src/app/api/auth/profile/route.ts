import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  ACADEMIC_YEAR_OPTIONS,
  formatAffiliation,
  isPlaceholderName,
} from "@/lib/profile";

function parseProfileBody(body: Record<string, unknown>) {
  const name = String(body.name || "").trim();
  const school = String(body.school || "").trim();
  const department = String(body.department || "").trim();
  const academicYear = String(body.academicYear || "").trim();
  const phone = String(body.phone || "").trim();
  const email = String(body.email || "").trim();

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

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: parsed.data,
  });

  return NextResponse.json({
    ok: true,
    profileCompleted: updated.profileCompleted,
  });
}
