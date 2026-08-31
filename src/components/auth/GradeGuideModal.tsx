"use client";

import { useEffect } from "react";

const GRADE_GUIDE = [
  {
    label: "비협회원",
    description: "KUSPBA에 가입하지 않은 일반 대학(원)생입니다.",
  },
  {
    label: "협력학과",
    description: "KUSPBA와 협력 관계에 있는 학과 소속 학생입니다.",
  },
  {
    label: "파트너 단과대(경희대 생대)",
    description: "경희대학교 생명과학대학 소속 학생입니다.",
  },
  {
    label: "협력·파트너",
    description: "협력 학과 또는 파트너 단과대와 연계된 구성원입니다.",
  },
  {
    label: "협회원",
    description: "KUSPBA 공식 협회원으로 등록된 구성원입니다.",
  },
] as const;

export function GradeGuideModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="회원 등급 안내"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-[520px] overflow-y-auto rounded-[24px] bg-white p-6 shadow-2xl md:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="mb-1 text-sm font-bold text-[#8ABFB2]">회원 등급 안내</p>
            <h2 className="text-xl font-black tracking-[-0.03em] text-[#222]">
              등급별 안내
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5F5F7] text-lg font-bold text-[#555] transition hover:bg-[#E8F0EE]"
          >
            ×
          </button>
        </div>
        <ul className="space-y-3">
          {GRADE_GUIDE.map((item) => (
            <li
              key={item.label}
              className="rounded-2xl border border-black/8 bg-[#F7FFFC] px-4 py-3"
            >
              <p className="font-bold text-[#427A72]">{item.label}</p>
              <p className="mt-1 text-sm leading-relaxed text-[#666]">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm leading-relaxed text-[#86868B]">
          등급은 최초 1회 신청 후 변경할 수 없습니다. 본인에게 해당하는 등급을 선택해 주세요.
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full bg-[#373737] py-3 text-sm font-bold text-white transition hover:bg-[#222]"
        >
          확인
        </button>
      </div>
    </div>
  );
}
