import { redirect } from "next/navigation";
import Link from "next/link";
import { getProjects } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import AdminProjectList from "./AdminProjectList";
import AdminLogout from "./AdminLogout";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const auth = await isAuthenticated();
  if (!auth) redirect("/admin");

  const projects = await getProjects();

  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-4xl px-6 py-8">
        <div className="flex items-center justify-between">
          <span className="font-head text-[1.1rem] font-bold text-text">
            mlyn admin
          </span>
          <div className="flex items-center gap-8">
            <Link
              href="/admin/projects/new"
              className="font-body text-[0.9rem] text-accent hover:underline"
            >
              + Додати
            </Link>
            <AdminLogout />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 pb-24">
        <h1 className="font-head text-2xl font-bold text-text">
          Проєкти
        </h1>
        <AdminProjectList projects={projects as { id: string; slug: string; title: string; author: string }[]} />
      </main>
    </div>
  );
}
