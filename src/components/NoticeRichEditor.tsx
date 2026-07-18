"use client";

import { FormEvent, useRef, useState } from "react";

type NoticeStatus = "PUBLISHED" | "DRAFT";

interface NoticeRichEditorProps {
  action: (formData: FormData) => void | Promise<void>;
  notice?: {
    id: string;
    title: string;
    content: string;
    status: NoticeStatus;
    viewCount: number;
  };
  heading: string;
  submitLabel: string;
}

const statusOptions: Array<[NoticeStatus, string]> = [
  ["PUBLISHED", "공개"],
  ["DRAFT", "임시저장"],
];

const toolbarButtons = [
  { label: "굵게", command: "bold" },
  { label: "기울임", command: "italic" },
  { label: "밑줄", command: "underline" },
  { label: "목록", command: "insertUnorderedList" },
  { label: "번호", command: "insertOrderedList" },
  { label: "인용", command: "formatBlock", value: "blockquote" },
];

export function NoticeRichEditor({ action, notice, heading, submitLabel }: NoticeRichEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const contentInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const focusEditor = () => editorRef.current?.focus();

  const runCommand = (command: string, value?: string) => {
    focusEditor();
    document.execCommand(command, false, value);
  };

  const applyHeading = () => runCommand("formatBlock", "h2");

  const applyParagraph = () => runCommand("formatBlock", "p");

  const applyLink = () => {
    const url = window.prompt("연결할 URL을 입력하세요.");
    if (!url) return;
    runCommand("createLink", url);
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

      focusEditor();
      document.execCommand("insertImage", false, result.url);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "이미지를 업로드하지 못했습니다.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!contentInputRef.current || !editorRef.current) return;

    contentInputRef.current.value = editorRef.current.innerHTML;
    if (!contentInputRef.current.value.trim()) {
      event.preventDefault();
      setUploadError("공지 내용을 입력해주세요.");
    }
  };

  return (
    <section className="rounded-[28px] border border-black/10 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-black">{heading}</h2>
      <form action={action} onSubmit={handleSubmit} className="space-y-4">
        {notice && <input type="hidden" name="id" value={notice.id} />}
        <input
          name="title"
          required
          defaultValue={notice?.title}
          placeholder="공지 제목"
          className="w-full rounded-xl border border-black/10 px-4 py-3 font-bold outline-none focus:border-[#427A72]"
        />
        <input ref={contentInputRef} type="hidden" name="content" defaultValue={notice?.content ?? ""} />

        <div className="overflow-hidden rounded-2xl border border-black/10">
          <div className="flex flex-wrap items-center gap-2 border-b border-black/10 bg-[#F8F9FA] p-3">
            {toolbarButtons.map((button) => (
              <button
                key={`${button.command}-${button.value ?? "default"}`}
                type="button"
                onClick={() => runCommand(button.command, button.value)}
                className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-bold text-[#424245] transition hover:border-[#427A72] hover:text-[#427A72]"
              >
                {button.label}
              </button>
            ))}
            <button
              type="button"
              onClick={applyHeading}
              className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-bold text-[#424245] transition hover:border-[#427A72] hover:text-[#427A72]"
            >
              제목
            </button>
            <button
              type="button"
              onClick={applyParagraph}
              className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-bold text-[#424245] transition hover:border-[#427A72] hover:text-[#427A72]"
            >
              본문
            </button>
            <button
              type="button"
              onClick={applyLink}
              className="rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-bold text-[#424245] transition hover:border-[#427A72] hover:text-[#427A72]"
            >
              링크
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg bg-[#427A72] px-3 py-2 text-sm font-bold text-white transition hover:bg-[#35645d] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? "업로드 중..." : "이미지"}
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
            className="min-h-[260px] px-5 py-4 text-base leading-relaxed text-[#424245] outline-none [&_a]:font-bold [&_a]:text-[#427A72] [&_blockquote]:border-l-4 [&_blockquote]:border-[#8ABFB2] [&_blockquote]:bg-[#F8F9FA] [&_blockquote]:px-4 [&_blockquote]:py-3 [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-2xl [&_h2]:font-black [&_img]:my-5 [&_img]:max-h-[520px] [&_img]:max-w-full [&_img]:rounded-2xl [&_li]:ml-5 [&_ol]:list-decimal [&_p]:my-3 [&_ul]:list-disc"
            data-placeholder="공지 내용을 입력하고 툴바로 서식을 적용하세요."
            dangerouslySetInnerHTML={{ __html: notice?.content ?? "" }}
          />
        </div>

        {uploadError && <p className="text-sm font-bold text-red-600">{uploadError}</p>}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <select
              name="status"
              defaultValue={notice?.status ?? "PUBLISHED"}
              className="rounded-xl border border-black/10 px-4 py-3"
            >
              {statusOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            {notice && (
              <p className="text-sm font-bold text-[#86868B]">
                조회수 {notice.viewCount.toLocaleString()}
              </p>
            )}
          </div>
          <button className="rounded-xl bg-[#1D1D1F] px-5 py-3 text-sm font-bold text-white">
            {submitLabel}
          </button>
        </div>
      </form>
    </section>
  );
}
