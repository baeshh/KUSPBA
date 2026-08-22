export type SeminarStatus = "recruiting" | "closed" | "ended";

export type SeminarType =
  | "직무 세미나"
  | "네트워킹"
  | "실무 프로젝트"
  | "공모전";

export type SeminarMemberGrade = "BASIC" | "REGULAR" | "VIP" | "PARTNER" | "SPECIAL";

export const SEMINAR_GRADE_LABELS: Record<SeminarMemberGrade, string> = {
  BASIC: "BASIC",
  REGULAR: "REGULAR",
  VIP: "VIP",
  PARTNER: "파트너단과대(경희대 생대)",
  SPECIAL: "SPECIAL",
};

export const SEMINAR_MEMBER_GRADES = Object.keys(SEMINAR_GRADE_LABELS) as SeminarMemberGrade[];

export interface SeminarPrices {
  priceBasic: number;
  priceRegular: number;
  priceVip: number;
  pricePartner: number;
  priceSpecial: number;
}

export interface SeminarCapacityInfo {
  appliedCount: number;
  capacityLimit: number | null;
  remainingSeats: number | null;
  isFull: boolean;
}

export interface SeminarDetail extends SeminarCapacityInfo {
  id: string;
  title: string;
  status: SeminarStatus;
  type: SeminarType;
  applicationPeriod: string;
  imageUrl: string;
  eventDate: string;
  location: string;
  capacity: string;
  fee: string;
  prices: SeminarPrices;
  description: string[];
  program: string[];
  gradeConfig?: string;
  acceptingApplications?: boolean;
}

/** 취소되지 않은 신청만 정원에 포함합니다. */
export const activeApplicationWhere = {
  depositStatus: { not: "CANCELLED" as const },
};

export const seminarActiveApplicationCountInclude = {
  include: {
    _count: {
      select: {
        applications: {
          where: activeApplicationWhere,
        },
      },
    },
  },
} as const;

export function parseCapacityLimit(capacity: string): number | null {
  const match = capacity.replace(/,/g, "").match(/(\d+)/);
  if (!match) return null;
  const n = Number(match[1]);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function getSeminarCapacityInfo(capacity: string, appliedCount: number): SeminarCapacityInfo {
  const capacityLimit = parseCapacityLimit(capacity);
  if (capacityLimit === null) {
    return {
      appliedCount,
      capacityLimit: null,
      remainingSeats: null,
      isFull: false,
    };
  }

  const remainingSeats = Math.max(0, capacityLimit - appliedCount);
  return {
    appliedCount,
    capacityLimit,
    remainingSeats,
    isFull: remainingSeats <= 0,
  };
}

export function getSeminarPriceByGrade(prices: SeminarPrices, grade: SeminarMemberGrade) {
  return {
    BASIC: prices.priceBasic,
    REGULAR: prices.priceRegular,
    VIP: prices.priceVip,
    PARTNER: prices.pricePartner,
    SPECIAL: prices.priceSpecial,
  }[grade];
}

export function formatSeminarPrice(amount: number) {
  if (!Number.isFinite(amount) || amount <= 0) return "무료";
  return `${amount.toLocaleString("ko-KR")}원`;
}

export function hasSeminarGradePrices(prices: SeminarPrices, rawConfig?: string | null) {
  return buildSeminarGradeOptions(prices, {}, rawConfig).some((option) => option.enabled && option.price > 0);
}

export type SeminarGradeOption = {
  grade: SeminarMemberGrade;
  label: string;
  price: number;
  enabled: boolean;
};

export function parseSeminarGradeConfig(raw: string | null | undefined): SeminarGradeOption[] {
  if (!raw?.trim()) return [];
  try {
    const parsed = JSON.parse(raw) as SeminarGradeOption[];
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (item) =>
          item &&
          SEMINAR_MEMBER_GRADES.includes(item.grade) &&
          typeof item.label === "string",
      )
      .map((item) => ({
        grade: item.grade,
        label: item.label,
        price: Number.isFinite(Number(item.price)) ? Number(item.price) : 0,
        enabled: item.enabled !== false,
      }));
  } catch {
    return [];
  }
}

export function buildSeminarGradeOptions(
  prices: SeminarPrices,
  labels: Partial<Record<SeminarMemberGrade, string>> = {},
  rawConfig?: string | null,
): SeminarGradeOption[] {
  const fromConfig = parseSeminarGradeConfig(rawConfig);
  return SEMINAR_MEMBER_GRADES.map((grade) => {
    const saved = fromConfig.find((item) => item.grade === grade);
    return {
      grade,
      label: saved?.label?.trim() || labels[grade] || SEMINAR_GRADE_LABELS[grade],
      price: Number.isFinite(saved?.price) ? Number(saved?.price) : getSeminarPriceByGrade(prices, grade),
      enabled: saved?.enabled ?? true,
    };
  });
}

type SeminarSeed = Omit<SeminarDetail, keyof SeminarCapacityInfo>;

// TODO: API/DB 연동 시 교체
const MOCK_SEMINAR_DATA: SeminarSeed[] = [
  {
    id: "1",
    title: "2026 상반기 제약/바이오 직무 탐색 세미나",
    status: "recruiting",
    type: "직무 세미나",
    applicationPeriod: "2026.03.10 - 03.25",
    imageUrl:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000",
    eventDate: "2026년 4월 10일 (금) 14:00 - 17:00",
    location: "서울 강남구 코엑스 컨퍼런스룸 301호",
    capacity: "선착순 50명",
    fee: "10,000원 (협회원 무료)",
    prices: {
      priceBasic: 10000,
      priceRegular: 0,
      priceVip: 0,
      pricePartner: 0,
      priceSpecial: 0,
    },
    description: [
      "제약바이오 산업과 접점이 적은 대학생들이 현업의 생생한 지식을 얻고, 자신이 산업과 잘 맞는지 체험해 볼 수 있는 직무 탐색 세미나입니다.",
      "현직 전문가들의 강연과 질의응답을 통해 진입장벽을 낮추고, 타 대학 학생들과 교류할 수 있는 소중한 네트워킹 시간을 제공합니다.",
    ],
    program: [
      "14:00 - 14:50 : 제약/바이오 산업 트렌드 및 직무 소개 (R&D, QA/QC, RA 등)",
      "15:00 - 15:50 : 현직자가 들려주는 생생한 커리어 패스",
      "16:00 - 17:00 : 소그룹 다대일 멘토링 및 네트워킹",
    ],
  },
  {
    id: "2",
    title: "[일대일 멘토링] 현직자와 함께하는 진로 설계",
    status: "recruiting",
    type: "네트워킹",
    applicationPeriod: "2026.03.15 - 03.30",
    imageUrl:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=1000",
    eventDate: "2026년 4월 중 (별도 안내)",
    location: "온라인 (줌)",
    capacity: "선착순 50명",
    fee: "무료",
    prices: {
      priceBasic: 0,
      priceRegular: 0,
      priceVip: 0,
      pricePartner: 0,
      priceSpecial: 0,
    },
    description: [
      "현직 제약/바이오 인사와 1:1 멘토링을 진행합니다.",
      "진로 고민, 이력서 피드백, 면접 준비 등 개인 맞춤 조언을 받을 수 있습니다.",
    ],
    program: ["1:1 멘토링 (30분)", "이력서/자기소개서 피드백"],
  },
  {
    id: "3",
    title: "기업 연계 실전 프로젝트 1기",
    status: "ended",
    type: "실무 프로젝트",
    applicationPeriod: "2026.01.01 - 01.31",
    imageUrl:
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1000",
    eventDate: "2026년 2월 ~ 3월",
    location: "협약기업 본사 및 온라인",
    capacity: "15명",
    fee: "무료",
    prices: {
      priceBasic: 0,
      priceRegular: 0,
      priceVip: 0,
      pricePartner: 0,
      priceSpecial: 0,
    },
    description: ["기업 연계 프로젝트 1기 모집이 마감되었습니다."],
    program: [],
  },
  {
    id: "4",
    title: "2025 KUSPBA 제약바이오 산업 해커톤",
    status: "ended",
    type: "공모전",
    applicationPeriod: "2025.11.01 - 11.20",
    imageUrl:
      "https://images.unsplash.com/photo-1582719478250-c894090bdcb1?auto=format&fit=crop&q=80&w=800",
    eventDate: "2025년 12월",
    location: "서울",
    capacity: "80명",
    fee: "무료",
    prices: {
      priceBasic: 0,
      priceRegular: 0,
      priceVip: 0,
      pricePartner: 0,
      priceSpecial: 0,
    },
    description: ["2025 KUSPBA 제약바이오 산업 해커톤이 마감되었습니다."],
    program: [],
  },
  {
    id: "5",
    title: "제약 R&D 직무 특강 (온라인)",
    status: "ended",
    type: "직무 세미나",
    applicationPeriod: "2025.09.10 - 09.25",
    imageUrl:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800",
    eventDate: "2025년 9월",
    location: "온라인",
    capacity: "100명",
    fee: "무료",
    prices: {
      priceBasic: 0,
      priceRegular: 0,
      priceVip: 0,
      pricePartner: 0,
      priceSpecial: 0,
    },
    description: ["제약 R&D 직무 특강이 마감되었습니다."],
    program: [],
  },
];

export const MOCK_SEMINARS: SeminarDetail[] = MOCK_SEMINAR_DATA.map((seminar) => ({
  ...seminar,
  ...getSeminarCapacityInfo(seminar.capacity, 0),
}));

export function getSeminarById(id: string): SeminarDetail | undefined {
  return MOCK_SEMINARS.find((s) => s.id === id);
}

export function toDbSeminarStatus(status: SeminarStatus) {
  return {
    recruiting: "RECRUITING",
    closed: "CLOSED",
    ended: "ENDED",
  }[status] as "RECRUITING" | "CLOSED" | "ENDED";
}

export function fromDbSeminarStatus(status: string): SeminarStatus {
  return {
    RECRUITING: "recruiting",
    CLOSED: "closed",
    ENDED: "ended",
  }[status] as SeminarStatus;
}

export function toDbSeminarType(type: SeminarType) {
  return {
    "직무 세미나": "JOB_SEMINAR",
    네트워킹: "NETWORKING",
    "실무 프로젝트": "PRACTICAL_PROJECT",
    공모전: "COMPETITION",
  }[type] as "JOB_SEMINAR" | "NETWORKING" | "PRACTICAL_PROJECT" | "COMPETITION";
}

export function fromDbSeminarType(type: string): SeminarType {
  return {
    JOB_SEMINAR: "직무 세미나",
    NETWORKING: "네트워킹",
    PRACTICAL_PROJECT: "실무 프로젝트",
    COMPETITION: "공모전",
  }[type] as SeminarType;
}

export function serializeSeminarList(items: Array<{
  id: string;
  title: string;
  status: string;
  type: string;
  applicationPeriod: string;
  imageUrl: string;
  eventDate: string;
  location: string;
  capacity: string;
  fee: string;
  priceBasic: number;
  priceRegular: number;
  priceVip: number;
  pricePartner: number;
  priceSpecial?: number;
  description: string;
  program: string;
  gradeConfig?: string;
  acceptingApplications?: boolean;
  appliedCount?: number;
  _count?: { applications: number };
}>): SeminarDetail[] {
  return items.map((item) => {
    const appliedCount = item.appliedCount ?? item._count?.applications ?? 0;
    return {
      id: item.id,
      title: item.title,
      status: fromDbSeminarStatus(item.status),
      type: fromDbSeminarType(item.type),
      applicationPeriod: item.applicationPeriod,
      imageUrl: item.imageUrl,
      eventDate: item.eventDate,
      location: item.location,
      capacity: item.capacity,
      fee: item.fee,
      prices: {
        priceBasic: item.priceBasic,
        priceRegular: item.priceRegular,
        priceVip: item.priceVip,
        pricePartner: item.pricePartner,
        priceSpecial: item.priceSpecial ?? 0,
      },
      description: item.description.split(/\r?\n/),
      program: item.program.split(/\r?\n/),
      gradeConfig: item.gradeConfig ?? "",
      acceptingApplications: Boolean(item.acceptingApplications),
      ...getSeminarCapacityInfo(item.capacity, appliedCount),
    };
  });
}
