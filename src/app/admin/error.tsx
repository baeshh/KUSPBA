"use client";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="rounded-2xl border border-[#E5E8EB] bg-white p-8">
      <h2 className="mb-2 text-lg font-bold">관리 페이지를 불러오지 못했습니다</h2>
      <p className="mb-4 text-sm text-[#8B95A1]">
        {error.message || "잠시 후 다시 시도해 주세요."}
      </p>
      <button
        type="button"
        onClick={() => reset()}
        className="rounded-xl bg-[#191F28] px-4 py-2 text-sm font-semibold text-white"
      >
        다시 시도
      </button>
    </div>
  );
}
