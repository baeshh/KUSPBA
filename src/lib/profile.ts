import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getSafeAuthRedirect } from "@/lib/auth-redirect";

export const PLACEHOLDER_NAMES = new Set(["", "카카오 사용자", "미설정", "회원"]);

export const ACADEMIC_YEAR_OPTIONS = [
  "1학년",
  "2학년",
  "3학년",
  "4학년",
  "5학년",
  "6학년",
  "대학원",
  "기타",
] as const;

export type ProfileFields = {
  name: string;
  phone: string | null;
  school: string | null;
  department: string | null;
  academicYear: string | null;
  affiliation: string | null;
  profileCompleted?: boolean;
};

export function isPlaceholderName(name: string | null | undefined) {
  return PLACEHOLDER_NAMES.has((name ?? "").trim());
}

export function displayName(name: string | null | undefined) {
  const trimmed = (name ?? "").trim();
  return trimmed && !isPlaceholderName(trimmed) ? trimmed : "회원";
}

export function formatAffiliation(school: string, department: string) {
  return `${school.trim()} ${department.trim()}`.trim();
}

export function hasRequiredProfileFields(user: ProfileFields) {
  const nameOk = !isPlaceholderName(user.name);
  const phoneOk = Boolean(user.phone?.trim());
  const schoolAndDept = Boolean(user.school?.trim() && user.department?.trim());
  const affiliationOk = Boolean(user.affiliation?.trim());
  const yearOk = Boolean(user.academicYear?.trim());

  if (schoolAndDept && nameOk && phoneOk && yearOk) return true;
  // 기존 회원: 학교/학과/학년이 분리 저장되지 않아도 이름·연락처·소속이 있으면 완료로 본다.
  return nameOk && phoneOk && affiliationOk;
}

export function profileSetupUrl(nextPath?: string | null) {
  const next = getSafeAuthRedirect(nextPath);
  return `/profile/setup?next=${encodeURIComponent(next)}`;
}

export async function requireCompletedProfile(nextPath: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/api/auth/kakao/login?next=${encodeURIComponent(nextPath)}`);
  }
  if (!user.profileCompleted) {
    redirect(profileSetupUrl(nextPath));
  }
  return user;
}
