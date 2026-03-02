import Link from "next/link";
import Image from "next/image";
import type { SeminarStatus } from "@/types";

interface ProgramCardProps {
  id: string;
  title: string;
  applicationPeriod: string;
  status: SeminarStatus;
  imageUrl?: string;
}

export function ProgramCard({
  id,
  title,
  applicationPeriod,
  status,
  imageUrl = "https://images.unsplash.com/photo-1582719478250-c894090bdcb1?auto=format&fit=crop&q=80&w=600",
}: ProgramCardProps) {
  const isClosed = status === "closed" || status === "ended";

  return (
    <Link href={`/seminars/${id}`}>
      <article
        className={`flex flex-col overflow-hidden rounded-[20px] border border-black/5 bg-white transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${
          isClosed ? "opacity-70" : ""
        }`}
      >
        <div className="relative h-[200px] w-full bg-[#E8F0EE]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className={`object-cover ${isClosed ? "grayscale" : ""}`}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <span
            className={`mb-3 self-start rounded-md px-2.5 py-1 text-xs font-semibold ${
              isClosed
                ? "bg-[#F5F5F7] text-[#A1A1A6]"
                : "bg-[#427A72]/10 text-[#427A72]"
            }`}
          >
            {isClosed ? "마감" : "모집 중"}
          </span>
          <h3 className="mb-2 text-xl font-semibold leading-snug">{title}</h3>
          <p className="mb-5 text-sm text-[#86868B]">신청기간: {applicationPeriod}</p>
          <div
            className={`mt-auto text-sm font-semibold ${
              isClosed ? "text-[#A1A1A6]" : "text-[#427A72]"
            }`}
          >
            {isClosed ? "신청이 마감되었습니다" : "자세히 보기 →"}
          </div>
        </div>
      </article>
    </Link>
  );
}
