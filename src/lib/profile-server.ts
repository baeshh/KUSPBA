import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { profileSetupUrl } from "@/lib/profile";

export async function requireCompletedProfile(nextPath: string) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/api/auth/kakao/login?next=${encodeURIComponent(nextPath)}`);
  }
  if (!user.profileCompleted) {
    redirect(profileSetupUrl(nextPath));
  }
  return user;
}
