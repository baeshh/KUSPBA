"use client";

import { useState, useMemo } from "react";
import { ProgramCard } from "@/components/seminars/ProgramCard";
import type { SeminarDetail } from "@/lib/seminars";

const ITEMS_PER_PAGE = 6;

interface SeminarsListProps {
  seminars: SeminarDetail[];
}

type FilterTab = "all" | "recruiting" | "closed";

export function SeminarsList({ seminars }: SeminarsListProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredSeminars = useMemo(() => {
    let result = seminars;

    if (activeTab === "recruiting") {
      result = result.filter((s) => s.status === "recruiting");
    } else if (activeTab === "closed") {
      result = result.filter((s) => s.status === "closed" || s.status === "ended");
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((s) => s.title.toLowerCase().includes(query));
    }

    return result;
  }, [seminars, activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredSeminars.length / ITEMS_PER_PAGE);
  const paginatedSeminars = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSeminars.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSeminars, currentPage]);

  return (
    <>
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex rounded-full bg-[#F5F5F7] p-1">
          <button
            type="button"
            onClick={() => {
              setActiveTab("all");
              setCurrentPage(1);
            }}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              activeTab === "all"
                ? "bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                : "text-[#86868B] hover:text-[#1D1D1F]"
            }`}
          >
            전체보기
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("recruiting");
              setCurrentPage(1);
            }}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              activeTab === "recruiting"
                ? "bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                : "text-[#86868B] hover:text-[#1D1D1F]"
            }`}
          >
            모집 중
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("closed");
              setCurrentPage(1);
            }}
            className={`rounded-full px-5 py-2 text-sm font-semibold transition-all ${
              activeTab === "closed"
                ? "bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                : "text-[#86868B] hover:text-[#1D1D1F]"
            }`}
          >
            마감
          </button>
        </div>

        <div className="relative w-full sm:max-w-[320px]">
          <svg
            className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#A1A1A6]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="세미나 제목 검색..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full rounded-full border border-black/[0.08] bg-white py-3 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-[#A1A1A6] focus:border-[#427A72] focus:ring-4 focus:ring-[#427A72]/15"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {paginatedSeminars.map((seminar) => (
          <ProgramCard
            key={seminar.id}
            id={seminar.id}
            title={seminar.title}
            applicationPeriod={seminar.applicationPeriod}
            status={seminar.status}
            imageUrl={seminar.imageUrl}
            type={seminar.type}
            variant="list"
          />
        ))}
      </div>

      {filteredSeminars.length === 0 && (
        <p className="py-16 text-center text-[#86868B]">검색 결과가 없습니다.</p>
      )}

      {totalPages > 1 && (
        <div className="mt-16 flex justify-center gap-2">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-sm font-semibold text-[#86868B] transition-colors hover:bg-black/5 disabled:opacity-50"
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              type="button"
              onClick={() => setCurrentPage(page)}
              className={`flex h-10 w-10 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                currentPage === page
                  ? "bg-[#1D1D1F] text-white"
                  : "text-[#86868B] hover:bg-black/5"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-transparent text-sm font-semibold text-[#86868B] transition-colors hover:bg-black/5 disabled:opacity-50"
          >
            &gt;
          </button>
        </div>
      )}
    </>
  );
}
