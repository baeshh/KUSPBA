import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { loginAdmin } from "../actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await isAdminAuthenticated()) {
    redirect("/admin");
  }

  const { error } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F9FA] px-6">
      <div className="w-full max-w-[420px] rounded-[28px] border border-black/10 bg-white p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)]">
        <p className="mb-2 text-sm font-black text-[#8ABFB2]">KUSPBA Admin</p>
        <h1 className="mb-6 text-[32px] font-black tracking-[-0.04em]">관리자 로그인</h1>
        <form action={loginAdmin} className="space-y-4">
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-bold">
              관리자 비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="ADMIN_PASSWORD"
              className="w-full rounded-xl border border-black/10 bg-[#FBFBFD] px-4 py-3 outline-none focus:border-[#427A72] focus:ring-4 focus:ring-[#427A72]/15"
            />
          </div>
          {error && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">
              비밀번호가 올바르지 않습니다.
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-xl bg-[#1D1D1F] py-3.5 font-bold text-white transition hover:bg-black"
          >
            로그인
          </button>
        </form>
        <p className="mt-5 text-xs leading-relaxed text-[#86868B]">
          로컬 개발 기본 비밀번호는 <code>kuspba-admin</code>입니다. 배포 전에는
          반드시 <code>ADMIN_PASSWORD</code>를 설정하세요.
        </p>
      </div>
    </main>
  );
}
