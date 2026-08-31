import { redirect } from "next/navigation";
import { JOB_MBTI_URL } from "@/lib/site";
import { buildPageMetadata } from "@/lib/seo";

export const metadata = buildPageMetadata("content");

export default function JobMbtiPage() {
  redirect(JOB_MBTI_URL);
}
