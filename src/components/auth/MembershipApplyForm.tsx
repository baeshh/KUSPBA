"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MEMBERSHIP_FORM_URL } from "@/lib/site";

type GradeOption = { value: string; label: string };

export function MembershipApplyForm({
  name,
  email,
  phone,
  school,
  department,
  alreadyMember,
  membershipClaimStatus,
  requestedGrade,
  gradeOptions,
  alreadyRequested,
}: {
  name: string;
  email: string;
  phone: string;
  school: string;
  department: string;
  alreadyMember: boolean;
  membershipClaimStatus: string;
  requestedGrade: string;
  gradeOptions: GradeOption[];
  alreadyRequested: boolean;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [joined, setJoined] = useState(alreadyMember ? "yes" : alreadyRequested ? "no" : "");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setMessage(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const joinName = String(formData.get("name") || "").trim();
    const joinSchool = String(formData.get("school") || "").trim();
    const joinDepartment = String(formData.get("department") || "").trim();

    const response = await fetch("/api/auth/membership", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: joinName,
        school: joinSchool,
        department: joinDepartment,
        phone: formData.get("phone"),
        email: formData.get("email"),
        requestedGrade: formData.get("requestedGrade"),
        alreadyMember: formData.get("alreadyMember") === "yes",
        claimedJoinName: joinName,
        claimedJoinSchool: joinSchool,
        claimedJoinDepartment: joinDepartment,
      }),
    });

    const data = await response.json().catch(() => ({}));
    setIsSubmitting(false);

    if (!response.ok) {
      setError(data.error || "신청에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    setMessage("회원 등급 신청이 접수되었습니다. 관리자 확인 후 등급이 반영됩니다.");
    router.refresh();
  };

  const claimStatusLabel =
    membershipClaimStatus === "PENDING"
      ? "기존 회원 여부는 관리자 확인 중입니다."
      : membershipClaimStatus === "VERIFIED"
        ? "기존 회원 정보가 확인되었습니다."
        : membershipClaimStatus === "REJECTED"
          ? "기존 회원 정보가 확인되지 않았습니다. 이름·학교·학과를 다시 입력해 주세요."
          : null;

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[20px] border border-black/8 bg-white p-5 shadow-[0_12px_30px_rgba(0,0,0,0.04)] md:rounded-[24px] md:p-8"
    >
      <h2 className="mb-2 text-xl font-black tracking-[-0.03em] text-[#222]">
        {alreadyRequested ? "회원 등급 신청 수정" : "회원 등급 신청"}
      </h2>
      <p className="mb-6 text-sm leading-relaxed text-[#666]">
        이름·학교·학과는 프로필과 같은 항목입니다. 이미 공식 가입을 완료했다면 예로 선택한 뒤 같은 정보를 제출하면 관리자가 확인합니다.
      </p>

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
          이메일
          <input
            name="email"
            type="email"
            required
            defaultValue={email}
            className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm font-medium text-[#222]"
          />
        </label>
        <label className="block text-sm font-semibold text-[#444]">
          이미 회원으로 가입하셨나요?
          <select
            name="alreadyMember"
            required
            value={joined}
            onChange={(event) => setJoined(event.target.value)}
            className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm font-medium text-[#222]"
          >
            <option value="">선택</option>
            <option value="yes">예</option>
            <option value="no">아니오</option>
          </select>
        </label>
        <label className="block text-sm font-semibold text-[#444] md:col-span-2">
          신청 회원 등급
          <select
            name="requestedGrade"
            required
            defaultValue={requestedGrade}
            className="mt-1.5 w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm font-medium text-[#222]"
          >
            <option value="">등급 선택</option>
            {gradeOptions.map((grade) => (
              <option key={grade.value} value={grade.value}>
                {grade.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {joined === "yes" ? (
        <p className="mt-4 text-sm text-[#666]">
          위에 입력한 이름·학교·학과가 기존 회원 확인용으로 관리자에게 전달됩니다.
        </p>
      ) : null}

      {claimStatusLabel ? (
        <p className="mt-4 text-sm font-medium text-[#427A72]">{claimStatusLabel}</p>
      ) : null}
      {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}
      {message && <p className="mt-4 text-sm font-medium text-[#427A72]">{message}</p>}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-full bg-[#373737] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#222] disabled:opacity-60"
        >
          {isSubmitting ? "신청 중..." : alreadyRequested ? "신청 내용 수정" : "회원 등급 신청하기"}
        </button>
        <a
          href={MEMBERSHIP_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-bold text-[#373737] transition hover:border-[#C1E4D7]"
        >
          공식 협회원 가입서 작성
        </a>
      </div>
    </form>
  );
}
