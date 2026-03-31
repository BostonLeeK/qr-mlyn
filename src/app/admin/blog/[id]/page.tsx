import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getBlogPostById } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import BlogFormWithDelete from "./BlogFormWithDelete";

export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await isAuthenticated();
  if (!auth) redirect("/admin");

  const { id } = await params;
  const post = await getBlogPostById(id);
  if (!post) notFound();

  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-4xl px-6 py-8">
        <div className="flex items-center justify-between">
          <Link href="/admin/dashboard" className="font-head text-[1.1rem] font-bold text-text hover:text-accent">
            mlyn admin
          </Link>
          <Link href="/admin/dashboard" className="font-body text-[0.9rem] text-text-muted hover:text-accent">
            ← До списку
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-6 pb-24">
        <h1 className="font-head text-2xl font-bold text-text">Редагувати публікацію</h1>
        <div className="mt-10">
          <BlogFormWithDelete
            post={
              post as {
                id: string;
                slug: string;
                title: string;
                excerpt: string | null;
                content: string;
                cover_image_url: string | null;
                published_at: string | null;
              }
            }
          />
        </div>
      </main>
    </div>
  );
}
