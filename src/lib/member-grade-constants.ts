export const MEMBER_GRADE_KEYS = [
  "BASIC",
  "REGULAR",
  "VIP",
  "PARTNER",
  "SPECIAL",
] as const;

export type MemberGradeKey = (typeof MEMBER_GRADE_KEYS)[number];

export const DEFAULT_GRADE_LABELS: Record<MemberGradeKey, string> = {
  BASIC: "비협회원",
  REGULAR: "협력학과",
  VIP: "협력·파트너",
  PARTNER: "파트너 단과대(경희대 생대)",
  SPECIAL: "협회원",
};

export const DEFAULT_GRADE_ORDER: Record<MemberGradeKey, number> = {
  BASIC: 1,
  REGULAR: 2,
  VIP: 3,
  PARTNER: 4,
  SPECIAL: 5,
};

export const GRADE_PRICE_FIELD: Record<MemberGradeKey, string> = {
  BASIC: "priceBasic",
  REGULAR: "priceRegular",
  VIP: "priceVip",
  PARTNER: "pricePartner",
  SPECIAL: "priceSpecial",
};

export const MEMBER_SELECTABLE_GRADES = MEMBER_GRADE_KEYS;
