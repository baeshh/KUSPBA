import { TermsPageLayout } from "@/components/layout/TermsPageLayout";
import { TermsBody } from "@/components/layout/TermsBody";
import { buildPageMetadata } from "@/lib/seo";
import { BODY, TITLE } from "@/lib/terms/service";

export const metadata = buildPageMetadata("service", {
  title: `${TITLE} | KUSPBA`,
  description: "한국대학생제약바이오산업협회(KUSPBA) 홈페이지 이용약관.",
});

export default function ServiceTermsPage() {
  return (
    <TermsPageLayout title={TITLE}>
      <TermsBody text={BODY} />
    </TermsPageLayout>
  );
}
