import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { activeApplicationWhere } from "@/lib/seminars";
import { syncSeminarCapacity } from "@/lib/seminar-capacity-sync";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "로그인 후 취소해 주세요." }, { status: 401 });
  }

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { action?: string } | null;
  if (body?.action !== "cancel") {
    return NextResponse.json({ error: "지원하지 않는 요청입니다." }, { status: 400 });
  }

  try {
    const application = await prisma.$transaction(async (tx) => {
      const current = await tx.seminarApplication.findUnique({
        where: { id },
        include: { seminar: { select: { id: true, capacity: true } } },
      });
      if (!current) {
        throw Object.assign(new Error("신청 내역을 찾을 수 없습니다."), { status: 404 });
      }
      if (current.userId !== user.id && current.email !== user.email) {
        throw Object.assign(new Error("본인 신청만 취소할 수 있습니다."), { status: 403 });
      }
      if (current.depositStatus === "CANCELLED") {
        throw Object.assign(new Error("이미 취소된 신청입니다."), { status: 409 });
      }

      const previousAppliedCount = await tx.seminarApplication.count({
        where: { seminarId: current.seminarId, ...activeApplicationWhere },
      });

      const updated = await tx.seminarApplication.update({
        where: { id },
        data: { depositStatus: "CANCELLED" },
      });

      await syncSeminarCapacity(tx, current.seminarId, current.seminar.capacity, {
        previousAppliedCount,
      });

      return updated;
    });

    revalidatePath("/seminars");
    revalidatePath(`/seminars/${application.seminarId}`);
    revalidatePath("/mypage");

    return NextResponse.json({ id: application.id, cancelled: true });
  } catch (error) {
    const status = typeof error === "object" && error && "status" in error
      ? Number((error as { status?: number }).status)
      : 500;
    const message = error instanceof Error ? error.message : "신청 취소에 실패했습니다.";
    if (status >= 400 && status < 500) {
      return NextResponse.json({ error: message }, { status });
    }
    console.error("Cancel seminar application error:", error);
    return NextResponse.json({ error: "신청 취소에 실패했습니다." }, { status: 500 });
  }
}
