import { TermsPageLayout } from "@/components/layout/TermsPageLayout";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata("charter");

export default function CharterPage() {
  return (
    <TermsPageLayout title="정관">
      <p className="mb-4">
        한국대학생제약바이오산업협회(KUSPBA) 정관 전문은 협회 사무국을 통해 확인하실 수 있습니다.
      </p>
      <p>
        정관 원문이 준비되는 대로 이 페이지에 게시됩니다. 문의:{" "}
        <a href="mailto:kuspba@gmail.com" className="font-semibold text-[#427A72] hover:underline">
          kuspba@gmail.com
        </a>
      </p>
    </TermsPageLayout>
  );
}
