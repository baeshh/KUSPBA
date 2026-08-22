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
import { deleteUser, reviewMembershipClaim, updateMemberGradeLabels, updateUser } from "@/app/admin/actions";

type GradeOption = { value: string; label: string };

type MemberRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  affiliation: string | null;
  school: string | null;
  department: string | null;
  academicYear: string | null;
  memberType: string;
  alreadyMember: boolean;
  claimedJoinName: string | null;
  claimedJoinSchool: string | null;
  claimedJoinDepartment: string | null;
  membershipClaimStatus: string;
  grade: string;
  requestedGrade: string | null;
  role: string;
  memo: string | null;
  applicationCount: number;
  createdAtLabel: string;
  profileCompleted: boolean;
};

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
  const [claimFilter, setClaimFilter] = useState("ALL");
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter((user) => {
      if (gradeFilter !== "ALL" && user.grade !== gradeFilter) return false;
      if (claimFilter === "PENDING" && user.membershipClaimStatus !== "PENDING") return false;
      if (!q) return true;
      return [
        user.name,
        user.email,
        user.affiliation,
        user.school,
        user.department,
        user.phone,
        user.claimedJoinName,
        user.claimedJoinSchool,
        user.claimedJoinDepartment,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(q));
    });
  }, [users, query, gradeFilter, claimFilter]);

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
          <select
            value={claimFilter}
            onChange={(event) => {
              setClaimFilter(event.target.value);
              resetPage();
            }}
            className={adminSelectClass}
          >
            <option value="ALL">전체 확인상태</option>
            <option value="PENDING">기존회원 확인 대기</option>
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
                      <td className="px-8 py-4 text-sm text-[#4E5968]">
                        {user.school && user.department
                          ? `${user.school} ${user.department}`
                          : user.affiliation || "-"}
                        {user.academicYear ? (
                          <span className="mt-1 block text-xs text-[#8B95A1]">{user.academicYear}</span>
                        ) : null}
                      </td>
                      <td className="px-8 py-4 text-sm">
                        <span>{gradeLabel(user.grade)}</span>
                        {user.requestedGrade && user.requestedGrade !== user.grade ? (
                          <span className="mt-1 block text-xs font-semibold text-[#2D6A4F]">
                            신청 {gradeLabel(user.requestedGrade)}
                          </span>
                        ) : null}
                        {user.alreadyMember ? (
                          <span className="mt-1 block text-xs font-semibold text-[#C27803]">
                            {user.membershipClaimStatus === "VERIFIED"
                              ? "기존회원 확인됨"
                              : user.membershipClaimStatus === "REJECTED"
                                ? "기존회원 반려"
                                : "기존회원 확인 대기"}
                          </span>
                        ) : null}
                      </td>
                      <td className="px-8 py-4 text-sm text-[#8B95A1]">{user.createdAtLabel}</td>
                      <td className="px-8 py-4">
                        <StatusBadge tone={user.profileCompleted ? (user.role === "ADMIN" ? "success" : "muted") : "warning"}>
                          {user.role === "ADMIN" ? "관리자" : user.profileCompleted ? "활성" : "정보 미입력"}
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
                            <input name="school" defaultValue={user.school ?? ""} className={adminInputClass} placeholder="학교" />
                            <input name="department" defaultValue={user.department ?? ""} className={adminInputClass} placeholder="학과" />
                            <input name="academicYear" defaultValue={user.academicYear ?? ""} className={adminInputClass} placeholder="학년" />
                            <input name="affiliation" defaultValue={user.affiliation ?? ""} className={adminInputClass} placeholder="소속(표시용)" />
                            <input type="hidden" name="memberType" value={user.memberType} />
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
                          {user.alreadyMember ? (
                            <div className="mt-4 rounded-2xl border border-[#E5E8EB] bg-white p-4">
                              <p className="mb-2 text-sm font-bold text-[#191F28]">기존 회원 확인</p>
                              <p className="text-sm text-[#4E5968]">
                                이름 {user.claimedJoinName || "-"} · 학교 {user.claimedJoinSchool || "-"} · 학과{" "}
                                {user.claimedJoinDepartment || "-"}
                              </p>
                              <p className="mt-1 text-xs font-semibold text-[#8B95A1]">
                                현재 상태:{" "}
                                {user.membershipClaimStatus === "VERIFIED"
                                  ? "확인됨"
                                  : user.membershipClaimStatus === "REJECTED"
                                    ? "반려"
                                    : "확인 대기"}
                              </p>
                              <div className="mt-3 flex gap-2">
                                <form action={reviewMembershipClaim}>
                                  <input type="hidden" name="id" value={user.id} />
                                  <input type="hidden" name="membershipClaimStatus" value="VERIFIED" />
                                  <button type="submit" className={adminBtnPrimaryClass}>
                                    확인
                                  </button>
                                </form>
                                <form action={reviewMembershipClaim}>
                                  <input type="hidden" name="id" value={user.id} />
                                  <input type="hidden" name="membershipClaimStatus" value="REJECTED" />
                                  <button type="submit" className={adminBtnOutlineClass}>
                                    반려
                                  </button>
                                </form>
                              </div>
                            </div>
                          ) : null}
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
