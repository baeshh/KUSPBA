import type { Metadata } from "next";

export const SITE_NAME = "KUSPBA";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://kuspba.kr";

export type PageSeoKey =
  | "home"
  | "about"
  | "programs"
  | "didimdol"
  | "jobSeminar"
  | "content"
  | "notices"
  | "charter"
  | "privacy"
  | "service";

type PageSeo = {
  title: string;
  description: string;
  keywords: string[];
};

export const PAGE_SEO: Record<PageSeoKey, PageSeo> = {
  home: {
    title: "한국대학생제약바이오협회 | KUSPBA",
    description:
      "한국대학생제약바이오협회 KUSPBA(쿠스피바). 대학생 제약바이오 협회로 직무 세미나, 디딤돌 프로젝트, 대외활동 프로그램을 운영합니다.",
    keywords: [
      "한국대학생제약바이오협회",
      "KUSPBA",
      "쿠스피바",
      "대학생 제약바이오 협회",
    ],
  },
  about: {
    title: "협회 소개 | 제약바이오 동아리 KUSPBA",
    description:
      "제약바이오 동아리를 찾는다면 KUSPBA(쿠스피바). 대학생 제약바이오 동아리·연합동아리로 산업 네트워크와 실무 경험을 연결합니다.",
    keywords: [
      "제약바이오 동아리",
      "쿠스피바",
      "대학생 제약바이오 동아리",
      "제약바이오 연합동아리",
      "KUSPBA 소개",
    ],
  },
  programs: {
    title: "프로그램 | 제약바이오 대외활동 KUSPBA",
    description:
      "제약바이오 대외활동과 직무교육 프로그램. 대학생 제약바이오 대외활동, 디딤돌 프로젝트, 직무 세미나를 한곳에서 확인하세요.",
    keywords: [
      "제약바이오 대외활동",
      "대학생 제약바이오 대외활동",
      "제약바이오 프로그램",
      "제약바이오 직무교육",
    ],
  },
  didimdol: {
    title: "디딤돌 프로젝트 | 제약바이오 디딤돌 프로젝트 KUSPBA",
    description:
      "제약바이오 디딤돌 프로젝트. KUSPBA 디딤돌 프로젝트로 대학생 제약바이오 프로젝트와 실무 역량을 키우세요.",
    keywords: [
      "제약바이오 디딤돌 프로젝트",
      "KUSPBA 디딤돌 프로젝트",
      "대학생 제약바이오 프로젝트",
      "제약바이오 실무 프로젝트",
    ],
  },
  jobSeminar: {
    title: "직무 세미나 | 제약바이오 직무 세미나 KUSPBA",
    description:
      "제약바이오 직무 세미나. KUSPBA 직무 세미나와 대학생 제약바이오 세미나로 직무교육과 취업 준비를 시작하세요.",
    keywords: [
      "제약바이오 직무 세미나",
      "KUSPBA 직무 세미나",
      "대학생 제약바이오 세미나",
      "제약바이오 직무교육",
    ],
  },
  content: {
    title: "직무 MBTI | 제약바이오 직무 KUSPBA",
    description:
      "제약바이오 직무를 탐색하는 KUSPBA 직무 MBTI. 제약바이오 취업, 제약회사 직무, 제약바이오 취업정보를 확인해 보세요.",
    keywords: [
      "제약바이오 직무",
      "제약바이오 취업",
      "제약회사 직무",
      "제약바이오 취업정보",
    ],
  },
  notices: {
    title: "공지사항 | KUSPBA 공지사항",
    description:
      "KUSPBA 공지사항. 제약바이오 대외활동 모집, 프로그램 모집, 프로젝트·현장실습 소식을 확인하세요.",
    keywords: [
      "KUSPBA 공지사항",
      "제약바이오 대외활동 모집",
      "제약바이오 프로그램 모집",
      "KUSPBA 모집 공고",
      "제약바이오 대외활동",
      "제약바이오 프로그램",
      "제약바이오 프로젝트",
      "제약바이오 현장실습",
    ],
  },
  charter: {
    title: "정관 | KUSPBA",
    description: "한국대학생제약바이오산업협회(KUSPBA) 정관.",
    keywords: ["KUSPBA 정관", "한국대학생제약바이오산업협회"],
  },
  privacy: {
    title: "개인정보처리방침 | KUSPBA",
    description: "KUSPBA 개인정보처리방침.",
    keywords: ["KUSPBA 개인정보처리방침"],
  },
  service: {
    title: "이용약관 | KUSPBA",
    description: "KUSPBA 웹사이트 이용약관.",
    keywords: ["KUSPBA 이용약관"],
  },
};

/** 카카오톡·SNS 링크 미리보기용 대표 이미지 (영문+로고)
 *  파일명/버전을 바꾸면 카카오·기기 이미지 캐시를 우회할 수 있습니다. */
export const OG_IMAGE_PATH = "/kuspba-kakao-share.png";
export const OG_IMAGE_VERSION = "20260905b";
export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}?v=${OG_IMAGE_VERSION}`;

const OG_IMAGE = {
  url: OG_IMAGE_URL,
  secureUrl: OG_IMAGE_URL,
  type: "image/png",
  width: 1200,
  height: 630,
  alt: "KUSPBA — Korea University Students Pharmaceutical & Bio Association",
} as const;

export function buildPageMetadata(
  key: PageSeoKey,
  overrides?: Partial<PageSeo>,
): Metadata {
  const seo = { ...PAGE_SEO[key], ...overrides };
  const title = seo.title;
  const description = seo.description;

  return {
    title,
    description,
    keywords: seo.keywords,
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
      url: SITE_URL,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE_URL],
    },
  };
}

export function seminarSeoKey(input: {
  title: string;
  type: string;
}): PageSeoKey {
  const haystack = `${input.title} ${input.type}`.toLowerCase();
  if (haystack.includes("디딤돌")) return "didimdol";
  if (
    haystack.includes("세미나")
    || haystack.includes("직무")
    || input.type === "JOB_SEMINAR"
  ) {
    return "jobSeminar";
  }
  return "programs";
}

export function buildSeminarMetadata(input: {
  title: string;
  type: string;
}): Metadata {
  const key = seminarSeoKey(input);
  const base = PAGE_SEO[key];
  const title = `${input.title} | ${base.title.split(" | ").slice(1).join(" | ") || SITE_NAME}`;
  const description = `${input.title}. ${base.description}`;

  return {
    title,
    description,
    keywords: [...base.keywords, input.title],
    metadataBase: new URL(SITE_URL),
    openGraph: {
      title,
      description,
      siteName: SITE_NAME,
      locale: "ko_KR",
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE_URL],
    },
  };
}
