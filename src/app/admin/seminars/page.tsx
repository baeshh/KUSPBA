import { requireAdmin } from "@/lib/admin-auth";
import { prisma } from "@/lib/db";
import { GRADE_PRICE_FIELD, getMemberGradeOptions, type MemberGradeKey } from "@/lib/member-grades";
import { deleteSeminar, saveSeminar } from "../actions";

const statusOptions = [
  ["RECRUITING", "모집 중"],
  ["CLOSED", "마감"],
  ["ENDED", "종료"],
];

const typeOptions = [
  ["JOB_SEMINAR", "직무 세미나"],
  ["NETWORKING", "네트워킹"],
  ["PRACTICAL_PROJECT", "실무 프로젝트"],
  ["COMPETITION", "공모전"],
];

function Input({
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
      <span className="mb-1 block text-xs font-bold text-[#86868B]">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm outline-none focus:border-[#427A72]"
      />
    </label>
  );
}

function FileInput() {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold text-[#86868B]">대표 이미지 파일</span>
      <input
        type="file"
        name="imageFile"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-[#E8F0EE] file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-[#427A72]"
      />
      <span className="mt-1 block text-xs text-[#86868B]">jpg, png, webp, gif / 최대 5MB</span>
    </label>
  );
}

function PriceInputs({
  gradeOptions,
  defaults,
}: {
  gradeOptions: Array<{ value: MemberGradeKey; label: string }>;
  defaults?: Partial<Record<(typeof GRADE_PRICE_FIELD)[MemberGradeKey], number>>;
}) {
  return (
    <div className="grid gap-3 rounded-2xl bg-[#F5F5F7] p-4 md:col-span-2 md:grid-cols-5">
      {gradeOptions.map((grade) => {
        const field = GRADE_PRICE_FIELD[grade.value];
        return (
          <Input
            key={grade.value}
            name={field}
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

export default async function AdminSeminarsPage() {
  await requireAdmin();
  const [seminars, gradeOptions] = await Promise.all([
    prisma.seminar.findMany({
      orderBy: { createdAt: "desc" },
      include: { _count: { select: { applications: true } } },
    }),
    getMemberGradeOptions(),
  ]);

  return (
    <div>
      <div className="mb-8">
        <p className="mb-2 text-sm font-black text-[#8ABFB2]">Programs</p>
        <h1 className="text-[36px] font-black tracking-[-0.04em]">프로그램 관리</h1>
      </div>

      <section className="mb-10 rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="mb-5 text-xl font-black">새 프로그램 등록</h2>
        <form action={saveSeminar} className="grid gap-4 md:grid-cols-2">
          <Input name="title" label="제목" />
          <Input name="applicationPeriod" label="신청 기간" />
          <Input name="imageUrl" label="대표 이미지 URL" defaultValue="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=1000" required={false} />
          <FileInput />
          <Input name="eventDate" label="진행 일시" />
          <Input name="location" label="장소" />
          <Input name="capacity" label="모집 인원" />
          <Input name="fee" label="참가비" defaultValue="무료" />
          <PriceInputs gradeOptions={gradeOptions} />
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-[#86868B]">상태</span>
            <select name="status" className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm">
              {statusOptions.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-bold text-[#86868B]">유형</span>
            <select name="type" className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm">
              {typeOptions.map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block text-xs font-bold text-[#86868B]">소개 문단(줄바꿈 구분)</span>
            <textarea name="description" required rows={4} className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm" />
          </label>
          <label className="block md:col-span-2">
            <span className="mb-1 block text-xs font-bold text-[#86868B]">프로그램 안내(줄바꿈 구분)</span>
            <textarea name="program" rows={4} className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm" />
          </label>
          <button className="rounded-xl bg-[#1D1D1F] px-5 py-3 text-sm font-bold text-white md:col-span-2">
            프로그램 등록
          </button>
        </form>
      </section>

      <div className="space-y-5">
        {seminars.map((seminar) => (
          <section key={seminar.id} className="rounded-[24px] border border-black/10 bg-white p-5 shadow-sm">
            <form action={saveSeminar} className="grid gap-3 md:grid-cols-2">
              <input type="hidden" name="id" value={seminar.id} />
              <Input name="title" label="제목" defaultValue={seminar.title} />
              <Input name="applicationPeriod" label="신청 기간" defaultValue={seminar.applicationPeriod} />
              <Input name="imageUrl" label="대표 이미지 URL" defaultValue={seminar.imageUrl} required={false} />
              <FileInput />
              <Input name="eventDate" label="진행 일시" defaultValue={seminar.eventDate} />
              <Input name="location" label="장소" defaultValue={seminar.location} />
              <Input name="capacity" label="모집 인원" defaultValue={seminar.capacity} />
              <Input name="fee" label="참가비" defaultValue={seminar.fee} />
              <PriceInputs
                gradeOptions={gradeOptions}
                defaults={{
                  priceBasic: seminar.priceBasic,
                  priceRegular: seminar.priceRegular,
                  priceVip: seminar.priceVip,
                  pricePartner: seminar.pricePartner,
                  priceSpecial: seminar.priceSpecial,
                }}
              />
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-[#86868B]">상태</span>
                <select name="status" defaultValue={seminar.status} className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm">
                  {statusOptions.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1 block text-xs font-bold text-[#86868B]">유형</span>
                <select name="type" defaultValue={seminar.type} className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm">
                  {typeOptions.map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </label>
              <label className="block md:col-span-2">
                <span className="mb-1 block text-xs font-bold text-[#86868B]">소개 문단</span>
                <textarea name="description" required rows={3} defaultValue={seminar.description} className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm" />
              </label>
              <label className="block md:col-span-2">
                <span className="mb-1 block text-xs font-bold text-[#86868B]">프로그램 안내</span>
                <textarea name="program" rows={3} defaultValue={seminar.program} className="w-full rounded-xl border border-black/10 px-3 py-2 text-sm" />
              </label>
              <div className="flex items-center justify-between gap-3 md:col-span-2">
                <p className="text-sm font-bold text-[#86868B]">신청자 {seminar._count.applications}명</p>
                <div className="flex gap-2">
                  <button className="rounded-xl bg-[#427A72] px-4 py-2 text-sm font-bold text-white">수정 저장</button>
                </div>
              </div>
            </form>
            <form action={deleteSeminar} className="mt-3 text-right">
              <input type="hidden" name="id" value={seminar.id} />
              <button className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600">
                삭제
              </button>
            </form>
          </section>
        ))}
      </div>
    </div>
  );
}
