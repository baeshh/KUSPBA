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

export async function ensureUserSchema(prisma: PrismaClient) {
  try {
    const columns = await prisma.$queryRawUnsafe<Array<{ name: string }>>(
      "PRAGMA table_info(User)",
    );
    if (!Array.isArray(columns) || columns.length === 0) return;

    const names = new Set(columns.map((column) => column.name));
    for (const [name, definition] of USER_COLUMNS) {
      if (names.has(name)) continue;
      await prisma.$executeRawUnsafe(`ALTER TABLE User ADD COLUMN "${name}" ${definition}`);
    }
  } catch (error) {
    console.error("ensureUserSchema failed:", error);
  }
}

export function ensureUserSchemaOnce(prisma: PrismaClient) {
  if (!pending) {
    pending = ensureUserSchema(prisma);
  }
  return pending;
}
