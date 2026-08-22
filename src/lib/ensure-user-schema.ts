import type { PrismaClient } from "@prisma/client";

const USER_COLUMNS: Array<[string, string]> = [
  ["school", "TEXT"],
  ["department", "TEXT"],
  ["academicYear", "TEXT"],
  ["profileCompleted", "INTEGER NOT NULL DEFAULT 0"],
  ["alreadyMember", "INTEGER NOT NULL DEFAULT 0"],
  ["claimedJoinName", "TEXT"],
  ["claimedJoinSchool", "TEXT"],
  ["claimedJoinDepartment", "TEXT"],
  ["membershipClaimStatus", "TEXT NOT NULL DEFAULT 'NONE'"],
];

let pending: Promise<void> | null = null;

function isDuplicateColumnError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return /duplicate column name/i.test(message);
}

export async function ensureUserSchema(prisma: PrismaClient) {
  for (const [name, definition] of USER_COLUMNS) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE User ADD COLUMN "${name}" ${definition}`);
    } catch (error) {
      if (isDuplicateColumnError(error)) continue;
      console.error(`ensureUserSchema failed for ${name}:`, error);
    }
  }
}

export function ensureUserSchemaOnce(prisma: PrismaClient) {
  if (!pending) {
    pending = ensureUserSchema(prisma);
  }
  return pending;
}

const SEMINAR_COLUMNS: Array<[string, string]> = [
  ["gradeConfig", "TEXT NOT NULL DEFAULT ''"],
];

let seminarPending: Promise<void> | null = null;

export async function ensureSeminarSchema(prisma: PrismaClient) {
  for (const [name, definition] of SEMINAR_COLUMNS) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE Seminar ADD COLUMN "${name}" ${definition}`);
    } catch (error) {
      if (isDuplicateColumnError(error)) continue;
      console.error(`ensureSeminarSchema failed for ${name}:`, error);
    }
  }
}

export function ensureSeminarSchemaOnce(prisma: PrismaClient) {
  if (!seminarPending) {
    seminarPending = ensureSeminarSchema(prisma);
  }
  return seminarPending;
}
