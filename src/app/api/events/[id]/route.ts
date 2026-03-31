import { NextRequest, NextResponse } from "next/server";
import { deleteEvent, getEventById, updateEvent } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const event = await getEventById(id);
  if (!event) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(event);
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { slug, title, subtitle, date_label, location, instagram_handle } = body;
  if (!slug || !title || !subtitle) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  try {
    const event = await updateEvent(id, {
      slug: String(slug),
      title: String(title),
      subtitle: String(subtitle),
      date_label: date_label != null ? String(date_label) : undefined,
      location: location != null ? String(location) : undefined,
      instagram_handle: instagram_handle != null ? String(instagram_handle) : undefined,
    });
    return NextResponse.json(event);
  } catch (err: unknown) {
    const code = err && typeof err === "object" && "code" in err ? (err as { code: string }).code : "";
    if (code === "23505") {
      return NextResponse.json({ error: "Такий slug вже використовується" }, { status: 409 });
    }
    return NextResponse.json({ error: "Помилка збереження" }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await deleteEvent(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Неможливо видалити івент з прив'язаними проєктами" },
      { status: 409 }
    );
  }
}
