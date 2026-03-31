import { redirect } from "next/navigation";
import Link from "next/link";
import { getEvents, getProjects } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import AdminProjectList from "./AdminProjectList";
import AdminEventList from "./AdminEventList";
import AdminLogout from "./AdminLogout";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const auth = await isAuthenticated();
  if (!auth) redirect("/admin");

  const projects = await getProjects();
  const events = await getEvents();

  return (
    <div className="min-h-screen">
      <header className="mx-auto max-w-4xl px-6 py-8">
        <div className="flex items-center justify-between">
          <span className="font-head text-[1.1rem] font-bold text-text">
            mlyn admin
          </span>
          <div className="flex items-center gap-8">
            <Link
              href="/admin/events/new"
              className="font-body text-[0.9rem] text-accent hover:underline"
            >
              + Івент
            </Link>
            <Link
              href="/admin/projects/new"
              className="font-body text-[0.9rem] text-accent hover:underline"
            >
              + Проєкт
            </Link>
            <AdminLogout />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 pb-24">
        <h1 className="font-head text-2xl font-bold text-text">
          Івенти
        </h1>
        <AdminEventList events={events as { id: string; title: string; date_label: string | null }[]} />
        <h2 className="mt-14 font-head text-2xl font-bold text-text">
          Проєкти
        </h2>
        <AdminProjectList projects={projects as { id: string; slug: string; title: string; author: string }[]} />
      </main>
    </div>
  );
}
