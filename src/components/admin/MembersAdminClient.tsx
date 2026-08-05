"use client";

import { Fragment, useMemo, useState } from "react";
import {
  AdminPagination,
  useAdminPagination,
} from "@/components/admin/AdminPagination";
import {
  AdminCard,
  AdminCardBody,
  AdminCardHeader,
  AdminToolbar,
  StatusBadge,
  adminBtnDangerClass,
  adminBtnOutlineClass,
  adminBtnPrimaryClass,
  adminInputClass,
  adminSelectClass,
} from "@/components/admin/ui";
import { deleteUser, updateMemberGradeLabels, updateUser } from "@/app/admin/actions";

type GradeOption = { value: string; label: string };

type MemberRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  affiliation: string | null;
  memberType: string;
  grade: string;
  role: string;
  memo: string | null;
  applicationCount: number;
  createdAtLabel: string;
};

const memberTypes = [
  ["ASSOCIATE", "협회원"],
  ["DEPARTMENT", "학과회원"],
];

const roles = [
  ["USER", "일반"],
  ["ADMIN", "관리자"],
];

export function MembersAdminClient({
  users,
  gradeOptions,
}: {
  users: MemberRow[];
  gradeOptions: GradeOption[];
}) {
  const [query, setQuery] = useState("");
  const [gradeFilter, setGradeFilter] = useState("ALL");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((user) => {
      if (gradeFilter !== "ALL" && user.grade !== gradeFilter) return false;
      if (!q) return true;
      return [user.name, user.email, user.affiliation, user.phone]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [users, query, gradeFilter]);

  const { page, setPage, resetPage, totalPages, pageItems, pageSize } =
    useAdminPagination(filtered);

  const gradeLabel = (value: string) =>
    gradeOptions.find((g) => g.value === value)?.label ?? value;

  return (
    <div className="space-y-6">
      <AdminCard>
        <AdminCardHeader title="회원 등급 이름 설정" />
        <AdminCardBody>
          <p className="mb-5 text-sm text-[#8B95A1]">
            등급 키(BASIC~SPECIAL)는 유지되고, 화면 표시 이름만 변경됩니다.
          </p>
          <form action={updateMemberGradeLabels} className="grid gap-3 md:grid-cols-5">
            {gradeOptions.map((grade) => (
              <label key={grade.value} className="block">
                <span className="mb-1.5 block text-xs font-semibold text-[#8B95A1]">{grade.value}</span>
                <input
                  name={`label_${grade.value}`}
                  defaultValue={grade.label}
                  className={adminInputClass}
                />
              </label>
            ))}
            <div className="md:col-span-5">
              <button type="submit" className={adminBtnPrimaryClass}>
                등급 이름 저장
              </button>
            </div>
          </form>
        </AdminCardBody>
      </AdminCard>

      <AdminCard>
        <AdminToolbar>
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              resetPage();
            }}
            placeholder="이름, 이메일, 소속 검색..."
            className={`${adminInputClass} max-w-sm`}
          />
          <select
            value={gradeFilter}
            onChange={(event) => {
              setGradeFilter(event.target.value);
              resetPage();
            }}
            className={adminSelectClass}
          >
            <option value="ALL">전체 등급</option>
            {gradeOptions.map((grade) => (
              <option key={grade.value} value={grade.value}>
                {grade.label}
              </option>
            ))}
          </select>
          <div className="flex-1" />
          <span className="text-sm font-semibold text-[#8B95A1]">{filtered.length}명</span>
        </AdminToolbar>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-[#E5E8EB]">
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">이름</th>
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">이메일</th>
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">소속</th>
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">등급</th>
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">가입일</th>
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">상태</th>
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">관리</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-16 text-center text-sm text-[#8B95A1]">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                pageItems.map((user) => (
                  <Fragment key={user.id}>
                    <tr className="border-b border-[#E5E8EB] hover:bg-[#F2F4F6]">
                      <td className="px-8 py-4 text-sm font-semibold">{user.name}</td>
                      <td className="px-8 py-4 text-sm text-[#4E5968]">{user.email || "-"}</td>
                      <td className="px-8 py-4 text-sm text-[#4E5968]">{user.affiliation || "-"}</td>
                      <td className="px-8 py-4 text-sm">{gradeLabel(user.grade)}</td>
                      <td className="px-8 py-4 text-sm text-[#8B95A1]">{user.createdAtLabel}</td>
                      <td className="px-8 py-4">
                        <StatusBadge tone={user.role === "ADMIN" ? "success" : "muted"}>
                          {user.role === "ADMIN" ? "관리자" : "활성"}
                        </StatusBadge>
                      </td>
                      <td className="px-8 py-4">
                        <button
                          type="button"
                          className={adminBtnOutlineClass}
                          onClick={() => setEditingId(editingId === user.id ? null : user.id)}
                        >
                          {editingId === user.id ? "닫기" : "편집"}
                        </button>
                      </td>
                    </tr>
                    {editingId === user.id ? (
                      <tr className="border-b border-[#E5E8EB] bg-[#FAFAFA]">
                        <td colSpan={7} className="px-8 py-6">
                          <form action={updateUser} className="grid gap-3 md:grid-cols-4">
                            <input type="hidden" name="id" value={user.id} />
                            <input name="name" defaultValue={user.name} required className={adminInputClass} placeholder="이름" />
                            <input name="email" defaultValue={user.email ?? ""} className={adminInputClass} placeholder="이메일" />
                            <input name="phone" defaultValue={user.phone ?? ""} className={adminInputClass} placeholder="연락처" />
                            <input name="affiliation" defaultValue={user.affiliation ?? ""} className={adminInputClass} placeholder="소속" />
                            <select name="memberType" defaultValue={user.memberType} className={adminSelectClass}>
                              {memberTypes.map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                              ))}
                            </select>
                            <select name="grade" defaultValue={user.grade} className={adminSelectClass}>
                              {gradeOptions.map((grade) => (
                                <option key={grade.value} value={grade.value}>{grade.label}</option>
                              ))}
                            </select>
                            <select name="role" defaultValue={user.role} className={adminSelectClass}>
                              {roles.map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                              ))}
                            </select>
                            <input name="memo" defaultValue={user.memo ?? ""} className={adminInputClass} placeholder="관리 메모" />
                            <div className="flex items-center justify-between gap-3 md:col-span-4">
                              <p className="text-sm text-[#8B95A1]">
                                신청 {user.applicationCount}건 · 가입일 {user.createdAtLabel}
                              </p>
                              <div className="flex gap-2">
                                <button type="submit" className={adminBtnPrimaryClass}>
                                  회원 정보 저장
                                </button>
                              </div>
                            </div>
                          </form>
                          <form action={deleteUser} className="mt-3 text-right">
                            <input type="hidden" name="id" value={user.id} />
                            <button type="submit" className={adminBtnDangerClass}>
                              회원 삭제
                            </button>
                          </form>
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
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
    </div>
  );
}
