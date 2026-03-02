import Link from "next/link";

/**
 * REST API 방식 카카오 로그인 버튼
 * /api/auth/kakao/login 으로 이동 → 카카오 인증 페이지 리다이렉트
 * JavaScript SDK/키 불필요, REST API 키만 사용
 */
export function KakaoLoginButton() {
  return (
    <Link
      href="/api/auth/kakao/login"
      className="inline-flex items-center justify-center rounded-full bg-[#FEE500] px-[18px] py-2 text-sm font-semibold text-black transition-colors hover:bg-[#E6CF00]"
    >
      <span className="mr-1.5 font-extrabold">K</span>
      카카오 로그인
    </Link>
  );
}
