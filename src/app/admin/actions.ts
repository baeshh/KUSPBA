"use server";

import { DepositStatus, MemberGrade, MemberType, NoticeStatus, SeminarStatus, SeminarType, UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  clearAdminSession,
  requireAdmin,
  setAdminSession,
  validateAdminPassword,
} from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { saveUploadedImage } from "@/lib/server/image-upload";

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

function imageFile(formData: FormData) {
  const file = formData.get("imageFile");
  return file instanceof File && file.size > 0 ? file : null;
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

  const id = text(formData, "id");
  const uploadedImage = imageFile(formData);
  const imageUrl =
    uploadedImage
      ? await saveUploadedImage(uploadedImage, "programs")
      : text(formData, "imageUrl") || DEFAULT_PROGRAM_IMAGE;
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
    description: text(formData, "description"),
    program: text(formData, "program"),
  };

  if (id) {
    await prisma.seminar.update({ where: { id }, data });
  } else {
    await prisma.seminar.create({ data });
  }

  revalidatePath("/admin/seminars");
  revalidatePath("/seminars");
  redirect("/admin/seminars");
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

  await prisma.user.update({
    where: { id },
    data: {
      name: text(formData, "name"),
      email: text(formData, "email") || null,
      phone: text(formData, "phone") || null,
      affiliation: text(formData, "affiliation") || null,
      memberType: enumValue(text(formData, "memberType"), Object.values(MemberType), MemberType.ASSOCIATE),
      grade: enumValue(text(formData, "grade"), Object.values(MemberGrade), MemberGrade.BASIC),
      role: enumValue(text(formData, "role"), Object.values(UserRole), UserRole.USER),
      memo: text(formData, "memo") || null,
    },
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

  await prisma.seminarApplication.update({
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

  revalidatePath("/admin/applications");
}

export async function saveNotice(formData: FormData) {
  await requireAdmin();

  const id = text(formData, "id");
  const data = {
    title: text(formData, "title"),
    content: sanitizeNoticeHtml(text(formData, "content")),
    status: enumValue(text(formData, "status"), Object.values(NoticeStatus), NoticeStatus.PUBLISHED),
  };

  if (id) {
    await prisma.notice.update({ where: { id }, data });
  } else {
    await prisma.notice.create({ data });
  }

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
