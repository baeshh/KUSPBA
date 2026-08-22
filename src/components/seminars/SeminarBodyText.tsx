import type { ReactNode } from "react";
import { normalizeNoticeHref } from "@/lib/sanitize-notice-html";

function LinkedText({ text }: { text: string }) {
  const nodes: ReactNode[] = [];
  const pattern = /https?:\/\/[^\s<>"']+|www\.[^\s<>"']+/gi;
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(pattern)) {
    const rawMatch = match[0];
    const index = match.index ?? 0;
    if (index > lastIndex) {
      nodes.push(text.slice(lastIndex, index));
    }

    const trailing = rawMatch.match(/[),.;:]+$/)?.[0] ?? "";
    const raw = trailing ? rawMatch.slice(0, -trailing.length) : rawMatch;
    const href = normalizeNoticeHref(raw);

    if (href) {
      nodes.push(
        <a
          key={`link-${key++}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="break-all font-semibold text-[#427A72] underline underline-offset-2"
        >
          {raw}
        </a>,
      );
      if (trailing) nodes.push(trailing);
    } else {
      nodes.push(rawMatch);
    }

    lastIndex = index + rawMatch.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return <>{nodes}</>;
}

function isBulletLine(line: string) {
  return /^\s*[-*•]\s+/.test(line);
}

function bulletText(line: string) {
  return line.replace(/^\s*[-*•]\s+/, "");
}

export function SeminarBodyText({ lines }: { lines: string[] }) {
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index];

    if (!line.trim()) {
      blocks.push(<div key={`gap-${index}`} className="h-3" />);
      index += 1;
      continue;
    }

    if (isBulletLine(line)) {
      const items: string[] = [];
      while (index < lines.length && isBulletLine(lines[index])) {
        items.push(bulletText(lines[index]));
        index += 1;
      }
      blocks.push(
        <ul key={`list-${index}`} className="my-2 list-disc space-y-1 pl-5">
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>
              <LinkedText text={item} />
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    blocks.push(
      <p key={`p-${index}`} className="text-base leading-relaxed text-[#555]">
        <LinkedText text={line} />
      </p>,
    );
    index += 1;
  }

  return <div className="space-y-1">{blocks}</div>;
}
