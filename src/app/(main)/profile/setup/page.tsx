import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getSafeAuthRedirect } from "@/lib/auth-redirect";
import { isPlaceholderName } from "@/lib/profile";
import { ProfileSetupForm } from "@/components/auth/ProfileSetupForm";

export const metadata = {
  title: "회원정보 설정 | KUSPBA",
  description: "프로그램 신청과 마이페이지 이용을 위해 회원정보를 입력해 주세요.",
};

export default async function ProfileSetupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const nextPath = getSafeAuthRedirect(next);
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/api/auth/kakao/login?next=${encodeURIComponent(`/profile/setup?next=${encodeURIComponent(nextPath)}`)}`);
  }

  if (user.profileCompleted) {
    redirect(nextPath);
  }

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
        name={isPlaceholderName(user.name) ? "" : user.name}
        school={user.school ?? ""}
        department={user.department ?? ""}
        academicYear={user.academicYear ?? ""}
        phone={user.phone ?? ""}
        email={user.email ?? ""}
        nextPath={nextPath}
      />
    </div>
  );
}
