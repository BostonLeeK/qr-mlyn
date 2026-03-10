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
  const { slug, title, author, description, cost, image_url, font_size, currency } = body;
  if (!slug || !title || !author || !description || !cost) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  try {
    const project = await createProject({
      slug: String(slug),
      title: String(title),
      author: String(author),
      description: String(description),
      cost: String(cost),
      image_url: image_url != null ? String(image_url) : undefined,
      font_size: font_size != null ? String(font_size) : undefined,
      currency: currency != null ? String(currency) : undefined,
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
