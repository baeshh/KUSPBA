import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { saveUploadedImage } from "@/lib/server/image-upload";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: "관리자 로그인이 필요합니다." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File) || file.size <= 0) {
      return NextResponse.json({ error: "업로드할 이미지가 없습니다." }, { status: 400 });
    }

    const url = await saveUploadedImage(file, "notices");
    return NextResponse.json({ url });
  } catch (error) {
    console.error("Notice image upload error:", error);
    const message = error instanceof Error ? error.message : "이미지 업로드에 실패했습니다.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
