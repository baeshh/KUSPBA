import Link from "next/link";
import { notFound } from "next/navigation";
import { CompletionCard } from "@/components/seminars/CompletionCard";
import { prisma } from "@/lib/db";
import { hasSeminarGradePrices, serializeSeminarList } from "@/lib/seminars";

interface CompletePageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ name?: string; amount?: string }>;
}

export const metadata = {
  title: "신청 접수 완료 | KUSPBA",
  description: "프로그램 신청이 접수되었습니다. 참가비 입금을 완료해 주세요.",
};

export default async function CompletePage({
  params,
  searchParams,
}: CompletePageProps) {
  const { id } = await params;
  const { name, amount } = await searchParams;

  const seminarRecord = await prisma.seminar.findUnique({ where: { id } });
  if (!seminarRecord) notFound();

  const [seminar] = serializeSeminarList([seminarRecord]);
  const seminarHasFee = hasSeminarGradePrices(seminar.prices, seminar.gradeConfig) || seminar.fee.includes("원");
  const displayAmount = amount ?? (seminarHasFee ? "10000" : "0");
  const applicantName = name ?? "신청자";
  const needsPayment = seminarHasFee && displayAmount !== "0";

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex h-[60px] items-center justify-center border-b border-black/[0.08] bg-[rgba(251,251,253,0.85)] backdrop-blur-xl">
        <Link href="/" className="text-xl font-bold text-[#1D1D1F]">
          KUSPBA
        </Link>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-10 sm:px-6 md:py-16">
        <CompletionCard
          applicantName={applicantName}
          amount={displayAmount}
          hasFee={needsPayment}
        />
      </div>
    </div>
  );
}
