import type { ReactNode } from "react";

export function AdminCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`overflow-hidden rounded-2xl border border-[#E5E8EB] bg-white shadow-[0_2px_10px_rgba(0,0,0,0.03)] ${className}`}
    >
      {children}
    </section>
  );
}

export function AdminCardHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#E5E8EB] px-6 py-5 md:px-8">
      <h2 className="text-lg font-bold tracking-[-0.02em] text-[#191F28]">{title}</h2>
      {action}
    </div>
  );
}

export function AdminCardBody({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`p-6 md:p-8 ${className}`}>{children}</div>;
}

export function AdminToolbar({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-[#E5E8EB] bg-[#FAFAFA] px-6 py-4 md:px-8">
      {children}
    </div>
  );
}

export const adminInputClass =
  "w-full rounded-md border border-[#E5E8EB] bg-white px-3.5 py-2.5 text-sm text-[#191F28] outline-none transition placeholder:text-[#8B95A1] focus:border-[#2D6A4F]";

export const adminSelectClass =
  "rounded-md border border-[#E5E8EB] bg-white px-3.5 py-2.5 text-sm text-[#191F28] outline-none transition focus:border-[#2D6A4F]";

export const adminBtnPrimaryClass =
  "inline-flex items-center justify-center rounded-md bg-[#2D6A4F] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1B4332]";

export const adminBtnOutlineClass =
  "inline-flex items-center justify-center rounded-md border border-[#E5E8EB] bg-white px-5 py-2.5 text-sm font-semibold text-[#191F28] transition hover:bg-[#F2F4F6]";

export const adminBtnDangerClass =
  "inline-flex items-center justify-center rounded-md bg-[#FFF1F1] px-4 py-2 text-sm font-semibold text-[#F04452] transition hover:bg-[#FFE4E4]";

export function StatusBadge({
  children,
  tone = "success",
}: {
  children: ReactNode;
  tone?: "success" | "muted" | "warning";
}) {
  const tones = {
    success: "bg-[#EAF0EC] text-[#2D6A4F]",
    muted: "bg-[#F2F4F6] text-[#8B95A1]",
    warning: "bg-[#FFF6E5] text-[#C27803]",
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${tones[tone]}`}>
      {children}
    </span>
  );
}
