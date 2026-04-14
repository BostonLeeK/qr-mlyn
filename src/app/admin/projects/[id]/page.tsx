import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getProjectById } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import ProjectFormWithDelete from "./ProjectFormWithDelete";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await isAuthenticated();
  if (!auth) redirect("/admin");

  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-4xl px-6 py-8">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/dashboard"
            className="font-head text-[1.1rem] font-bold text-text hover:text-accent"
          >
            mlyn admin
          </Link>
          <Link
            href="/admin/dashboard"
            className="font-body text-[0.9rem] text-text-muted hover:text-accent"
          >
            ← До списку
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-6 pb-24">
        <h1 className="font-head text-2xl font-bold text-text">
          Редагувати проєкт
        </h1>
        <div className="mt-10">
          <ProjectFormWithDelete
            project={
              project as {
                id: string;
                slug: string;
                event_id?: string | null;
                event_slug?: string | null;
                title: string;
                author: string;
                description: string;
                cost: string | null;
                item_type?: string | null;
                instagram_url?: string | null;
                image_url: string | null;
                category_label?: string | null;
              }
            }
          />
        </div>
      </main>
    </div>
  );
}
