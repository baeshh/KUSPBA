import { PrismaClient } from "@prisma/client";
import {
  MOCK_SEMINARS,
  toDbSeminarStatus,
  toDbSeminarType,
} from "../src/lib/seminars";

const prisma = new PrismaClient();

async function main() {
  for (const seminar of MOCK_SEMINARS) {
    await prisma.seminar.upsert({
      where: { id: seminar.id },
      update: {},
      create: {
        id: seminar.id,
        title: seminar.title,
        status: toDbSeminarStatus(seminar.status),
        type: toDbSeminarType(seminar.type),
        applicationPeriod: seminar.applicationPeriod,
        imageUrl: seminar.imageUrl,
        eventDate: seminar.eventDate,
        location: seminar.location,
        capacity: seminar.capacity,
        fee: seminar.fee,
        priceBasic: seminar.prices.priceBasic,
        priceRegular: seminar.prices.priceRegular,
        priceVip: seminar.prices.priceVip,
        pricePartner: seminar.prices.pricePartner,
        priceSpecial: seminar.prices.priceSpecial,
        description: seminar.description.join("\n"),
        program: seminar.program.join("\n"),
      },
    });
  }

  const { ensureMemberGradeSettings } = await import("../src/lib/member-grades");
  await ensureMemberGradeSettings();

  const { hasRequiredProfileFields } = await import("../src/lib/profile");
  const incompleteUsers = await prisma.user.findMany({
    where: { profileCompleted: false },
  });
  for (const user of incompleteUsers) {
    if (hasRequiredProfileFields(user)) {
      await prisma.user.update({
        where: { id: user.id },
        data: { profileCompleted: true },
      });
    }
  }

  const admin = await prisma.user.upsert({
    where: { email: "admin@kuspba.org" },
    update: { role: "ADMIN" },
    create: {
      name: "KUSPBA 관리자",
      email: "admin@kuspba.org",
      affiliation: "KUSPBA 운영진",
      memberType: "ASSOCIATE",
      grade: "VIP",
      role: "ADMIN",
      profileCompleted: true,
    },
  });

  const sampleMember = await prisma.user.upsert({
    where: { email: "member@example.com" },
    update: {},
    create: {
      name: "홍길동",
      email: "member@example.com",
      phone: "010-0000-0000",
      affiliation: "한국대학교 제약공학과",
      school: "한국대학교",
      department: "제약공학과",
      academicYear: "4학년",
      memberType: "ASSOCIATE",
      grade: "REGULAR",
      role: "USER",
      profileCompleted: true,
    },
  });

  const firstSeminar = await prisma.seminar.findFirst({
    where: { status: "RECRUITING" },
  });

  if (firstSeminar) {
    await prisma.seminarApplication.upsert({
      where: { id: "sample-application-1" },
      update: {},
      create: {
        id: "sample-application-1",
        seminarId: firstSeminar.id,
        userId: sampleMember.id,
        name: sampleMember.name,
        affiliation: sampleMember.affiliation ?? "",
        phone: sampleMember.phone ?? "",
        email: sampleMember.email ?? "",
        isMember: true,
        depositAmount: 0,
        depositStatus: "WAIVED",
        memo: "샘플 협회원 신청",
      },
    });
  }

  await prisma.notice.upsert({
    where: { id: "welcome-notice" },
    update: {},
    create: {
      id: "welcome-notice",
      title: "KUSPBA 홈페이지가 새롭게 열렸습니다",
      content:
        "KUSPBA의 프로그램, 공지사항, 협회원 소식을 이곳에서 확인하실 수 있습니다.",
      status: "PUBLISHED",
    },
  });

  console.log(`Seed complete. Admin user: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
