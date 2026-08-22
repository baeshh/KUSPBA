import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { activeApplicationWhere, getSeminarCapacityInfo } from "@/lib/seminars";
import { findActiveUserApplication } from "@/lib/seminar-applications";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const seminar = await prisma.seminar.findUnique({
    where: { id },
    select: { capacity: true, status: true, acceptingApplications: true },
  });

  if (!seminar) {
    return NextResponse.json({ error: "프로그램을 찾을 수 없습니다." }, { status: 404 });
  }

  const user = await getCurrentUser();
  const [appliedCount, existingApplication] = await Promise.all([
    prisma.seminarApplication.count({
      where: { seminarId: id, ...activeApplicationWhere },
    }),
    user ? findActiveUserApplication(prisma, id, user) : Promise.resolve(null),
  ]);
  const info = getSeminarCapacityInfo(seminar.capacity, appliedCount);

  return NextResponse.json({
    ...info,
    status: seminar.status,
    isClosed: seminar.status !== "RECRUITING" || !seminar.acceptingApplications || info.isFull,
    existingApplicationId: existingApplication?.id ?? null,
  });
}
