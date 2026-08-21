interface RemainingCapacityProps {
  capacity: string;
  appliedCount: number;
  remainingSeats: number | null;
  capacityLimit: number | null;
  isFull: boolean;
  compact?: boolean;
}

export function RemainingCapacity({
  capacity,
  appliedCount,
  remainingSeats,
  capacityLimit,
  isFull,
  compact = false,
}: RemainingCapacityProps) {
  const hasLimit = capacityLimit !== null && remainingSeats !== null;
  const filled = hasLimit
    ? Math.min(100, Math.round((appliedCount / capacityLimit) * 100))
    : 0;
  const low = hasLimit && !isFull && remainingSeats <= 5;
  const toneClass = isFull
    ? "text-[#A1A1A6]"
    : low
      ? "text-[#C2410C]"
      : "text-[#427A72]";

  if (compact) {
    if (!hasLimit) {
      return <span className="text-sm font-semibold text-[#86868B]">현재 신청 {appliedCount}명</span>;
    }
    return (
      <span className={`text-sm font-semibold ${toneClass}`}>
        {isFull ? "잔여 0명 · 마감" : `잔여 ${remainingSeats}명`}
      </span>
    );
  }

  return (
    <div
      className={`mb-6 rounded-xl p-4 ${
        isFull ? "bg-[#F5F5F7]" : low ? "bg-[#FFF4ED]" : "bg-[#E8F0EE]"
      }`}
    >
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className={`mb-1 text-[13px] font-medium ${toneClass}`}>잔여 인원</p>
          <p className={`text-[28px] font-bold leading-none ${toneClass}`}>
            {hasLimit ? remainingSeats : appliedCount}
            <span className="ml-1 text-base font-semibold">명</span>
          </p>
        </div>
        <p className="text-right text-sm text-[#86868B]">
          {hasLimit ? (
            <>정원 {capacityLimit}명</>
          ) : (
            <>모집 {capacity || "미정"}</>
          )}
        </p>
      </div>
      {hasLimit ? (
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
          <div
            className={`h-full rounded-full ${isFull ? "bg-[#A1A1A6]" : low ? "bg-[#EA580C]" : "bg-[#427A72]"}`}
            style={{ width: `${filled}%` }}
          />
        </div>
      ) : null}
      <p className="mt-2 text-xs text-[#86868B]">
        {isFull
          ? "정원이 마감되어 더 이상 신청할 수 없습니다."
          : low
            ? "잔여 인원이 얼마 남지 않았습니다."
            : hasLimit
              ? `${appliedCount}명 신청 · 선착순 마감`
              : `현재 ${appliedCount}명 신청 중입니다.`}
      </p>
    </div>
  );
}
