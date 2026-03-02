/**
 * KUSPBA 공통 타입 정의
 */

export type MemberType = "association" | "department";

export interface User {
  id: string;
  name: string;
  email: string;
  kakaoId?: string;
  memberType: MemberType;
  createdAt: string;
}

export type SeminarStatus = "recruiting" | "closed" | "ended";

export interface Seminar {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  status: SeminarStatus;
  applicationStartDate: string;
  applicationEndDate: string;
  eventDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SeminarApplication {
  id: string;
  seminarId: string;
  userId: string;
  name: string;
  affiliation: string;
  contact: string;
  email: string;
  isMember: boolean;
  depositConfirmed: boolean;
  createdAt: string;
}
