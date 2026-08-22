"use client";

import { FormEvent, useLayoutEffect, useRef, useState } from "react";
import { normalizeNoticeHref } from "@/lib/sanitize-notice-html";
import {
  AdminCard,
  AdminCardBody,
  AdminCardHeader,
  adminBtnPrimaryClass,
  adminSelectClass,
} from "@/components/admin/ui";

type NoticeStatus = "PUBLISHED" | "DRAFT";

interface NoticeRichEditorProps {
  action: (formData: FormData) => void | Promise<void>;
  notice?: {
    id: string;
    title: string;
    content: string;
    status: NoticeStatus;
    viewCount: number;
    pinOrder?: number | null;
  };
  heading: string;
  submitLabel: string;
}

const statusOptions: Array<[NoticeStatus, string]> = [
  ["PUBLISHED", "공개"],
  ["DRAFT", "임시저장"],
];

const pinOrderOptions = [
  ["", "고정 안 함"],
  ["1", "핀 1 (맨 위)"],
  ["2", "핀 2"],
  ["3", "핀 3"],
  ["4", "핀 4"],
  ["5", "핀 5"],
] as const;

const toolbarButtons = [
  { label: "B", command: "bold" },
  { label: "I", command: "italic" },
  { label: "U", command: "underline" },
  { label: "목록", command: "insertUnorderedList" },
  { label: "번호", command: "insertOrderedList" },
  { label: "인용구", command: "formatBlock", value: "blockquote" },
];

export function NoticeRichEditor({ action, notice, heading, submitLabel }: NoticeRichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const contentInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // contentEditable은 React가 매 렌더마다 덮어쓰면 안 됨.
  // 마운트 시 한 번만 초기 HTML을 넣고, 이후 입력/이미지 삽입은 DOM에 유지한다.
  useLayoutEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    editor.innerHTML = notice?.content || "";
    if (contentInputRef.current) {
      contentInputRef.current.value = editor.innerHTML;
    }
    // notice.id 변경(또는 새 작성 마운트) 시에만 초기화. parent가 key로 remount함.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notice?.id]);

  const syncHiddenContent = () => {
    if (contentInputRef.current && editorRef.current) {
      contentInputRef.current.value = editorRef.current.innerHTML;
    }
  };

  const focusEditor = () => editorRef.current?.focus();

  const runCommand = (command: string, value?: string) => {
    focusEditor();
    document.execCommand(command, false, value);
    syncHiddenContent();
  };

  const applyLink = () => {
    const raw = window.prompt("연결할 URL을 입력하세요. 예: https://kuspba.kr");
    if (!raw) return;

    const url = normalizeNoticeHref(raw);
    if (!url) {
      window.alert("http:// 또는 https://로 시작하는 올바른 URL을 입력해 주세요.");
      return;
    }

    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();

    const selection = window.getSelection();
    const selectedText = selection?.toString().trim() ?? "";
    const hasRange =
      selection &&
      selection.rangeCount > 0 &&
      selection.anchorNode &&
      editor.contains(selection.anchorNode);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.rel = "noopener noreferrer";
    anchor.textContent = selectedText || url;

    if (hasRange && selectedText && selection) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(anchor);
      range.setStartAfter(anchor);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      editor.appendChild(anchor);
      editor.appendChild(document.createElement("br"));
    }

    syncHiddenContent();
  };

  const insertImageAtCursor = (url: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();

    const img = document.createElement("img");
    img.src = url;
    img.alt = "";

    const selection = window.getSelection();
    const hasRange =
      selection &&
      selection.rangeCount > 0 &&
      selection.anchorNode &&
      editor.contains(selection.anchorNode);

    if (hasRange && selection) {
      const range = selection.getRangeAt(0);
      range.collapse(false);
      range.insertNode(img);
      range.setStartAfter(img);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      editor.appendChild(img);
      editor.appendChild(document.createElement("br"));
    }

    syncHiddenContent();
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    setUploadError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/admin/notices/upload", {
        method: "POST",
        body: formData,
      });
      const result = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !result.url) {
        throw new Error(result.error || "이미지를 업로드하지 못했습니다.");
      }

      insertImageAtCursor(result.url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "이미지를 업로드하지 못했습니다.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    syncHiddenContent();
    const content = contentInputRef.current?.value?.trim() ?? "";
    if (!content || content === "<br>") {
      event.preventDefault();
      setUploadError("공지 내용을 입력해주세요.");
    }
  };

  return (
    <AdminCard>
      <AdminCardHeader title={heading} />
      <AdminCardBody>
        <form action={action} onSubmit={handleSubmit} className="space-y-5">
          {notice && <input type="hidden" name="id" value={notice.id} />}

          <div className="flex flex-wrap gap-3">
            <select
              name="status"
              defaultValue={notice?.status ?? "PUBLISHED"}
              className={adminSelectClass}
            >
              {statusOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              name="pinOrder"
              defaultValue={notice?.pinOrder ? String(notice.pinOrder) : ""}
              className={adminSelectClass}
            >
              {pinOrderOptions.map(([value, label]) => (
                <option key={value || "none"} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {notice ? (
              <p className="flex items-center text-sm font-semibold text-[#8B95A1]">
                조회수 {notice.viewCount.toLocaleString()}
              </p>
            ) : null}
          </div>

          <input
            name="title"
            required
            defaultValue={notice?.title}
            placeholder="공지사항 제목을 입력하세요"
            className="w-full border-0 border-b-2 border-[#E5E8EB] bg-transparent py-4 text-2xl font-bold text-[#191F28] outline-none placeholder:text-[#8B95A1] focus:border-[#2D6A4F]"
          />
          <input ref={contentInputRef} type="hidden" name="content" defaultValue="" />

          <div className="overflow-hidden rounded-xl border border-[#E5E8EB] bg-white">
            <div className="flex flex-wrap items-center gap-2 border-b border-[#E5E8EB] bg-[#FAFAFA] px-4 py-3">
              {toolbarButtons.map((button) => (
                <button
                  key={`${button.command}-${button.value ?? "default"}`}
                  type="button"
                  onClick={() => runCommand(button.command, button.value)}
                  className="rounded px-3 py-1.5 text-[13px] font-semibold text-[#4E5968] transition hover:bg-[#E5E8EB] hover:text-[#191F28]"
                >
                  {button.label}
                </button>
              ))}
              <button
                type="button"
                onClick={applyLink}
                className="rounded px-3 py-1.5 text-[13px] font-semibold text-[#4E5968] transition hover:bg-[#E5E8EB] hover:text-[#191F28]"
              >
                링크
              </button>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="rounded px-3 py-1.5 text-[13px] font-semibold text-[#4E5968] transition hover:bg-[#E5E8EB] hover:text-[#191F28] disabled:opacity-60"
              >
                {uploading ? "업로드 중..." : "이미지 첨부"}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif"
                className="hidden"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void uploadImage(file);
                }}
              />
            </div>
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onInput={syncHiddenContent}
              className="min-h-[350px] px-6 py-5 text-[15px] leading-relaxed text-[#191F28] outline-none [&_a]:font-semibold [&_a]:text-[#2D6A4F] [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-[#2D6A4F] [&_blockquote]:bg-[#F2F4F6] [&_blockquote]:px-4 [&_blockquote]:py-3 [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-xl [&_h2]:font-bold [&_img]:my-5 [&_img]:max-h-[520px] [&_img]:max-w-full [&_img]:rounded-xl [&_li]:ml-5 [&_ol]:list-decimal [&_p]:my-3 [&_ul]:list-disc"
            />
          </div>

          {uploadError ? <p className="text-sm font-semibold text-[#F04452]">{uploadError}</p> : null}

          <div className="flex justify-end gap-3">
            <button type="submit" className={adminBtnPrimaryClass}>
              {submitLabel}
            </button>
          </div>
        </form>
      </AdminCardBody>
    </AdminCard>
  );
}
