"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CancelApplicationButton({
  applicationId,
  label = "신청 취소",
  className,
}: {
  applicationId: string;
  label?: string;
  className?: string;
}) {
  const router = useRouter();
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancel = async () => {
    if (!window.confirm("이 프로그램 신청을 취소할까요? 취소하면 정원에서 제외됩니다.")) {
      return;
    }

    setIsCancelling(true);
    const response = await fetch(`/api/seminar-applications/${applicationId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "cancel" }),
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      alert(payload?.error || "신청 취소에 실패했습니다. 잠시 후 다시 시도해 주세요.");
      setIsCancelling(false);
      return;
    }

    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={() => void handleCancel()}
      disabled={isCancelling}
      className={
        className ??
        "rounded-full border border-black/10 px-4 py-2 text-sm font-semibold text-[#555] transition hover:bg-black/5 disabled:opacity-60"
      }
    >
      {isCancelling ? "취소 중..." : label}
    </button>
  );
}
