"use client";

import { Fragment, useMemo, useState, type ChangeEvent } from "react";
import { GRADE_PRICE_FIELD, type MemberGradeKey } from "@/lib/member-grade-constants";
import { parseSeminarGradeConfig } from "@/lib/seminars";
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
  gradeConfig?: string;
  status: string;
  type: string;
  description: string;
  program: string;
  applicationCount: number;
  remainingSeats: number | null;
  capacityLimit: number | null;
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
  value,
  onChange,
}: {
  name: string;
  label: string;
  defaultValue?: string;
  type?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-[#8B95A1]">{label}</span>
      <input
        type={type}
        name={name}
        {...(onChange
          ? {
              value: value ?? "",
              onChange: (event: ChangeEvent<HTMLInputElement>) =>
                onChange(event.target.value),
            }
          : { defaultValue })}
        required={required}
        className={adminInputClass}
      />
    </label>
  );
}

function ImageFields({
  initialUrl,
}: {
  initialUrl: string;
}) {
  const [imageUrl, setImageUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const uploadImage = async (file: File) => {
    setUploading(true);
    setUploadError("");
    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/programs/upload", {
        method: "POST",
        body,
      });
      const payload = (await response.json().catch(() => null)) as
        | { url?: string; error?: string }
        | null;
      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || "이미지 업로드에 실패했습니다.");
      }
      setImageUrl(payload.url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Field
        name="imageUrl"
        label="대표 이미지 URL"
        value={imageUrl}
        onChange={setImageUrl}
        required={false}
      />
      <label className="block">
        <span className="mb-1.5 block text-xs font-semibold text-[#8B95A1]">대표 이미지 파일</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          disabled={uploading}
          onChange={(event) => {
            const file = event.target.files?.[0];
            event.target.value = "";
            if (file) void uploadImage(file);
          }}
          className="w-full rounded-md border border-[#E5E8EB] bg-white px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-[#EAF0EC] file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-[#2D6A4F] disabled:opacity-60"
        />
        <span className="mt-1 block text-xs text-[#8B95A1]">
          {uploading ? "업로드 중..." : "jpg, png, webp, gif / 최대 5MB · 선택 시 바로 업로드됩니다"}
        </span>
        {uploadError ? (
          <span className="mt-1 block text-xs font-semibold text-[#F04452]">{uploadError}</span>
        ) : null}
      </label>
    </>
  );
}

function GradeConfigInputs({
  gradeOptions,
  defaults,
}: {
  gradeOptions: GradeOption[];
  defaults?: SeminarRow;
}) {
  const saved = parseSeminarGradeConfig(defaults?.gradeConfig);
  const priceDefaults: Record<string, number> = {
    BASIC: defaults?.priceBasic ?? 0,
    REGULAR: defaults?.priceRegular ?? 0,
    VIP: defaults?.priceVip ?? 0,
    PARTNER: defaults?.pricePartner ?? 0,
    SPECIAL: defaults?.priceSpecial ?? 0,
  };

  return (
    <div className="md:col-span-2">
      <p className="mb-1 text-xs font-semibold text-[#8B95A1]">신청서 회원 등급</p>
      <p className="mb-3 text-xs leading-relaxed text-[#8B95A1]">
        이 프로그램 신청서에 보일 등급 이름과 가격을 직접 정할 수 있습니다. 일반은 비회원 가격이고, 나머지는 협회원 선택 시 목록에 나갑니다.
      </p>
      <div className="overflow-x-auto rounded-xl border border-[#E5E8EB] bg-white">
        <table className="w-full min-w-[520px] text-left">
          <thead>
            <tr className="border-b border-[#E5E8EB] bg-[#F8F9FA]">
              <th className="px-3 py-2 text-xs font-semibold text-[#8B95A1]">사용</th>
              <th className="px-3 py-2 text-xs font-semibold text-[#8B95A1]">신청서 표시 이름</th>
              <th className="px-3 py-2 text-xs font-semibold text-[#8B95A1]">가격(원)</th>
            </tr>
          </thead>
          <tbody>
            {gradeOptions.map((grade) => {
              const savedRow = saved.find((item) => item.grade === grade.value);
              const roleLabel = grade.value === "BASIC" ? "일반(비회원)" : grade.label;
              return (
                <tr key={grade.value} className="border-b border-[#E5E8EB] last:border-b-0">
                  <td className="px-3 py-2">
                    <input
                      type="checkbox"
                      name={`gradeEnabled_${grade.value}`}
                      defaultChecked={savedRow?.enabled ?? true}
                      className="h-4 w-4 accent-[#2D6A4F]"
                    />
                    <span className="ml-2 text-xs text-[#8B95A1]">{roleLabel}</span>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      name={`gradeLabel_${grade.value}`}
                      defaultValue={savedRow?.label || grade.label}
                      className={adminInputClass}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      name={GRADE_PRICE_FIELD[grade.value]}
                      defaultValue={String(savedRow?.price ?? priceDefaults[grade.value] ?? 0)}
                      className={adminInputClass}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
  const defaultImageUrl =
    seminar?.imageUrl
    ?? "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000";

  return (
    <form action={saveSeminar} className="grid gap-4 md:grid-cols-2">
      {seminar ? <input type="hidden" name="id" value={seminar.id} /> : null}
      <Field name="title" label="제목" defaultValue={seminar?.title} />
      <Field name="applicationPeriod" label="신청 기간" defaultValue={seminar?.applicationPeriod} />
      <ImageFields initialUrl={defaultImageUrl} />
      <Field name="eventDate" label="진행 일시" defaultValue={seminar?.eventDate} />
      <Field name="location" label="장소" defaultValue={seminar?.location} />
      <div>
        <Field name="capacity" label="모집 인원" defaultValue={seminar?.capacity ?? "50"} />
        <p className="mt-1 text-xs text-[#8B95A1]">
          숫자 정원에 도달하면 즉시 마감됩니다. 예: 50, 선착순 50명
        </p>
      </div>
      <Field name="fee" label="참가비" defaultValue={seminar?.fee ?? "무료"} />
      <GradeConfigInputs gradeOptions={gradeOptions} defaults={seminar} />
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
        <span className="mb-1.5 block text-xs font-semibold text-[#8B95A1]">소개 (줄바꿈 그대로 표시, URL은 자동 링크)</span>
        <textarea
          name="description"
          required
          rows={8}
          defaultValue={seminar?.description}
          className={adminInputClass}
        />
      </label>
      <label className="block md:col-span-2">
        <span className="mb-1.5 block text-xs font-semibold text-[#8B95A1]">프로그램 안내 (줄바꿈 그대로 표시, - 또는 * 로 시작하면 목록, URL은 자동 링크)</span>
        <textarea
          name="program"
          rows={10}
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
                      <td className="px-8 py-4 text-sm text-[#4E5968]">
                        {seminar.capacityLimit !== null
                          ? `${seminar.applicationCount} / ${seminar.capacityLimit}명${seminar.remainingSeats !== null ? ` (잔여 ${seminar.remainingSeats}명)` : ""}`
                          : `${seminar.applicationCount}명`}
                      </td>
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
