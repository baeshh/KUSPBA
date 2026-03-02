"use client";

import Link from "next/link";
import { useState } from "react";

const ACCOUNT_NUMBER = "123456-00-123456";

interface CompletionCardProps {
  applicantName: string;
  amount: string;
  hasFee: boolean;
}

export function CompletionCard({
  applicantName,
  amount,
  hasFee,
}: CompletionCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(ACCOUNT_NUMBER);
      setCopied(true);
      alert("계좌번호가 복사되었습니다.\n은행 앱에서 붙여넣기 해주세요.");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("복사 실패:", err);
    }
  };

  return (
    <div className="w-full max-w-[540px] rounded-[24px] border border-black/[0.08] bg-white p-10 text-center shadow-[0_12px_32px_rgba(0,0,0,0.04)] md:p-12">
      <div className="mx-auto mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full bg-[rgba(52,199,89,0.1)] text-[#34C759]">
        <svg
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <h1 className="mb-3 text-[28px] font-bold">신청서가 접수되었습니다.</h1>
      <p className="mb-8 text-base text-[#86868B]">
        참가비 입금이 완료되어야 최종 신청이 확정됩니다.
      </p>

        {hasFee && parseInt(amount, 10) > 0 ? (
        <div className="mb-8 rounded-2xl border border-black/[0.08] bg-[#FBFBFD] p-6 text-left">
          <h3 className="mb-4 flex items-center gap-2 text-[15px] font-semibold text-[#427A72]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
            입금 정보 안내
          </h3>
          <div className="space-y-3 text-[15px]">
            <div className="flex justify-between">
              <span className="text-[#86868B]">입금할 금액</span>
              <span className="text-lg font-semibold text-[#427A72]">
                {parseInt(amount, 10).toLocaleString()}원
              </span>
            </div>
            <div className="border-t border-dashed border-black/[0.08] pt-4">
              <div className="flex justify-between">
                <span className="text-[#86868B]">은행</span>
                <span className="font-semibold">국민은행</span>
              </div>
              <div className="mt-3 flex justify-between">
                <span className="text-[#86868B]">계좌번호</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{ACCOUNT_NUMBER}</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="rounded-md border border-black/[0.08] bg-white px-2 py-1 text-xs font-semibold text-[#86868B] transition-colors hover:border-[#427A72] hover:bg-[#E8F0EE] hover:text-[#427A72]"
                  >
                    {copied ? "복사됨" : "복사"}
                  </button>
                </div>
              </div>
              <div className="mt-3 flex justify-between">
                <span className="text-[#86868B]">예금주</span>
                <span className="font-semibold">
                  한국대학생제약바이오산업협회
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8 rounded-2xl border border-black/[0.08] bg-[#E8F0EE] p-6">
          <p className="text-center font-semibold text-[#427A72]">
            참가비가 무료인 프로그램입니다.
            <br />
            별도 입금이 필요하지 않습니다.
          </p>
        </div>
      )}

      <ul className="mb-8 rounded-xl bg-[#F5F5F7] p-4 text-left text-[13px] text-[#86868B]">
        {hasFee && parseInt(amount, 10) > 0 && (
          <li className="mb-1.5 ml-4">
            반드시{" "}
            <strong className="text-[#1D1D1F]">
              신청자 본인 명의({applicantName})
            </strong>
            로 입금해 주시기 바랍니다.
          </li>
        )}
        <li className="mb-1.5 ml-4">
          입금 확인은 관리자가 수동으로 진행하며, 1~2일 내에 마이페이지에서
          &apos;신청 완료&apos; 상태로 변경됩니다.
        </li>
        {hasFee && parseInt(amount, 10) > 0 && (
          <li className="ml-4">
            신청 후 24시간 내 미입금 시 신청이 자동 취소될 수 있습니다.
          </li>
        )}
      </ul>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="flex-1 rounded-xl border border-black/[0.08] px-4 py-4 text-center text-[15px] font-semibold transition-colors hover:bg-[#FBFBFD]"
        >
          메인으로 가기
        </Link>
        <Link
          href="/seminars"
          className="flex-1 rounded-xl bg-[#1D1D1F] px-4 py-4 text-center text-[15px] font-semibold text-white transition-colors hover:bg-black"
        >
          세미나 목록 보기
        </Link>
      </div>
    </div>
  );
}
