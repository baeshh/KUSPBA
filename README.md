# KUSPBA | 한국대학생제약바이오산업협회

세미나/교육 프로그램 신청, 협회원 관리, 무통장 입금 확인을 위한 웹 플랫폼입니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Font**: Pretendard Variable

## 프로젝트 구조

```
src/
├── app/
│   ├── (main)/              # 메인 사이트 (Header, Footer 포함)
│   │   ├── layout.tsx
│   │   ├── page.tsx         # 홈 (/)
│   │   └── seminars/
│   │       ├── page.tsx     # 세미나 목록 (/seminars)
│   │       └── [id]/
│   │           └── page.tsx # 세미나 상세 (/seminars/:id)
│   ├── admin/               # 관리자 페이지 (추후)
│   ├── api/                 # API 라우트 (추후)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── layout/
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   └── seminars/
│       └── ProgramCard.tsx
├── lib/
│   └── utils.ts
└── types/
    └── index.ts
```

## 시작하기

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

[http://localhost:3000](http://localhost:3000)에서 확인할 수 있습니다.

## 환경 변수

`.env.example`을 참고하여 `.env` 파일을 생성하세요.

## 배포 (GitHub Actions + Vercel)

`main` 브랜치에 push하면 자동으로 Vercel에 배포됩니다.

### 1. Vercel 프로젝트 연결

```bash
cd /Users/baesh/Desktop/KUSPBA
npx vercel
```

프롬프트에 따라 로그인 후 프로젝트를 생성/연결하면 `.vercel` 폴더가 생깁니다.  
`.vercel/project.json`에서 `orgId`, `projectId` 값을 확인하세요.

### 2. GitHub Secrets 설정

저장소 Settings → Secrets and variables → Actions에서 다음 시크릿을 추가하세요:

| Name | Description |
|------|-------------|
| `VERCEL_TOKEN` | [Vercel Dashboard](https://vercel.com/account/tokens) → Create Token |
| `VERCEL_ORG_ID` | `.vercel/project.json`의 orgId |
| `VERCEL_PROJECT_ID` | `.vercel/project.json`의 projectId |

### 3. 배포

`main` 브랜치에 push하면 프로덕션 배포, PR 생성 시 프리뷰 배포가 됩니다.

## 개발 일정 (예시)

- 1주차: 디자인 + 구조 설계 ✅
- 2주차: 프론트 개발
- 3주차: 관리자 + DB 구축
- 4주차: 테스트 및 수정
