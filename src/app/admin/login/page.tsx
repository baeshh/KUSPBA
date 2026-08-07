import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";

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
    <main className="flex min-h-screen items-center justify-center bg-[#F2F4F6] px-6">
      <div className="w-full max-w-[420px] rounded-2xl border border-[#E5E8EB] bg-white p-8 shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
        <p className="mb-2 text-sm font-semibold text-[#2D6A4F]">KUSPBA Admin</p>
        <h1 className="mb-6 text-[28px] font-extrabold tracking-[-0.04em] text-[#191F28]">
          관리자 로그인
        </h1>
        <form action="/api/admin/login" method="post" className="space-y-4">
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-semibold text-[#4E5968]">
              관리자 비밀번호
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              placeholder="ADMIN_PASSWORD"
              className="w-full rounded-md border border-[#E5E8EB] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#2D6A4F]"
            />
          </div>
          {error ? (
            <p className="rounded-md bg-[#FFF1F1] px-4 py-3 text-sm font-semibold text-[#F04452]">
              비밀번호가 올바르지 않습니다.
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full rounded-md bg-[#2D6A4F] py-3.5 text-sm font-semibold text-white transition hover:bg-[#1B4332]"
          >
            로그인
          </button>
        </form>
        <p className="mt-5 text-xs leading-relaxed text-[#8B95A1]">
          로컬 개발 기본 비밀번호는 <code>kuspba-admin</code>입니다. 배포 전에는
          반드시 <code>ADMIN_PASSWORD</code>를 설정하세요.
        </p>
      </div>
    </main>
  );
}
