import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { getMemberGradeOptions } from "@/lib/member-grades";
import { SeminarsAdminClient } from "@/components/admin/SeminarsAdminClient";
import { getSeminarCapacityInfo } from "@/lib/seminars";

export default async function AdminSeminarsPage() {
  await requireAdmin();
  const [seminars, gradeOptions] = await Promise.all([
    prisma.seminar.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: {
            applications: {
              where: { depositStatus: { not: "CANCELLED" } },
            },
          },
        },
      },
    }),
    getMemberGradeOptions(),
  ]);

  return (
    <SeminarsAdminClient
      gradeOptions={gradeOptions}
      seminars={seminars.map((seminar) => {
        const capacityInfo = getSeminarCapacityInfo(seminar.capacity, seminar._count.applications);
        return {
        id: seminar.id,
        title: seminar.title,
        applicationPeriod: seminar.applicationPeriod,
        imageUrl: seminar.imageUrl,
        eventDate: seminar.eventDate,
        location: seminar.location,
        capacity: seminar.capacity,
        fee: seminar.fee,
        priceBasic: seminar.priceBasic,
        priceRegular: seminar.priceRegular,
        priceVip: seminar.priceVip,
        pricePartner: seminar.pricePartner,
        priceSpecial: seminar.priceSpecial,
        status: seminar.status,
        type: seminar.type,
        description: seminar.description,
        program: seminar.program,
        applicationCount: seminar._count.applications,
        remainingSeats: capacityInfo.remainingSeats,
        capacityLimit: capacityInfo.capacityLimit,
      };
      })}
    />
  );
}
