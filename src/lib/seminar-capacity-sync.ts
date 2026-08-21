import { Prisma, SeminarStatus } from "@prisma/client";
import { activeApplicationWhere, getSeminarCapacityInfo } from "@/lib/seminars";

export async function syncSeminarCapacity(
  tx: Prisma.TransactionClient,
  seminarId: string,
  capacity: string,
  options?: { previousAppliedCount?: number },
) {
  const seminar = await tx.seminar.findUnique({
    where: { id: seminarId },
    select: { status: true },
  });
  const appliedCount = await tx.seminarApplication.count({
    where: { seminarId, ...activeApplicationWhere },
  });
  const info = getSeminarCapacityInfo(capacity, appliedCount);

  if (info.isFull && seminar?.status === SeminarStatus.RECRUITING) {
    await tx.seminar.update({
      where: { id: seminarId },
      data: { status: SeminarStatus.CLOSED },
    });
  } else if (
    !info.isFull &&
    seminar?.status === SeminarStatus.CLOSED &&
    info.capacityLimit !== null &&
    options?.previousAppliedCount != null &&
    options.previousAppliedCount >= info.capacityLimit
  ) {
    await tx.seminar.update({
      where: { id: seminarId },
      data: { status: SeminarStatus.RECRUITING },
    });
  }

  return info;
}
