"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ACADEMIC_YEAR_OPTIONS } from "@/lib/profile";

export function ProfileSetupForm({
  name,
  school,
  department,
  academicYear,
  phone,
  email,
  nextPath,
}: {
  name: string;
  school: string;
  department: string;
  academicYear: string;
  phone: string;
  email: string;
  nextPath: string;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacyCollect, setAgreePrivacyCollect] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!agreeTerms || !agreePrivacyCollect) {
      setError("필수 약관에 모두 동의해 주세요.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/auth/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        school: formData.get("school"),
        department: formData.get("department"),
        academicYear: formData.get("academicYear"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        agreeTerms: true,
        agreePrivacyCollect: true,
      }),
    });

    const data = await response.json().catch(() => ({}));
    setIsSubmitting(false);

    if (!response.ok) {
      setError(
        typeof data.error === "string" && data.error
          ? data.error
          : "회원정보 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.",
      );
      return;
    }

    router.push(nextPath);
    router.refresh();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[20px] border border-black/8 bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)] md:rounded-[24px] md:p-8"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block text-sm font-semibold text-[#444]">
          이름
          <input
            name="name"
            required
            minLength={2}
            defaultValue={name}
            placeholder="실명을 입력해 주세요"
            className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm font-medium text-[#222]"
          />
        </label>
        <label className="block text-sm font-semibold text-[#444]">
          연락처
          <input
            name="phone"
            required
            defaultValue={phone}
            placeholder="010-0000-0000"
            className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm font-medium text-[#222]"
          />
        </label>
        <label className="block text-sm font-semibold text-[#444]">
          학교
          <input
            name="school"
            required
            defaultValue={school}
            placeholder="예: OO대학교"
            className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm font-medium text-[#222]"
          />
        </label>
        <label className="block text-sm font-semibold text-[#444]">
          학과
          <input
            name="department"
            required
            defaultValue={department}
            placeholder="예: 약학과"
            className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm font-medium text-[#222]"
          />
        </label>
        <label className="block text-sm font-semibold text-[#444]">
          학년
          <select
            name="academicYear"
            required
            defaultValue={academicYear}
            className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm font-medium text-[#222]"
          >
            <option value="">학년 선택</option>
            {ACADEMIC_YEAR_OPTIONS.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm font-semibold text-[#444]">
          이메일 (선택)
          <input
            name="email"
            type="email"
            defaultValue={email}
            placeholder="example@email.com"
            className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm font-medium text-[#222]"
          />
        </label>
      </div>

      <div className="mt-8 rounded-2xl border border-black/8 bg-[#F7FFFC] px-4 py-5 md:px-5">
        <p className="mb-4 text-sm font-bold text-[#222]">약관 동의</p>
        <div className="space-y-3">
          <label className="flex items-start gap-3 text-sm leading-relaxed text-[#444]">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(event) => setAgreeTerms(event.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 accent-[#427A72]"
            />
            <span>
              <span className="font-semibold text-[#427A72]">[필수]</span> 홈페이지 이용약관에
              동의합니다.{" "}
              <Link
                href="/terms/service"
                target="_blank"
                className="font-semibold text-[#427A72] underline underline-offset-2 hover:text-[#2D6A4F]"
              >
                (내용 보기)
              </Link>
            </span>
          </label>
          <label className="flex items-start gap-3 text-sm leading-relaxed text-[#444]">
            <input
              type="checkbox"
              checked={agreePrivacyCollect}
              onChange={(event) => setAgreePrivacyCollect(event.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 accent-[#427A72]"
            />
            <span>
              <span className="font-semibold text-[#427A72]">[필수]</span> 회원가입 개인정보 수집
              및 이용 안내를 확인했습니다.{" "}
              <Link
                href="/terms/signup-privacy"
                target="_blank"
                className="font-semibold text-[#427A72] underline underline-offset-2 hover:text-[#2D6A4F]"
              >
                (내용 보기)
              </Link>
            </span>
          </label>
        </div>
        <p className="mt-4 text-sm text-[#666]">
          ·{" "}
          <Link
            href="/terms/privacy"
            target="_blank"
            className="font-semibold text-[#427A72] underline underline-offset-2 hover:text-[#2D6A4F]"
          >
            개인정보처리방침 보기
          </Link>
        </p>
      </div>

      {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isSubmitting || !agreeTerms || !agreePrivacyCollect}
        className="mt-6 inline-flex items-center justify-center rounded-full bg-[#373737] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#222] disabled:opacity-60"
      >
        {isSubmitting ? "저장 중..." : "회원정보 저장하고 계속하기"}
      </button>
    </form>
  );
}
