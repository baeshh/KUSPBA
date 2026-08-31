import { TermsPageLayout } from "@/components/layout/TermsPageLayout";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata("privacy");

export default function PrivacyPage() {
  return (
    <TermsPageLayout title="개인정보처리방침">
      <p className="mb-4">
        KUSPBA는 회원 가입, 프로그램 신청, 문의 응대를 위해 필요한 최소한의 개인정보만을 수집·이용합니다.
      </p>
      <p>
        개인정보처리방침 전문은 협회 검토 후 이 페이지에 게시됩니다. 문의:{" "}
        <a href="mailto:kuspba@gmail.com" className="font-semibold text-[#427A72] hover:underline">
          kuspba@gmail.com
        </a>
      </p>
    </TermsPageLayout>
  );
}
