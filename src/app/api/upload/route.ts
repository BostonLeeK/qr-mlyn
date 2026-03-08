import { put } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  if (!file) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }
  try {
    const blob = await put(
      `projects/${Date.now()}-${file.name}`,
      file,
      { access: "public" }
    );
    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error("POST /api/upload", err);
    return NextResponse.json({ error: "Помилка завантаження" }, { status: 500 });
  }
}
