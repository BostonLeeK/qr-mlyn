import { NextRequest, NextResponse } from "next/server";
import { createEvent, getEvents } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const events = await getEvents();
  return NextResponse.json(events);
}

export async function POST(request: NextRequest) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const { slug, title, subtitle, poster_image_url, date_label, location, instagram_handle } = body;
  if (!slug || !title || !subtitle) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  try {
    const event = await createEvent({
      slug: String(slug),
      title: String(title),
      subtitle: String(subtitle),
      poster_image_url: poster_image_url != null ? String(poster_image_url) : undefined,
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
