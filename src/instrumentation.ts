export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { prisma } = await import("@/lib/db");
  const { ensureUserSchemaOnce } = await import("@/lib/ensure-user-schema");
  await ensureUserSchemaOnce(prisma);
}
