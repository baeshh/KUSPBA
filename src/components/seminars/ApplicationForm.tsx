"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  formatSeminarPrice,
  type SeminarGradeOption,
  type SeminarMemberGrade,
} from "@/lib/seminars";
import { RemainingCapacity } from "@/components/seminars/RemainingCapacity";
import { CancelApplicationButton } from "@/components/seminars/CancelApplicationButton";
import type { PublicAuthUser } from "@/lib/auth-types";

interface ApplicationFormProps {
  seminarId: string;
  fee: string;
  hasFee?: boolean;
  hasGradePrices?: boolean;
  gradeOptions?: SeminarGradeOption[];
  userGradeLabel?: string;
  capacity?: string;
  appliedCount?: number;
  remainingSeats?: number | null;
  capacityLimit?: number | null;
  isFull?: boolean;
  currentUser?: PublicAuthUser | null;
  existingApplicationId?: string | null;
}

export function ApplicationForm({
  seminarId,
  fee,
  hasFee = true,
  hasGradePrices = false,
  gradeOptions = [],
  userGradeLabel = "비협회원",
  capacity = "",
  appliedCount = 0,
  remainingSeats = null,
  capacityLimit = null,
  isFull = false,
  currentUser = null,
  existingApplicationId = null,
}: ApplicationFormProps) {
  const enabledOptions = gradeOptions.filter((option) => option.enabled);
  const userGrade = (currentUser?.grade ?? "BASIC") as SeminarMemberGrade;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [liveAppliedCount, setLiveAppliedCount] = useState(appliedCount);
  const [liveRemainingSeats, setLiveRemainingSeats] = useState(remainingSeats);
  const [liveCapacityLimit, setLiveCapacityLimit] = useState(capacityLimit);
  const [liveIsFull, setLiveIsFull] = useState(isFull);
  const [liveExistingApplicationId, setLiveExistingApplicationId] = useState(existingApplicationId);
  const router = useRouter();

  useEffect(() => {
    setLiveAppliedCount(appliedCount);
    setLiveRemainingSeats(remainingSeats);
    setLiveCapacityLimit(capacityLimit);
    setLiveIsFull(isFull);
    setLiveExistingApplicationId(existingApplicationId);
  }, [appliedCount, remainingSeats, capacityLimit, isFull, existingApplicationId]);

  useEffect(() => {
    let cancelled = false;

    const refreshCapacity = async () => {
      const response = await fetch(`/api/seminars/${seminarId}/capacity`, { cache: "no-store" });
      if (!response.ok || cancelled) return;
      const data = (await response.json()) as {
        appliedCount: number;
        remainingSeats: number | null;
        capacityLimit: number | null;
        isFull: boolean;
        isClosed: boolean;
        existingApplicationId?: string | null;
      };
      if (cancelled) return;
      setLiveAppliedCount(data.appliedCount);
      setLiveRemainingSeats(data.remainingSeats);
      setLiveCapacityLimit(data.capacityLimit);
      setLiveExistingApplicationId(data.existingApplicationId ?? null);
      setLiveIsFull(data.isFull || data.isClosed);
      if ((data.isFull || data.isClosed) && !data.existingApplicationId) {
        router.refresh();
      }
    };

    void refreshCapacity();
    const timer = window.setInterval(() => {
      void refreshCapacity();
    }, 4000);

    return () => {
      cancelled = true;
      window.clearInterval(timer);
    };
  }, [seminarId, router]);

  const selectedOption = enabledOptions.find((option) => option.grade === userGrade);
  const amount = hasGradePrices
    ? selectedOption?.price ?? 0
    : hasFee
      ? Number(fee.replace(/[^0-9]/g, "") || "10000")
      : 0;
  const displayFee = hasGradePrices
    ? formatSeminarPrice(amount)
    : fee;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string) || "";
    const school = (formData.get("school") as string) || "";
    const department = (formData.get("department") as string) || "";
    const affiliation = `${school.trim()} ${department.trim()}`.trim();
    const phone = (formData.get("phone") as string) || "";
    const email = (formData.get("email") as string) || "";
    const depositAmount = amount;

    const response = await fetch("/api/seminar-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        seminarId,
        name,
        school,
        department,
        affiliation,
        phone,
        email,
        depositAmount,
      }),
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string; code?: string } | null;
      if (payload?.code === "PROFILE_REQUIRED") {
        window.location.href = `/profile/setup?next=${encodeURIComponent(`/seminars/${seminarId}`)}`;
        return;
      }
      alert(payload?.error || "신청 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      if (payload?.code === "ALREADY_APPLIED") {
        router.refresh();
      } else if (payload?.code === "FULL" || payload?.code === "CLOSED" || response.status === 409) {
        setLiveIsFull(true);
        router.refresh();
      }
      if (response.status === 401) {
        router.refresh();
      }
      setIsSubmitting(false);
      return;
    }

    const params = new URLSearchParams();
    params.set("name", name);
    if (hasFee) {
      params.set("amount", String(depositAmount));
    }

    router.push(`/seminars/${seminarId}/complete?${params.toString()}`);
  };

  return (
    <aside className="rounded-[24px] border border-black/[0.08] bg-white p-5 shadow-[0_20px_40px_rgba(0,0,0,0.03)] lg:sticky lg:top-[100px] lg:p-8">
      <div className="mb-6 border-b border-black/[0.08] pb-6">
        <h2 className="mb-2 text-xl font-bold">참가 신청서 작성</h2>
        <p className="text-sm text-[#86868B]">정확한 정보를 입력해 주세요.</p>
      </div>

      <RemainingCapacity
        capacity={capacity}
        appliedCount={liveAppliedCount}
        remainingSeats={liveRemainingSeats}
        capacityLimit={liveCapacityLimit}
        isFull={liveIsFull}
      />

      {liveExistingApplicationId ? (
        <div className="rounded-2xl bg-[#E8F0EE] px-5 py-8 text-center">
          <p className="text-lg font-bold text-[#1D1D1F]">이미 신청한 프로그램입니다</p>
          <p className="mt-2 text-sm text-[#86868B]">
            같은 프로그램은 한 번만 신청할 수 있습니다. 취소 후 다시 신청할 수 있습니다.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <a
              href="/mypage"
              className="rounded-full bg-[#1D1D1F] px-4 py-2 text-sm font-semibold text-white"
            >
              내 신청내역 보기
            </a>
            <CancelApplicationButton applicationId={liveExistingApplicationId} />
          </div>
        </div>
      ) : liveIsFull ? (
        <div className="rounded-2xl bg-[#F5F5F7] px-5 py-8 text-center">
          <p className="text-lg font-bold text-[#1D1D1F]">정원이 마감되었습니다</p>
          <p className="mt-2 text-sm text-[#86868B]">잔여 인원이 없어 더 이상 신청할 수 없습니다.</p>
        </div>
      ) : !currentUser ? (
        <div className="rounded-2xl bg-[#F5F5F7] px-5 py-8 text-center">
          <p className="mb-2 text-lg font-bold text-[#1D1D1F]">로그인 후 신청해 주세요</p>
          <p className="mb-6 text-sm leading-relaxed text-[#86868B]">
            카카오 로그인 후에만 프로그램 신청이 가능합니다.
            <br />
            로그인하면 이 페이지로 돌아와 신청서를 작성할 수 있습니다.
          </p>
          <a
            href={`/api/auth/kakao/login?next=${encodeURIComponent(`/seminars/${seminarId}`)}`}
            className="inline-flex items-center justify-center rounded-full bg-[#FEE500] px-5 py-3 text-sm font-semibold text-black transition-colors hover:bg-[#E6CF00]"
          >
            <span className="mr-1.5 font-extrabold">K</span>
            카카오 로그인 후 신청하기
          </a>
        </div>
      ) : !currentUser.profileCompleted ? (
        <div className="rounded-2xl bg-[#F5F5F7] px-5 py-8 text-center">
          <p className="mb-2 text-lg font-bold text-[#1D1D1F]">회원정보를 먼저 입력해 주세요</p>
          <p className="mb-6 text-sm leading-relaxed text-[#86868B]">
            프로그램 신청 전에 이름, 학교, 학과, 학년, 연락처를 한 번만 입력하면 됩니다.
          </p>
          <a
            href={`/profile/setup?next=${encodeURIComponent(`/seminars/${seminarId}`)}`}
            className="inline-flex items-center justify-center rounded-full bg-[#373737] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#222]"
          >
            회원정보 입력하기
          </a>
        </div>
      ) : (
      <form onSubmit={handleSubmit}>
        <p className="mb-5 rounded-xl bg-[#E8F0EE] px-4 py-3 text-sm font-medium text-[#427A72]">
          {currentUser.name}님으로 신청합니다.
        </p>
        <div className="mb-5">
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-semibold text-[#1D1D1F]"
          >
            이름
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="홍길동"
            defaultValue={currentUser.name}
            required
            className="w-full rounded-xl border border-black/[0.08] bg-[#FBFBFD] px-4 py-3.5 text-[15px] text-[#1D1D1F] placeholder-[#A1A1A6] transition-all focus:border-[#427A72] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#427A72]/15"
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="school"
            className="mb-2 block text-sm font-semibold text-[#1D1D1F]"
          >
            학교
          </label>
          <input
            type="text"
            id="school"
            name="school"
            placeholder="예: OO대학교"
            defaultValue={currentUser.school ?? ""}
            required
            className="w-full rounded-xl border border-black/[0.08] bg-[#FBFBFD] px-4 py-3.5 text-[15px] text-[#1D1D1F] placeholder-[#A1A1A6] transition-all focus:border-[#427A72] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#427A72]/15"
          />
        </div>

        <div className="mb-5">
          <label
            htmlFor="department"
            className="mb-2 block text-sm font-semibold text-[#1D1D1F]"
          >
            학과
          </label>
          <input
            type="text"
            id="department"
            name="department"
            placeholder="예: 약학과"
            defaultValue={currentUser.department ?? ""}
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
            defaultValue={currentUser.phone ?? ""}
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
            defaultValue={currentUser.email ?? ""}
            required
            className="w-full rounded-xl border border-black/[0.08] bg-[#FBFBFD] px-4 py-3.5 text-[15px] lowercase text-[#1D1D1F] placeholder-[#A1A1A6] transition-all focus:border-[#427A72] focus:bg-white focus:outline-none focus:ring-4 focus:ring-[#427A72]/15"
          />
        </div>

        <div className="mb-6 rounded-xl bg-[#F5F5F7] px-4 py-3">
          <p className="text-[13px] font-medium text-[#86868B]">적용 회원 등급</p>
          <p className="mt-1 text-[15px] font-bold text-[#1D1D1F]">
            {userGradeLabel}
            {hasFee ? (
              <span className="ml-2 font-semibold text-[#427A72]">({displayFee})</span>
            ) : null}
          </p>
          <p className="mt-2 text-xs text-[#86868B]">
            등급은 마이페이지에서 신청·확인할 수 있습니다.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || liveIsFull}
          className="w-full rounded-xl bg-[#1D1D1F] py-4 text-base font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-black hover:shadow-lg disabled:opacity-70"
        >
          {liveIsFull
            ? "정원이 마감되었습니다"
            : isSubmitting
              ? "제출 중..."
              : liveRemainingSeats !== null
                ? `신청서 제출하기 (잔여 ${liveRemainingSeats}명)`
                : "신청서 제출하기"}
        </button>
      </form>
      )}
    </aside>
  );
}
