export type SeminarStatus = "recruiting" | "closed" | "ended";

export type SeminarType =
  | "직무 세미나"
  | "네트워킹"
  | "실무 프로젝트"
  | "공모전";

export interface SeminarDetail {
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
  description: string[];
  program: string[];
}

// TODO: API/DB 연동 시 교체
export const MOCK_SEMINARS: SeminarDetail[] = [
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
    capacity: "선착순 30명",
    fee: "무료",
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
    description: ["제약 R&D 직무 특강이 마감되었습니다."],
    program: [],
  },
];

export function getSeminarById(id: string): SeminarDetail | undefined {
  return MOCK_SEMINARS.find((s) => s.id === id);
}
