import { NextRequest, NextResponse } from "next/server";
import { deleteBlogPost, getBlogPostById, updateBlogPost } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(post);
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
  const { slug, title, excerpt, content, cover_image_url, published_at } = body;
  if (!slug || !title || !content) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  try {
    const post = await updateBlogPost(id, {
      slug: String(slug),
      title: String(title),
      excerpt: excerpt != null ? String(excerpt) : undefined,
      content: String(content),
      cover_image_url: cover_image_url != null ? String(cover_image_url) : undefined,
      published_at: published_at != null ? String(published_at) : undefined,
    });
    return NextResponse.json(post);
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
  await deleteBlogPost(id);
  return NextResponse.json({ success: true });
}
