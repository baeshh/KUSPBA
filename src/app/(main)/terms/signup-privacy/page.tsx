import { TermsPageLayout } from "@/components/layout/TermsPageLayout";
import { TermsBody } from "@/components/layout/TermsBody";
import { buildPageMetadata } from "@/lib/seo";
import { BODY, TITLE } from "@/lib/terms/signup-privacy";

export const metadata = buildPageMetadata("signupPrivacy");

export default function SignupPrivacyPage() {
  return (
    <TermsPageLayout title={TITLE}>
      <TermsBody text={BODY} />
    </TermsPageLayout>
  );
}
