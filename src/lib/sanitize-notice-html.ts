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
const PLAIN_URL_PATTERN = /(?:https?:\/\/|www\.)[^\s<]+/gi;

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
  return escapeHtml(value);
}

export function normalizeNoticeHref(value: string) {
  const trimmed = value.trim();
  if (!trimmed || /[\u0000-\u001f]/.test(trimmed)) return null;
  if (/^(javascript|data|vbscript):/i.test(trimmed)) return null;

  if (/^(mailto:|tel:)/i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("/") && !trimmed.startsWith("//")) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (/^www\./i.test(trimmed)) return `https://${trimmed}`;
  if (/^[a-z0-9][a-z0-9.-]*\.[a-z]{2,}([/:?#].*)?$/i.test(trimmed)) {
    return `https://${trimmed}`;
  }

  return null;
}

function isSafeImage(value: string) {
  return value.startsWith("/uploads/notices/") && !value.includes("..");
}

function renderAnchor(href: string, labelHtml?: string) {
  const safeHref = escapeAttribute(href);
  const label = labelHtml ?? escapeTextContent(href);
  return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer">${label}</a>`;
}

function linkifyAndEscape(rawText: string) {
  const text = decodeHtmlEntities(rawText);
  let result = "";
  let lastIndex = 0;

  for (const match of text.matchAll(PLAIN_URL_PATTERN)) {
    const rawUrl = match[0];
    const index = match.index ?? 0;
    const trailing = rawUrl.match(/[),.;:]+$/)?.[0] ?? "";
    const url = trailing ? rawUrl.slice(0, -trailing.length) : rawUrl;
    const href = normalizeNoticeHref(url);

    result += escapeHtml(text.slice(lastIndex, index)).replaceAll("\u00A0", "&nbsp;");
    result += href ? renderAnchor(href, escapeHtml(url).replaceAll("\u00A0", "&nbsp;")) : escapeHtml(rawUrl);
    result += escapeHtml(trailing);
    lastIndex = index + rawUrl.length;
  }

  result += escapeHtml(text.slice(lastIndex)).replaceAll("\u00A0", "&nbsp;");
  return result;
}

function sanitizeAttributes(tagName: string, rawTag: string) {
  const attrs: string[] = [];
  const attrPattern = /([a-zA-Z:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;

  for (const match of rawTag.matchAll(attrPattern)) {
    const name = match[1].toLowerCase();
    const value = decodeHtmlEntities(match[2] ?? match[3] ?? match[4] ?? "");

    if (tagName === "a" && name === "href") {
      const href = normalizeNoticeHref(value);
      if (href) {
        attrs.push(`href="${escapeAttribute(href)}"`);
        attrs.push('target="_blank"');
        attrs.push('rel="noopener noreferrer"');
      }
    }

    if (tagName === "img" && name === "src" && isSafeImage(value)) {
      attrs.push(`src="${escapeAttribute(value)}"`);
      attrs.push("loading=\"lazy\"");
      attrs.push("decoding=\"async\"");
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
  let linkDepth = 0;

  for (const match of withoutUnsafeBlocks.matchAll(tagPattern)) {
    const rawTag = match[0];
    const index = match.index ?? 0;
    const text = withoutUnsafeBlocks.slice(lastIndex, index);
    result += linkDepth > 0 ? escapeTextContent(text) : linkifyAndEscape(text);
    lastIndex = index + rawTag.length;

    const tagMatch = rawTag.match(/^<\/?\s*([a-zA-Z0-9]+)/);
    if (!tagMatch) continue;

    const tagName = tagMatch[1].toLowerCase();
    if (!ALLOWED_TAGS.has(tagName)) continue;

    const isClosing = /^<\//.test(rawTag);
    if (isClosing) {
      if (tagName === "a" && linkDepth > 0) linkDepth -= 1;
      if (!VOID_TAGS.has(tagName)) result += `</${tagName}>`;
      continue;
    }

    const attrs = sanitizeAttributes(tagName, rawTag);
    if (tagName === "a") {
      if (!/\shref=/.test(attrs)) continue;
      linkDepth += 1;
    }

    result += `<${tagName}${attrs}>`;
  }

  const tail = withoutUnsafeBlocks.slice(lastIndex);
  result += linkDepth > 0 ? escapeTextContent(tail) : linkifyAndEscape(tail);
  return result.trim();
}
