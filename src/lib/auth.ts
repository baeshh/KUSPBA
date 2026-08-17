import { cookies } from "next/headers";
import { prisma } from "@/lib/db";

export async function getSessionKakaoId() {
  const jar = await cookies();
  return jar.get("kakao_user")?.value ?? null;
}

export async function getCurrentUser() {
  const kakaoId = await getSessionKakaoId();
  if (!kakaoId) return null;
  return prisma.user.findUnique({ where: { kakaoId } });
}
