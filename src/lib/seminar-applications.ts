import { Prisma, PrismaClient } from "@prisma/client";
import { activeApplicationWhere } from "@/lib/seminars";

export function activeUserApplicationWhere(seminarId: string, user: { id: string; email: string | null }) {
  return {
    seminarId,
    ...activeApplicationWhere,
    OR: [
      { userId: user.id },
      ...(user.email ? [{ email: user.email }] : []),
    ],
  } satisfies Prisma.SeminarApplicationWhereInput;
}

export async function findActiveUserApplication(
  db: Prisma.TransactionClient | PrismaClient,
  seminarId: string,
  user: { id: string; email: string | null },
) {
  return db.seminarApplication.findFirst({
    where: activeUserApplicationWhere(seminarId, user),
    orderBy: { createdAt: "desc" },
  });
}
