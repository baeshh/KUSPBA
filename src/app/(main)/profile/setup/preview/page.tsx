import { ProfileSetupForm } from "@/components/auth/ProfileSetupForm";

export const metadata = {
  title: "회원정보 설정 미리보기 | KUSPBA",
  description: "첫 가입 후 회원정보·약관 동의 화면 미리보기",
};

/** 로그인/프로필 완료 여부와 무관하게 UI 확인용 미리보기 */
export default function ProfileSetupPreviewPage() {
  return (
    <div className="mx-auto max-w-[720px] px-4 pb-16 pt-[calc(var(--header-offset)+20px)] sm:px-6 md:pb-24 md:pt-[120px]">
      <p className="mb-2 text-sm font-bold text-[#8ABFB2]">Profile Setup</p>
      <h1 className="mb-2 break-keep text-[26px] font-black tracking-[-0.03em] text-[#222] md:text-[36px]">
        회원정보를 입력해 주세요
      </h1>
      <p className="mb-10 text-[#666]">
        카카오 계정은 로그인 인증에만 사용됩니다. 이름, 학교, 학과, 학년, 연락처는 최초 1회만 직접 입력하면 됩니다.
      </p>
      <ProfileSetupForm
        name=""
        school=""
        department=""
        academicYear=""
        phone=""
        email=""
        nextPath="/"
      />
    </div>
  );
}
