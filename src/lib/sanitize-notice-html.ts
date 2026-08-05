const ALLOWED_TAGS = new Set([
  "a",
  "b",
  "blockquote",
  "br",
  "div",
  "em",
  "h2",
  "h3",
  "i",
  "img",
  "li",
  "ol",
  "p",
  "span",
  "strong",
  "u",
  "ul",
]);

const VOID_TAGS = new Set(["br", "img"]);

/** contentEditable이 넣는 &nbsp; 등을 디코딩해 재살균이 멱등해지게 한다. */
function decodeHtmlEntities(value: string) {
  let previous = "";
  let current = value;

  while (previous !== current) {
    previous = current;
    current = current
      .replace(/&nbsp;/gi, "\u00A0")
      .replace(/&#0*160;/g, "\u00A0")
      .replace(/&#x0*a0;/gi, "\u00A0")
      .replace(/&quot;/gi, '"')
      .replace(/&#0*39;/g, "'")
      .replace(/&apos;/gi, "'")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&amp;/gi, "&");
  }

  return current;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeTextContent(value: string) {
  return escapeHtml(decodeHtmlEntities(value)).replaceAll("\u00A0", "&nbsp;");
}

function escapeAttribute(value: string) {
  return escapeHtml(decodeHtmlEntities(value));
}

function isSafeLink(value: string) {
  return /^(https?:\/\/|mailto:|tel:|\/)/i.test(value) && !/[\u0000-\u001f]/.test(value);
}

function isSafeImage(value: string) {
  return value.startsWith("/uploads/notices/") && !value.includes("..");
}

function sanitizeAttributes(tagName: string, rawTag: string) {
  const attrs: string[] = [];
  const attrPattern = /([a-zA-Z:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;

  for (const match of rawTag.matchAll(attrPattern)) {
    const name = match[1].toLowerCase();
    const value = decodeHtmlEntities(match[2] ?? match[3] ?? match[4] ?? "");

    if (tagName === "a" && name === "href" && isSafeLink(value)) {
      attrs.push(`href="${escapeAttribute(value)}"`);
      attrs.push('target="_blank"');
      attrs.push('rel="noopener noreferrer"');
    }

    if (tagName === "img" && name === "src" && isSafeImage(value)) {
      attrs.push(`src="${escapeAttribute(value)}"`);
      attrs.push('loading="lazy"');
      attrs.push('decoding="async"');
    }

    if (tagName === "img" && ["alt", "title"].includes(name)) {
      attrs.push(`${name}="${escapeAttribute(value)}"`);
    }
  }

  return attrs.length ? ` ${attrs.join(" ")}` : "";
}

export function sanitizeNoticeHtml(html: string) {
  const withoutUnsafeBlocks = html.replace(/<(script|style|iframe|object|embed)\b[\s\S]*?<\/\1>/gi, "");
  const tagPattern = /<\/?[^>]+>/g;
  let result = "";
  let lastIndex = 0;

  for (const match of withoutUnsafeBlocks.matchAll(tagPattern)) {
    const rawTag = match[0];
    const index = match.index ?? 0;
    result += escapeTextContent(withoutUnsafeBlocks.slice(lastIndex, index));
    lastIndex = index + rawTag.length;

    const tagMatch = rawTag.match(/^<\/?\s*([a-zA-Z0-9]+)/);
    if (!tagMatch) continue;

    const tagName = tagMatch[1].toLowerCase();
    if (!ALLOWED_TAGS.has(tagName)) continue;

    const isClosing = /^<\//.test(rawTag);
    if (isClosing) {
      if (!VOID_TAGS.has(tagName)) result += `</${tagName}>`;
      continue;
    }

    const attrs = sanitizeAttributes(tagName, rawTag);
    result += VOID_TAGS.has(tagName) ? `<${tagName}${attrs}>` : `<${tagName}${attrs}>`;
  }

  result += escapeTextContent(withoutUnsafeBlocks.slice(lastIndex));
  return result.trim();
}
