import { NextRequest, NextResponse } from "next/server";
import { getProjects, createProject } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json(projects);
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
  const { slug, title, author, description, cost, item_type, instagram_url, image_url, font_size, currency, event_id, event_slug, category_label, is_published } = body;
  if (!slug || !title || !author || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const normalizedType = item_type === "instagram" ? "instagram" : "price";
  if (normalizedType === "instagram" && !instagram_url) {
    return NextResponse.json({ error: "Instagram URL is required for instagram type" }, { status: 400 });
  }
  try {
    const project = await createProject({
      slug: String(slug),
      title: String(title),
      author: String(author),
      description: String(description),
      cost: cost != null && String(cost).trim() ? String(cost) : undefined,
      item_type: normalizedType,
      instagram_url: instagram_url != null ? String(instagram_url) : undefined,
      image_url: image_url != null ? String(image_url) : undefined,
      font_size: font_size != null ? String(font_size) : undefined,
      currency: currency != null ? String(currency) : undefined,
      event_id: event_id != null ? String(event_id) : undefined,
      event_slug: event_slug != null ? String(event_slug) : undefined,
      category_label: category_label != null ? String(category_label) : undefined,
      is_published: is_published != null ? Boolean(is_published) : true,
    });
    return NextResponse.json(project);
  } catch (err: unknown) {
    console.error("POST /api/projects", err);
    const code = err && typeof err === "object" && "code" in err ? (err as { code: string }).code : "";
    if (code === "23505") {
      return NextResponse.json({ error: "Такий slug вже використовується" }, { status: 409 });
    }
    return NextResponse.json({ error: "Помилка збереження" }, { status: 500 });
  }
}
