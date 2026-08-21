import Image from "next/image";
import Link from "next/link";
import type { SeminarStatus } from "@/types";

interface ProgramCardProps {
  id: string;
  title: string;
  applicationPeriod: string;
  status: SeminarStatus;
  imageUrl?: string;
  type?: string;
  variant?: "default" | "list";
  remainingSeats?: number | null;
  isFull?: boolean;
}

function isLocalUpload(src: string) {
  return src.startsWith("/uploads/");
}

export function ProgramCard({
  id,
  title,
  applicationPeriod,
  status,
  imageUrl = "https://images.unsplash.com/photo-1582719478250-c894090bdcb1?auto=format&fit=crop&q=80&w=600",
  type,
  variant = "default",
  remainingSeats = null,
  isFull = false,
}: ProgramCardProps) {
  const isClosed = status === "closed" || status === "ended" || isFull;
  const localUpload = isLocalUpload(imageUrl);
  const remainingLabel =
    remainingSeats === null
      ? null
      : isFull
        ? "잔여 0명"
        : `잔여 ${remainingSeats}명`;
  const remainingClass =
    remainingSeats === null
      ? ""
      : isFull
        ? "text-[#A1A1A6]"
        : remainingSeats <= 5
          ? "text-[#C2410C]"
          : "text-[#427A72]";

  return (
    <Link href={`/seminars/${id}`}>
      <article
        className={`flex h-full flex-col overflow-hidden rounded-[20px] border border-black/[0.08] bg-white transition-all duration-300 ${
          isClosed
            ? "opacity-80"
            : "cursor-pointer hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.06)]"
        }`}
      >
        <div className="relative h-[200px] w-full bg-[#E8F0EE]">
          {localUpload ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt={title}
              className={`h-full w-full object-cover ${isClosed ? "grayscale opacity-80" : ""}`}
            />
          ) : (
            <Image
              src={imageUrl}
              alt={title}
              fill
              className={`object-cover ${isClosed ? "grayscale opacity-80" : ""}`}
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <span
            className={`mb-3 self-start rounded-md px-2.5 py-1 text-xs font-semibold ${
              isClosed
                ? "bg-[#F5F5F7] text-[#A1A1A6]"
                : "bg-[#427A72]/10 text-[#427A72]"
            }`}
          >
            {isClosed ? "마감" : "모집 중"}
          </span>
          <h3 className={`mb-2 text-[18px] font-semibold leading-snug md:text-xl ${isClosed ? "opacity-60" : ""}`}>
            {title}
          </h3>
          <p className={`mb-2 text-sm text-[#86868B] ${isClosed ? "opacity-60" : ""}`}>
            신청: {applicationPeriod}
          </p>
          {remainingLabel ? (
            <p className={`mb-5 text-sm font-semibold ${remainingClass} ${isClosed ? "opacity-80" : ""}`}>
              {remainingLabel}
            </p>
          ) : (
            <div className="mb-5" />
          )}
          <div className="mt-auto flex items-center justify-between">
            {variant === "list" && type ? (
              <>
                <span className={`text-[13px] text-[#86868B] ${isClosed ? "opacity-60" : ""}`}>
                  {type}
                </span>
                <span
                  className={`text-sm font-semibold ${isClosed ? "text-[#A1A1A6] font-medium" : "text-[#427A72]"}`}
                >
                  {isClosed ? "마감됨" : "상세보기 →"}
                </span>
              </>
            ) : (
              <span
                className={`text-sm font-semibold ${isClosed ? "text-[#A1A1A6] font-medium" : "text-[#427A72]"}`}
              >
                {isClosed ? "신청이 마감되었습니다" : "자세히 보기 →"}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
