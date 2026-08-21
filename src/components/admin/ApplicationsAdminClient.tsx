"use client";

import { useMemo, useState } from "react";
import {
  AdminPagination,
  useAdminPagination,
} from "@/components/admin/AdminPagination";
import {
  AdminCard,
  AdminToolbar,
  StatusBadge,
  adminBtnPrimaryClass,
  adminInputClass,
  adminSelectClass,
} from "@/components/admin/ui";
import { updateApplication } from "@/app/admin/actions";

const depositOptions = [
  ["PENDING", "입금 대기"],
  ["CONFIRMED", "입금 확인"],
  ["WAIVED", "입금 면제"],
  ["CANCELLED", "취소"],
] as const;

type SortOption = "newest" | "gradeAsc" | "gradeDesc";

const sortOptions: Array<[SortOption, string]> = [
  ["newest", "신청일 최신순"],
  ["gradeAsc", "회원등급 낮은순"],
  ["gradeDesc", "회원등급 높은순"],
];

/** BASIC → SPECIAL 순 (낮은 등급부터) */
const GRADE_SORT_ORDER: Record<string, number> = {
  BASIC: 1,
  REGULAR: 2,
  VIP: 3,
  PARTNER: 4,
  SPECIAL: 5,
};

type ApplicationRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  affiliation: string;
  seminarTitle: string;
  depositAmount: number;
  depositStatus: string;
  memo: string | null;
  isMember: boolean;
  gradeKey: string;
  gradeLabel: string;
};

function gradeSortValue(gradeKey: string) {
  return GRADE_SORT_ORDER[gradeKey] ?? 99;
}

export function ApplicationsAdminClient({
  applications,
}: {
  applications: ApplicationRow[];
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const rows = applications.filter((application) => {
      if (statusFilter !== "ALL" && application.depositStatus !== statusFilter) {
        return false;
      }
      if (!q) return true;
      return [
        application.name,
        application.email,
        application.phone,
        application.affiliation,
        application.seminarTitle,
        application.memo,
        application.gradeLabel,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });

    if (sortBy === "newest") return rows;

    return [...rows].sort((a, b) => {
      const diff = gradeSortValue(a.gradeKey) - gradeSortValue(b.gradeKey);
      return sortBy === "gradeAsc" ? diff : -diff;
    });
  }, [applications, query, statusFilter, sortBy]);

  const { page, setPage, resetPage, totalPages, pageItems, pageSize } =
    useAdminPagination(filtered);

  return (
    <AdminCard>
      <AdminToolbar>
        <input
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            resetPage();
          }}
          placeholder="신청자, 이메일, 프로그램, 소속 검색..."
          className={`${adminInputClass} max-w-sm`}
        />
        <select
          value={statusFilter}
          onChange={(event) => {
            setStatusFilter(event.target.value);
            resetPage();
          }}
          className={adminSelectClass}
        >
          <option value="ALL">전체 입금 상태</option>
          {depositOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(event) => {
            setSortBy(event.target.value as SortOption);
            resetPage();
          }}
          className={adminSelectClass}
          aria-label="정렬"
        >
          {sortOptions.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <div className="flex-1" />
        <span className="text-sm font-semibold text-[#8B95A1]">
          {filtered.length}건 / 전체 {applications.length}건
        </span>
      </AdminToolbar>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[980px] text-left">
          <thead>
            <tr className="border-b border-[#E5E8EB]">
              <th className="px-6 py-4 text-[13px] font-semibold text-[#4E5968]">신청자</th>
              <th className="px-6 py-4 text-[13px] font-semibold text-[#4E5968]">프로그램</th>
              <th className="px-6 py-4 text-[13px] font-semibold text-[#4E5968]">소속/연락처</th>
              <th className="px-6 py-4 text-[13px] font-semibold text-[#4E5968]">금액/회원</th>
              <th className="px-6 py-4 text-[13px] font-semibold text-[#4E5968]">상태 관리</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-16 text-center text-sm text-[#8B95A1]">
                  검색 결과가 없습니다.
                </td>
              </tr>
            ) : (
              pageItems.map((application) => (
                <tr
                  key={application.id}
                  className="border-b border-[#E5E8EB] align-top hover:bg-[#F2F4F6]"
                >
                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold">{application.name}</p>
                    <p className="mt-1 text-sm text-[#8B95A1]">{application.email}</p>
                  </td>
                  <td className="px-6 py-5 text-sm text-[#4E5968]">{application.seminarTitle}</td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-medium">{application.affiliation}</p>
                    <p className="mt-1 text-sm text-[#8B95A1]">{application.phone}</p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-sm font-semibold">
                      {application.depositAmount.toLocaleString()}원
                    </p>
                    <p className="mt-1 text-sm text-[#8B95A1]">
                      {application.isMember
                        ? `협회원 · ${application.gradeLabel}`
                        : `일반 · ${application.gradeLabel}`}
                    </p>
                    <div className="mt-2">
                      <StatusBadge
                        tone={
                          application.depositStatus === "PENDING"
                            ? "warning"
                            : application.depositStatus === "CANCELLED"
                              ? "muted"
                              : "success"
                        }
                      >
                        {depositOptions.find(([value]) => value === application.depositStatus)?.[1]
                          ?? application.depositStatus}
                      </StatusBadge>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <form action={updateApplication} className="grid max-w-[320px] gap-2">
                      <input type="hidden" name="id" value={application.id} />
                      <select
                        name="depositStatus"
                        defaultValue={application.depositStatus}
                        className={adminSelectClass}
                      >
                        {depositOptions.map(([value, label]) => (
                          <option key={value} value={value}>{label}</option>
                        ))}
                      </select>
                      <input
                        name="memo"
                        defaultValue={application.memo ?? ""}
                        placeholder="관리 메모"
                        className={adminInputClass}
                      />
                      <button type="submit" className={adminBtnPrimaryClass}>
                        상태 저장
                      </button>
                    </form>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AdminPagination
        page={page}
        totalPages={totalPages}
        totalItems={filtered.length}
        pageSize={pageSize}
        onChange={setPage}
      />
    </AdminCard>
  );
}
