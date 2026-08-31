"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GradeGuideModal } from "@/components/auth/GradeGuideModal";
import { formatPhone, normalizeEmail } from "@/lib/format";

type GradeOption = { value: string; label: string };

export function MembershipApplyForm({
  name,
  email,
  phone,
  school,
  department,
  grade,
  gradeOptions,
  gradeLocked,
}: {
  name: string;
  email: string;
  phone: string;
  school: string;
  department: string;
  grade: string;
  gradeOptions: GradeOption[];
  gradeLocked: boolean;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (gradeLocked) return;

    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);

    const response = await fetch("/api/auth/membership", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name"),
        school: formData.get("school"),
        department: formData.get("department"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        requestedGrade: formData.get("requestedGrade"),
      }),
    });

    const data = await response.json().catch(() => ({}));
    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.error || "신청에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    setMessage("회원 등급이 반영되었습니다. 프로그램 참가비에 적용됩니다.");
    router.refresh();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="rounded-[20px] border border-black/8 bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)] md:rounded-[24px] md:p-8"
      >
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="mb-2 text-xl font-black tracking-[-0.03em] text-[#222]">
              회원 등급 신청
            </h2>
            <p className="text-sm leading-relaxed text-[#666]">
              {gradeLocked
                ? "등급 신청이 완료되었습니다. 아래 정보는 확인용으로만 표시됩니다."
                : "본인에게 해당하는 등급을 선택해 주세요. 신청 후에는 변경할 수 없습니다."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="shrink-0 rounded-full border border-[#C1E4D7] bg-[#F7FFFC] px-4 py-2 text-sm font-bold text-[#427A72] transition hover:bg-[#E8F0EE]"
          >
            등급 안내
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-semibold text-[#444]">
            이름
            <input
              name="name"
              required
              minLength={2}
              defaultValue={name}
              readOnly={gradeLocked}
              placeholder="실명을 입력해 주세요"
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm font-medium text-[#222] read-only:bg-[#F5F5F7] read-only:text-[#666]"
            />
          </label>
          <label className="block text-sm font-semibold text-[#444]">
            연락처
            <input
              name="phone"
              required
              defaultValue={phone}
              readOnly={gradeLocked}
              placeholder="010-0000-0000"
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm font-medium text-[#222] read-only:bg-[#F5F5F7] read-only:text-[#666]"
            />
          </label>
          <label className="block text-sm font-semibold text-[#444]">
            학교
            <input
              name="school"
              required
              defaultValue={school}
              readOnly={gradeLocked}
              placeholder="예: OO대학교"
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm font-medium text-[#222] read-only:bg-[#F5F5F7] read-only:text-[#666]"
            />
          </label>
          <label className="block text-sm font-semibold text-[#444]">
            학과
            <input
              name="department"
              required
              defaultValue={department}
              readOnly={gradeLocked}
              placeholder="예: 약학과"
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm font-medium text-[#222] read-only:bg-[#F5F5F7] read-only:text-[#666]"
            />
          </label>
          <label className="block text-sm font-semibold text-[#444]">
            이메일
            <input
              name="email"
              type="email"
              required
              defaultValue={email}
              readOnly={gradeLocked}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm font-medium lowercase text-[#222] read-only:bg-[#F5F5F7] read-only:text-[#666]"
            />
          </label>
          <label className="block text-sm font-semibold text-[#444] md:col-span-2">
            회원 등급
            <select
              name="requestedGrade"
              required
              defaultValue={grade}
              disabled={gradeLocked}
              className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm font-medium text-[#222] disabled:bg-[#F5F5F7] disabled:text-[#666]"
            >
              <option value="">등급 선택</option>
              {gradeOptions.map((gradeOption) => (
                <option key={gradeOption.value} value={gradeOption.value}>
                  {gradeOption.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
        {message && <p className="mt-4 text-sm font-medium text-[#427A72]">{message}</p>}

        {!gradeLocked ? (
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#373737] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#222] disabled:opacity-60"
          >
            {isSubmitting ? "신청 중..." : "신청하기"}
          </button>
        ) : null}
      </form>

      <GradeGuideModal open={guideOpen} onClose={() => setGuideOpen(false)} />
    </>
  );
}
