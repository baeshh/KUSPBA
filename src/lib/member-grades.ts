import { MemberGrade } from "@prisma/client";
import { prisma } from "@/lib/db";

export const MEMBER_GRADE_KEYS = [
  MemberGrade.BASIC,
  MemberGrade.REGULAR,
  MemberGrade.VIP,
  MemberGrade.PARTNER,
  MemberGrade.SPECIAL,
] as const;

export type MemberGradeKey = (typeof MEMBER_GRADE_KEYS)[number];

export const DEFAULT_GRADE_LABELS: Record<MemberGradeKey, string> = {
  BASIC: "BASIC",
  REGULAR: "REGULAR",
  VIP: "VIP",
  PARTNER: "PARTNER",
  SPECIAL: "SPECIAL",
};

export const DEFAULT_GRADE_ORDER: Record<MemberGradeKey, number> = {
  BASIC: 1,
  REGULAR: 2,
  VIP: 3,
  PARTNER: 4,
  SPECIAL: 5,
};

export async function ensureMemberGradeSettings() {
  await Promise.all(
    MEMBER_GRADE_KEYS.map((grade) =>
      prisma.memberGradeSetting.upsert({
        where: { grade },
        update: {},
        create: {
          grade,
          label: DEFAULT_GRADE_LABELS[grade],
          sortOrder: DEFAULT_GRADE_ORDER[grade],
        },
      }),
    ),
  );
}

export async function getMemberGradeLabels() {
  await ensureMemberGradeSettings();
  const rows = await prisma.memberGradeSetting.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const labels = { ...DEFAULT_GRADE_LABELS };
  for (const row of rows) {
    labels[row.grade] = row.label || DEFAULT_GRADE_LABELS[row.grade];
  }
  return labels;
}

export async function getMemberGradeOptions() {
  const labels = await getMemberGradeLabels();
  return MEMBER_GRADE_KEYS.map((grade) => ({
    value: grade,
    label: labels[grade],
  }));
}

export const GRADE_PRICE_FIELD: Record<MemberGradeKey, string> = {
  BASIC: "priceBasic",
  REGULAR: "priceRegular",
  VIP: "priceVip",
  PARTNER: "pricePartner",
  SPECIAL: "priceSpecial",
};

export const MEMBER_SELECTABLE_GRADES = MEMBER_GRADE_KEYS.filter(
  (grade) => grade !== MemberGrade.BASIC,
);
