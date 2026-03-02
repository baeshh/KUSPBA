"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ApplicationFormProps {
  seminarId: string;
  fee: string;
  hasFee?: boolean;
}

export function ApplicationForm({ seminarId, fee, hasFee = true }: ApplicationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string) || "";
    const isMember = formData.get("isMember") === "yes";

    // TODO: API 연동
    await new Promise((r) => setTimeout(r, 500));

    const params = new URLSearchParams();
    params.set("name", name);
    if (hasFee && !isMember) {
      const amount = fee.replace(/[^0-9]/g, "") || "10000";
      params.set("amount", amount);
    } else if (hasFee && isMember) {
      params.set("amount", "0");
    }

    router.push(`/seminars/${seminarId}/complete?${params.toString()}`);
  };

  return (
    <aside className="sticky top-[100px] rounded-[24px] border border-black/[0.08] bg-white p-8 shadow-[0_20px_40px_rgba(0,0,0,0.03)]">
      <div className="mb-6 border-b border-black/[0.08] pb-6">
        <h2 className="mb-2 text-xl font-bold">참가 신청서 작성</h2>
        <p className="text-sm text-[#86868B]">정확한 정보를 입력해 주세요.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-semibold text-[#1D1D1F]"
          >
            이름 (입금자명)
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="홍길동"
            required
            className="w-full rounded-xl border border-black/[0.08] bg-[#FBFBFD] px-4 py-3.5 text-[15px] text-[#1D1D1F] placeholder-[#A1A1A6] transition-all focus:border-[#427A72] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#427A72]/15"
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="affiliation"
            className="mb-2 block text-sm font-semibold text-[#1D1D1F]"
          >
            소속 (학교/학과)
          </label>
          <input
            type="text"
            id="affiliation"
            name="affiliation"
            placeholder="한국대학교 제약공학과"
            required
            className="w-full rounded-xl border border-black/[0.08] bg-[#FBFBFD] px-4 py-3.5 text-[15px] text-[#1D1D1F] placeholder-[#A1A1A6] transition-all focus:border-[#427A72] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#427A72]/15"
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-semibold text-[#1D1D1F]"
          >
            연락처
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            placeholder="010-0000-0000"
            required
            className="w-full rounded-xl border border-black/[0.08] bg-[#FBFBFD] px-4 py-3.5 text-[15px] text-[#1D1D1F] placeholder-[#A1A1A6] transition-all focus:border-[#427A72] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#427A72]/15"
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-semibold text-[#1D1D1F]"
          >
            이메일
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="example@email.com"
            required
            className="w-full rounded-xl border border-black/[0.08] bg-[#FBFBFD] px-4 py-3.5 text-[15px] text-[#1D1D1F] placeholder-[#A1A1A6] transition-all focus:border-[#427A72] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#427A72]/15"
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-sm font-semibold text-[#1D1D1F]">
            협회원 여부
          </label>
          <div className="flex gap-4">
            <label className="flex cursor-pointer items-center gap-2 text-[15px]">
              <input
                type="radio"
                name="isMember"
                value="yes"
                required
                className="h-[18px] w-[18px] accent-[#427A72]"
              />
              협회원 (무료)
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-[15px]">
              <input
                type="radio"
                name="isMember"
                value="no"
                className="h-[18px] w-[18px] accent-[#427A72]"
              />
              일반 ({fee})
            </label>
          </div>
        </div>

        {hasFee && (
        <div className="mb-6 rounded-xl bg-[#E8F0EE] p-4">
          <p className="mb-1 text-[13px] font-medium text-[#427A72]">
            무통장 입금 계좌 ({fee})
          </p>
          <div className="text-[15px] font-bold text-[#1D1D1F]">
            국민은행 123456-00-123456
            <br />
            (예금주: 한국대학생제약바이오산업협회)
          </div>
          <p className="mt-2 text-xs font-normal text-[#86868B]">
            * 폼 제출 후 입금이 확인되어야 최종 신청이 완료됩니다.
            <br />
            * 입금자명과 신청자명이 동일해야 확인이 가능합니다.
          </p>
        </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-[#1D1D1F] py-4 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-black hover:shadow-lg disabled:opacity-70"
        >
          {isSubmitting ? "제출 중..." : "신청서 제출하기"}
        </button>
      </form>
    </aside>
  );
}
