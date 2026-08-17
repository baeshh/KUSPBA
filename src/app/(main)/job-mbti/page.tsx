import { redirect } from "next/navigation";
import { JOB_MBTI_URL } from "@/lib/site";

export default function JobMbtiPage() {
  redirect(JOB_MBTI_URL);
}
