import { MemberGrade } from "@prisma/client";
import { prisma } from "@/lib/db";
import {
  DEFAULT_GRADE_LABELS,
  DEFAULT_GRADE_ORDER,
  MEMBER_GRADE_KEYS,
  type MemberGradeKey,
} from "@/lib/member-grade-constants";

export {
  DEFAULT_GRADE_LABELS,
  DEFAULT_GRADE_ORDER,
  GRADE_PRICE_FIELD,
  MEMBER_GRADE_KEYS,
  MEMBER_SELECTABLE_GRADES,
  type MemberGradeKey,
} from "@/lib/member-grade-constants";

export async function ensureMemberGradeSettings() {
  await Promise.all(
    MEMBER_GRADE_KEYS.map((grade) =>
      prisma.memberGradeSetting.upsert({
        where: { grade: grade as MemberGrade },
        update: {},
        create: {
          grade: grade as MemberGrade,
          label: DEFAULT_GRADE_LABELS[grade],
          sortOrder: DEFAULT_GRADE_ORDER[grade],
        },
      }),
    ),
  );

  await prisma.memberGradeSetting.updateMany({
    where: {
      grade: MemberGrade.PARTNER,
      label: { in: ["PARTNER", "협력학과/단과대", "협력학과", "파트너단과대(경희대 생대)"] },
    },
    data: { label: DEFAULT_GRADE_LABELS.PARTNER },
  });

  for (const grade of MEMBER_GRADE_KEYS) {
    await prisma.memberGradeSetting.updateMany({
      where: {
        grade: grade as MemberGrade,
        label: { in: ["BASIC", "REGULAR", "VIP", "SPECIAL", "PARTNER"] },
      },
      data: { label: DEFAULT_GRADE_LABELS[grade] },
    });
  }
}

export async function getMemberGradeLabels() {
  await ensureMemberGradeSettings();
  const rows = await prisma.memberGradeSetting.findMany({
    orderBy: { sortOrder: "asc" },
  });

  const labels = { ...DEFAULT_GRADE_LABELS };
  for (const row of rows) {
    labels[row.grade as MemberGradeKey] = row.label || DEFAULT_GRADE_LABELS[row.grade as MemberGradeKey];
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
