"use client";

import { useEffect, useMemo, useState } from "react";

export const ADMIN_PAGE_SIZE = 10;

function pageNumbers(current: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(total);
  for (let i = current - 1; i <= current + 1; i += 1) {
    if (i >= 1 && i <= total) pages.add(i);
  }

  const sorted = [...pages].sort((a, b) => a - b);
  const result: (number | "…")[] = [];
  for (let i = 0; i < sorted.length; i += 1) {
    const page = sorted[i];
    if (i > 0 && page - sorted[i - 1] > 1) result.push("…");
    result.push(page);
  }
  return result;
}

export function AdminPagination({
  page,
  totalPages,
  totalItems,
  pageSize = ADMIN_PAGE_SIZE,
  onChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize?: number;
  onChange: (page: number) => void;
}) {
  if (totalPages <= 1) return null;

  const start = (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-[#E5E8EB] px-6 py-4 sm:flex-row md:px-8">
      <p className="text-sm text-[#8B95A1]">
        {totalItems}건 중 {start}–{end}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold text-[#8B95A1] transition hover:bg-[#F2F4F6] disabled:opacity-40"
          aria-label="이전 페이지"
        >
          &lt;
        </button>
        {pageNumbers(page, totalPages).map((item, index) =>
          item === "…" ? (
            <span
              key={`ellipsis-${index}`}
              className="flex h-9 w-9 items-center justify-center text-sm text-[#8B95A1]"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onChange(item)}
              className={`flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold transition ${
                page === item
                  ? "bg-[#191F28] text-white"
                  : "text-[#4E5968] hover:bg-[#F2F4F6]"
              }`}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="flex h-9 w-9 items-center justify-center rounded-md text-sm font-semibold text-[#8B95A1] transition hover:bg-[#F2F4F6] disabled:opacity-40"
          aria-label="다음 페이지"
        >
          &gt;
        </button>
      </div>
    </div>
  );
}

export function useAdminPagination<T>(items: T[], pageSize = ADMIN_PAGE_SIZE) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page, pageSize]);

  return {
    page,
    setPage,
    resetPage: () => setPage(1),
    totalPages,
    pageItems,
    pageSize,
  };
}
