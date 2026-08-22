"use server";

import { DepositStatus, MemberGrade, MembershipClaimStatus, MemberType, NoticeStatus, SeminarStatus, SeminarType, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  requireAdmin,
  setAdminSession,
  validateAdminPassword,
} from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { syncSeminarCapacity } from "@/lib/seminar-capacity-sync";
import { activeApplicationWhere } from "@/lib/seminars";
import { formatAffiliation, hasRequiredProfileFields } from "@/lib/profile";
import { GRADE_PRICE_FIELD, MEMBER_GRADE_KEYS } from "@/lib/member-grade-constants";

const DEFAULT_PROGRAM_IMAGE =
  "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000";
import { sanitizeNoticeHtml } from "@/lib/sanitize-notice-html";

function text(formData: FormData, key: string) {
  return String(formData.get(key) || "").trim();
}

function enumValue<T extends string>(value: string, allowed: readonly T[], fallback: T) {
  return allowed.includes(value as T) ? (value as T) : fallback;
}

function price(formData: FormData, key: string) {
  const value = Number(text(formData, key).replace(/,/g, ""));
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : 0;
}

const NOTICE_PIN_ORDERS = [1, 2, 3, 4, 5] as const;

function pinOrder(formData: FormData) {
  const value = Number(text(formData, "pinOrder"));
  return NOTICE_PIN_ORDERS.includes(value as (typeof NOTICE_PIN_ORDERS)[number]) ? value : null;
}

function isNextRedirectError(error: unknown) {
  return (
    typeof error === "object"
    && error !== null
    && "digest" in error
    && typeof (error as { digest?: unknown }).digest === "string"
    && String((error as { digest: string }).digest).startsWith("NEXT_REDIRECT")
  );
}

export async function loginAdmin(formData: FormData) {
  const password = text(formData, "password");
  if (!validateAdminPassword(password)) {
    redirect("/admin/login?error=1");
  }

  await setAdminSession();
  redirect("/admin");
}

export async function logoutAdmin() {
  await clearAdminSession();
  redirect("/admin/login");
}

export async function saveSeminar(formData: FormData) {
  await requireAdmin();

  try {
    const id = text(formData, "id");
    // 이미지는 클라이언트에서 /api/admin/programs/upload 로 먼저 올린다.
    // 서버 액션 파일 첨부는 배포 환경에서 본문 크기/권한 오류를 유발할 수 있어 사용하지 않는다.
    const imageUrl = text(formData, "imageUrl") || DEFAULT_PROGRAM_IMAGE;
    const { ensureSeminarSchema } = await import("@/lib/ensure-user-schema");
    await ensureSeminarSchema(prisma);

    const gradeConfig = JSON.stringify(
      MEMBER_GRADE_KEYS.map((grade) => ({
        grade,
        label: text(formData, `gradeLabel_${grade}`) || grade,
        price: price(formData, GRADE_PRICE_FIELD[grade]),
        enabled: formData.get(`gradeEnabled_${grade}`) === "on",
      })),
    );

    const data = {
      title: text(formData, "title"),
      status: enumValue(text(formData, "status"), Object.values(SeminarStatus), SeminarStatus.RECRUITING),
      type: enumValue(text(formData, "type"), Object.values(SeminarType), SeminarType.JOB_SEMINAR),
      applicationPeriod: text(formData, "applicationPeriod"),
      imageUrl,
      eventDate: text(formData, "eventDate"),
      location: text(formData, "location"),
      capacity: text(formData, "capacity"),
      fee: text(formData, "fee"),
      priceBasic: price(formData, "priceBasic"),
      priceRegular: price(formData, "priceRegular"),
      priceVip: price(formData, "priceVip"),
      pricePartner: price(formData, "pricePartner"),
      priceSpecial: price(formData, "priceSpecial"),
      gradeConfig,
      acceptingApplications: formData.get("acceptingApplications") === "on",
      applicationNotice: text(formData, "applicationNotice"),
      applicationQrUrl: text(formData, "applicationQrUrl"),
      description: text(formData, "description"),
      program: text(formData, "program"),
    };

    if (!data.title || !data.applicationPeriod || !data.eventDate || !data.location || !data.capacity || !data.description) {
      redirect("/admin/seminars?error=required");
    }

    const seminar = id
      ? await prisma.seminar.update({ where: { id }, data })
      : await prisma.seminar.create({ data });

    await prisma.$transaction((tx) => syncSeminarCapacity(tx, seminar.id, seminar.capacity));

    revalidatePath("/admin/seminars");
    revalidatePath("/seminars");
    revalidatePath(`/seminars/${seminar.id}`);
    redirect("/admin/seminars");
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    console.error("saveSeminar failed:", error);
    redirect("/admin/seminars?error=save");
  }
}

export async function deleteSeminar(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (id) {
    await prisma.seminar.delete({ where: { id } });
  }

  revalidatePath("/admin/seminars");
  revalidatePath("/seminars");
}

export async function updateUser(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;

  const name = text(formData, "name");
  const school = text(formData, "school") || null;
  const department = text(formData, "department") || null;
  const academicYear = text(formData, "academicYear") || null;
  const phone = text(formData, "phone") || null;
  const affiliation =
    text(formData, "affiliation") ||
    (school && department ? formatAffiliation(school, department) : school || department || null);
  const profileData = {
    name,
    email: text(formData, "email") || null,
    phone,
    school,
    department,
    academicYear,
    affiliation,
    memberType: enumValue(text(formData, "memberType"), Object.values(MemberType), MemberType.ASSOCIATE),
    grade: enumValue(text(formData, "grade"), Object.values(MemberGrade), MemberGrade.BASIC),
    role: enumValue(text(formData, "role"), Object.values(UserRole), UserRole.USER),
    memo: text(formData, "memo") || null,
    profileCompleted: hasRequiredProfileFields({
      name,
      phone,
      school,
      department,
      academicYear,
      affiliation,
    }),
  };

  await prisma.user.update({
    where: { id },
    data: profileData,
  });

  revalidatePath("/admin/members");
}

export async function updateMemberGradeLabels(formData: FormData) {
  await requireAdmin();
  const { ensureMemberGradeSettings, MEMBER_GRADE_KEYS } = await import("@/lib/member-grades");
  await ensureMemberGradeSettings();

  for (const grade of MEMBER_GRADE_KEYS) {
    const label = text(formData, `label_${grade}`) || grade;
    await prisma.memberGradeSetting.update({
      where: { grade },
      data: { label },
    });
  }

  revalidatePath("/admin/members");
  revalidatePath("/admin/seminars");
  revalidatePath("/seminars");
}

export async function reviewMembershipClaim(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;

  const status = enumValue(
    text(formData, "membershipClaimStatus"),
    Object.values(MembershipClaimStatus),
    MembershipClaimStatus.PENDING,
  );
  if (status !== MembershipClaimStatus.VERIFIED && status !== MembershipClaimStatus.REJECTED) {
    return;
  }

  await prisma.user.update({
    where: { id },
    data: { membershipClaimStatus: status },
  });

  revalidatePath("/admin/members");
  revalidatePath("/mypage");
}

export async function deleteUser(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (id) {
    await prisma.user.delete({ where: { id } });
  }
  revalidatePath("/admin/members");
}

export async function updateApplication(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;

  const application = await prisma.$transaction(async (tx) => {
    const current = await tx.seminarApplication.findUnique({
      where: { id },
      include: { seminar: { select: { capacity: true } } },
    });
    if (!current) return null;

    const previousAppliedCount = await tx.seminarApplication.count({
      where: { seminarId: current.seminarId, ...activeApplicationWhere },
    });

    const updated = await tx.seminarApplication.update({
      where: { id },
      data: {
        depositStatus: enumValue(
          text(formData, "depositStatus"),
          Object.values(DepositStatus),
          DepositStatus.PENDING,
        ),
        memo: text(formData, "memo") || null,
      },
    });

    await syncSeminarCapacity(tx, current.seminarId, current.seminar.capacity, {
      previousAppliedCount,
    });

    return updated;
  });

  if (!application) return;

  revalidatePath("/admin/applications");
  revalidatePath("/seminars");
  revalidatePath(`/seminars/${application.seminarId}`);
  revalidatePath("/mypage");
}

export async function cancelApplicationByAdmin(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (!id) return;

  const application = await prisma.$transaction(async (tx) => {
    const current = await tx.seminarApplication.findUnique({
      where: { id },
      include: { seminar: { select: { capacity: true } } },
    });
    if (!current || current.depositStatus === DepositStatus.CANCELLED) return null;

    const previousAppliedCount = await tx.seminarApplication.count({
      where: { seminarId: current.seminarId, ...activeApplicationWhere },
    });

    const updated = await tx.seminarApplication.update({
      where: { id },
      data: { depositStatus: DepositStatus.CANCELLED },
    });

    await syncSeminarCapacity(tx, current.seminarId, current.seminar.capacity, {
      previousAppliedCount,
    });

    return updated;
  });

  if (!application) return;

  revalidatePath("/admin/applications");
  revalidatePath("/seminars");
  revalidatePath(`/seminars/${application.seminarId}`);
  revalidatePath("/mypage");
}

export async function saveNotice(formData: FormData) {
  await requireAdmin();

  const id = text(formData, "id");
  const nextPinOrder = pinOrder(formData);
  const data = {
    title: text(formData, "title"),
    content: sanitizeNoticeHtml(text(formData, "content")),
    status: enumValue(text(formData, "status"), Object.values(NoticeStatus), NoticeStatus.PUBLISHED),
    pinOrder: nextPinOrder,
  };

  await prisma.$transaction(async (tx) => {
    if (nextPinOrder !== null) {
      await tx.notice.updateMany({
        where: {
          pinOrder: nextPinOrder,
          ...(id ? { id: { not: id } } : {}),
        },
        data: { pinOrder: null },
      });
    }

    if (id) {
      await tx.notice.update({ where: { id }, data });
    } else {
      await tx.notice.create({ data });
    }
  });

  revalidatePath("/admin/notices");
  revalidatePath("/notices");
  if (id) revalidatePath(`/notices/${id}`);
  redirect("/admin/notices");
}

export async function deleteNotice(formData: FormData) {
  await requireAdmin();
  const id = text(formData, "id");
  if (id) {
    await prisma.notice.delete({ where: { id } });
  }

  revalidatePath("/admin/notices");
  revalidatePath("/notices");
}
