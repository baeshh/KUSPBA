import { TermsPageLayout } from "@/components/layout/TermsPageLayout";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata("service");

export default function ServiceTermsPage() {
  return (
    <TermsPageLayout title="이용약관">
      <p className="mb-4">
        KUSPBA 웹사이트 및 프로그램 이용과 관련한 약관 전문은 협회 검토 후 이 페이지에 게시됩니다.
      </p>
      <p>
        이용약관 관련 문의:{" "}
        <a href="mailto:kuspba@gmail.com" className="font-semibold text-[#427A72] hover:underline">
          kuspba@gmail.com
        </a>
      </p>
    </TermsPageLayout>
  );
}
