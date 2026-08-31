/** 연락처를 010-0000-0000 형식으로 정규화합니다. */
export function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return value.trim();
}

/** 이메일을 소문자로 정규화합니다. */
export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}
