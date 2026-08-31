"use client";

import { useEffect, useRef, useState } from "react";
import { NoticeRichEditor } from "@/components/NoticeRichEditor";
import {
  AdminPagination,
  useAdminPagination,
} from "@/components/admin/AdminPagination";
import {
  AdminCard,
  AdminCardHeader,
  StatusBadge,
  adminBtnDangerClass,
  adminBtnOutlineClass,
  adminBtnPrimaryClass,
} from "@/components/admin/ui";
import { deleteNotice, saveNotice } from "@/app/admin/actions";

type NoticeStatus = "PUBLISHED" | "DRAFT";

type NoticeItem = {
  id: string;
  title: string;
  content: string;
  status: NoticeStatus;
  viewCount: number;
  pinOrder: number | null;
  createdAtLabel: string;
};

export function NoticesAdminClient({
  notices,
  autoOpenCreate = false,
}: {
  notices: NoticeItem[];
  autoOpenCreate?: boolean;
}) {
  const [mode, setMode] = useState<"list" | "create" | "edit">(
    autoOpenCreate ? "create" : "list",
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const selected = notices.find((notice) => notice.id === selectedId) ?? null;
  const { page, setPage, totalPages, pageItems, pageSize } = useAdminPagination(notices);

  useEffect(() => {
    if (mode === "create" && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [mode]);

  return (
    <div className="space-y-6">
      <AdminCard>
        <AdminCardHeader
          title="등록된 공지사항"
          action={
            <button
              type="button"
              className={adminBtnPrimaryClass}
              onClick={() => {
                setSelectedId(null);
                setMode("create");
              }}
            >
              + 새 공지 작성
            </button>
          }
        />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="border-b border-[#E5E8EB]">
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">No</th>
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">고정</th>
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">제목</th>
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">작성일</th>
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">조회수</th>
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">상태</th>
                <th className="px-8 py-4 text-[13px] font-semibold text-[#4E5968]">관리</th>
              </tr>
            </thead>
            <tbody>
              {notices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-8 py-16 text-center text-sm text-[#8B95A1]">
                    등록된 공지사항이 없습니다.
                  </td>
                </tr>
              ) : (
                pageItems.map((notice, index) => {
                  const isActive = mode === "edit" && selectedId === notice.id;
                  const absoluteIndex = (page - 1) * pageSize + index;
                  return (
                    <tr
                      key={notice.id}
                      onClick={() => {
                        setSelectedId(notice.id);
                        setMode("edit");
                      }}
                      className={`cursor-pointer border-b border-[#E5E8EB] last:border-b-0 hover:bg-[#F2F4F6] ${
                        isActive ? "bg-[#EAF0EC]" : ""
                      }`}
                    >
                      <td className="px-8 py-4 text-sm text-[#8B95A1]">
                        {notices.length - absoluteIndex}
                      </td>
                      <td className="px-8 py-4">
                        {notice.pinOrder ? (
                          <span className="inline-flex items-center rounded-full bg-[#427A72]/10 px-2.5 py-1 text-xs font-bold text-[#427A72]">
                            핀 {notice.pinOrder}
                          </span>
                        ) : (
                          <span className="text-sm text-[#C4C4C4]">-</span>
                        )}
                      </td>
                      <td className="px-8 py-4 text-sm font-semibold">{notice.title}</td>
                      <td className="px-8 py-4 text-sm text-[#8B95A1]">{notice.createdAtLabel}</td>
                      <td className="px-8 py-4 text-sm text-[#4E5968]">
                        {notice.viewCount.toLocaleString()}
                      </td>
                      <td className="px-8 py-4">
                        <StatusBadge tone={notice.status === "PUBLISHED" ? "success" : "muted"}>
                          {notice.status === "PUBLISHED" ? "공개" : "비공개"}
                        </StatusBadge>
                      </td>
                      <td className="px-8 py-4" onClick={(event) => event.stopPropagation()}>
                        <form
                          action={deleteNotice}
                          onSubmit={(event) => {
                            if (!window.confirm("이 공지사항을 삭제하시겠습니까?")) {
                              event.preventDefault();
                            }
                          }}
                        >
                          <input type="hidden" name="id" value={notice.id} />
                          <button type="submit" className={adminBtnDangerClass}>
                            삭제
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          page={page}
          totalPages={totalPages}
          totalItems={notices.length}
          pageSize={pageSize}
          onChange={setPage}
        />
      </AdminCard>

      {mode === "create" ? (
        <div ref={formRef} className="space-y-3">
          <div className="flex justify-end">
            <button
              type="button"
              className={adminBtnOutlineClass}
              onClick={() => setMode("list")}
            >
              작성 취소
            </button>
          </div>
          <NoticeRichEditor
            key="create"
            action={saveNotice}
            heading="새 공지 작성"
            submitLabel="등록 완료"
          />
        </div>
      ) : null}

      {mode === "edit" && selected ? (
        <div className="space-y-3">
          <div className="flex justify-end">
            <button
              type="button"
              className={adminBtnOutlineClass}
              onClick={() => {
                setSelectedId(null);
                setMode("list");
              }}
            >
              수정 닫기
            </button>
          </div>
          <NoticeRichEditor
            key={selected.id}
            action={saveNotice}
            heading="공지사항 수정"
            submitLabel="수정 저장"
            notice={selected}
          />
        </div>
      ) : null}
    </div>
  );
}
