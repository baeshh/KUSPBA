"use client";

import { Fragment, useMemo, useState } from "react";
import { GRADE_PRICE_FIELD, type MemberGradeKey } from "@/lib/member-grades";
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
import { deleteSeminar, saveSeminar } from "@/app/admin/actions";

const statusOptions = [
  ["RECRUITING", "모집 중"],
  ["CLOSED", "마감"],
  ["ENDED", "종료"],
] as const;

const typeOptions = [
  ["JOB_SEMINAR", "직무 세미나"],
  ["NETWORKING", "네트워킹"],
  ["PRACTICAL_PROJECT", "실무 프로젝트"],
  ["COMPETITION", "공모전"],
] as const;

type GradeOption = { value: MemberGradeKey; label: string };

type SeminarRow = {
  id: string;
  title: string;
  applicationPeriod: string;
  imageUrl: string;
  eventDate: string;
  location: string;
  capacity: string;
  fee: string;
  priceBasic: number;
  priceRegular: number;
  priceVip: number;
  pricePartner: number;
  priceSpecial: number;
  status: string;
  type: string;
  description: string;
  program: string;
  applicationCount: number;
};

function statusLabel(status: string) {
  return statusOptions.find(([value]) => value === status)?.[1] ?? status;
}

function typeLabel(type: string) {
  return typeOptions.find(([value]) => value === type)?.[1] ?? type;
}

function Field({
  name,
  label,
  defaultValue,
  type = "text",
  required = true,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-[#8B95A1]">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className={adminInputClass}
      />
    </label>
  );
}

function FileInput() {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-[#8B95A1]">대표 이미지 파일</span>
      <input
        type="file"
        name="imageFile"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="w-full rounded-md border border-[#E5E8EB] bg-white px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[#EAF0EC] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#2D6A4F]"
      />
      <span className="mt-1 block text-xs text-[#8B95A1]">jpg, png, webp, gif / 최대 5MB</span>
    </label>
  );
}

function PriceInputs({
  gradeOptions,
  defaults,
}: {
  gradeOptions: GradeOption[];
  defaults?: {
    priceBasic?: number;
    priceRegular?: number;
    priceVip?: number;
    pricePartner?: number;
    priceSpecial?: number;
  };
}) {
  return (
    <div className="grid gap-3 rounded-xl bg-[#F2F4F6] p-4 md:col-span-2 md:grid-cols-5">
      {gradeOptions.map((grade) => {
        const field = GRADE_PRICE_FIELD[grade.value] as keyof NonNullable<typeof defaults>;
        return (
          <Field
            key={grade.value}
            name={GRADE_PRICE_FIELD[grade.value]}
            label={`${grade.label} 가격`}
            type="number"
            defaultValue={String(defaults?.[field] ?? 0)}
            required={false}
          />
        );
      })}
    </div>
  );
}

function SeminarFormFields({
  gradeOptions,
  seminar,
}: {
  gradeOptions: GradeOption[];
  seminar?: SeminarRow;
}) {
  return (
    <form action={saveSeminar} className="grid gap-4 md:grid-cols-2">
      {seminar ? <input type="hidden" name="id" value={seminar.id} /> : null}
      <Field name="title" label="제목" defaultValue={seminar?.title} />
      <Field name="applicationPeriod" label="신청 기간" defaultValue={seminar?.applicationPeriod} />
      <Field
        name="imageUrl"
        label="대표 이미지 URL"
        defaultValue={
          seminar?.imageUrl
          ?? "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000"
        }
        required={false}
      />
      <FileInput />
      <Field name="eventDate" label="진행 일시" defaultValue={seminar?.eventDate} />
      <Field name="location" label="장소" defaultValue={seminar?.location} />
      <Field name="capacity" label="모집 인원" defaultValue={seminar?.capacity} />
      <Field name="fee" label="참가비" defaultValue={seminar?.fee ?? "무료"} />
      <PriceInputs
        gradeOptions={gradeOptions}
        defaults={
          seminar
            ? {
                priceBasic: seminar.priceBasic,
                priceRegular: seminar.priceRegular,
                priceVip: seminar.priceVip,
                pricePartner: seminar.pricePartner,
                priceSpecial: seminar.priceSpecial,
              }
            : undefined
        }
      />
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-[#8B95A1]">상태</span>
        <select
          name="status"
          defaultValue={seminar?.status ?? "RECRUITING"}
          className={`w-full ${adminSelectClass}`}
        >
          {statusOptions.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-[#8B95A1]">유형</span>
        <select
          name="type"
          defaultValue={seminar?.type ?? "JOB_SEMINAR"}
          className={`w-full ${adminSelectClass}`}
        >
          {typeOptions.map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </label>
      <label className="block md:col-span-2">
        <span className="mb-1.5 block text-xs font-semibold text-[#8B95A1]">소개 문단(줄바꿈 구분)</span>
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={seminar?.description}
          className={adminInputClass}
        />
      </label>
      <label className="block md:col-span-2">
        <span className="mb-1.5 block text-xs font-semibold text-[#8B95A1]">프로그램 안내(줄바꿈 구분)</span>
        <textarea
          name="program"
          rows={3}
          defaultValue={seminar?.program}
          className={adminInputClass}
        />
      </label>
      <div className="flex justify-end gap-2 md:col-span-2">
        <button type="submit" className={adminBtnPrimaryClass}>
          {seminar ? "수정 저장" : "프로그램 등록"}
        </button>
      </div>
    </form>
  );
}

export function SeminarsAdminClient({
  seminars,
  gradeOptions,
}: {
  seminars: SeminarRow[];
  gradeOptions: GradeOption[];
}) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return seminars.filter((seminar) => {
      if (statusFilter !== "ALL" && seminar.status !== statusFilter) return false;
      if (!q) return true;
      return [
        seminar.title,
        seminar.location,
        seminar.eventDate,
        seminar.applicationPeriod,
        typeLabel(seminar.type),
        statusLabel(seminar.status),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [seminars, query, statusFilter]);

  const { page, setPage, resetPage, totalPages, pageItems, pageSize } =
    useAdminPagination(filtered);

  return (
    <div className="space-y-6">
      <AdminCard>
        <AdminCardHeader
          title="프로그램 목록"
          action={
            <button
              type="button"
              className={adminBtnPrimaryClass}
              onClick={() => {
                setCreating((prev) => !prev);
                setEditingId(null);
              }}
            >
              {creating ? "등록 닫기" : "+ 새 프로그램 등록"}
            </button>
          }
        />

        {creating ? (
          <AdminCardBody className="border-b border-[#E5E8EB] bg-[#FAFAFA]">
            <SeminarFormFields key="create" gradeOptions={gradeOptions} />
          </AdminCardBody>
        ) : null}

        <AdminToolbar>
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              resetPage();
            }}
            placeholder="제목, 장소, 유형 검색..."
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
            <option value="ALL">전체 상태</option>
            {statusOptions.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <div className="flex-1" />
          <span className="text-sm font-semibold text-[#8B95A1]">
            {filtered.length}건 / 전체 {seminars.length}건
          </span>
        </AdminToolbar>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-[#E5E8EB]">
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">제목</th>
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">유형</th>
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">상태</th>
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">신청 기간</th>
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">신청자</th>
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">관리</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-8 py-16 text-center text-sm text-[#8B95A1]">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                pageItems.map((seminar) => (
                  <Fragment key={seminar.id}>
                    <tr className="border-b border-[#E5E8EB] hover:bg-[#F2F4F6]">
                      <td className="px-8 py-4 text-sm font-semibold">{seminar.title}</td>
                      <td className="px-8 py-4 text-sm text-[#4E5968]">{typeLabel(seminar.type)}</td>
                      <td className="px-8 py-4">
                        <StatusBadge
                          tone={
                            seminar.status === "RECRUITING"
                              ? "success"
                              : seminar.status === "CLOSED"
                                ? "warning"
                                : "muted"
                          }
                        >
                          {statusLabel(seminar.status)}
                        </StatusBadge>
                      </td>
                      <td className="px-8 py-4 text-sm text-[#8B95A1]">{seminar.applicationPeriod}</td>
                      <td className="px-8 py-4 text-sm text-[#4E5968]">{seminar.applicationCount}명</td>
                      <td className="px-8 py-4">
                        <button
                          type="button"
                          className={adminBtnOutlineClass}
                          onClick={() => {
                            setCreating(false);
                            setEditingId(editingId === seminar.id ? null : seminar.id);
                          }}
                        >
                          {editingId === seminar.id ? "닫기" : "편집"}
                        </button>
                      </td>
                    </tr>
                    {editingId === seminar.id ? (
                      <tr className="border-b border-[#E5E8EB] bg-[#FAFAFA]">
                        <td colSpan={6} className="px-8 py-6">
                          <SeminarFormFields
                            key={seminar.id}
                            gradeOptions={gradeOptions}
                            seminar={seminar}
                          />
                          <form action={deleteSeminar} className="mt-3 text-right">
                            <input type="hidden" name="id" value={seminar.id} />
                            <button type="submit" className={adminBtnDangerClass}>
                              프로그램 삭제
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
