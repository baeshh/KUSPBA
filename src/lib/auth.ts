import { cookies } from "next/headers";
import { prisma } from "@/lib/db";
import type { PublicAuthUser } from "@/lib/auth-types";

export type { PublicAuthUser };

export async function getSessionKakaoId() {
  const jar = await cookies();
  return jar.get("kakao_user")?.value ?? null;
}

export async function getCurrentUser() {
  const kakaoId = await getSessionKakaoId();
  if (!kakaoId) return null;
  return prisma.user.findUnique({ where: { kakaoId } });
}

export function toPublicAuthUser(user: {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  affiliation: string | null;
  school: string | null;
  department: string | null;
  academicYear: string | null;
  profileCompleted: boolean;
}): PublicAuthUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    affiliation: user.affiliation,
    school: user.school,
    department: user.department,
    academicYear: user.academicYear,
    profileCompleted: user.profileCompleted,
  };
}
