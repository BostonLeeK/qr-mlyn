import { redirect } from "next/navigation";
import Link from "next/link";
import { getBlogPosts, getEvents, getProjects } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import AdminProjectList from "./AdminProjectList";
import AdminEventList from "./AdminEventList";
import AdminBlogList from "./AdminBlogList";
import AdminLogout from "./AdminLogout";

export const dynamic = "force-dynamic";

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const auth = await isAuthenticated();
  if (!auth) redirect("/admin");

  const projects = await getProjects();
  const events = await getEvents();
  const posts = await getBlogPosts();
  const params = await searchParams;
  const tab =
    params.tab === "projects" || params.tab === "opencall" ? params.tab : "events";

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
            <Link
              href="/admin/open-call/new"
              className="font-body text-[0.9rem] text-accent hover:underline"
            >
              + Open Call
            </Link>
            <AdminLogout />
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-6 pb-24">
        <div className="mb-8 flex gap-2 border-b border-border">
          <Link
            href="/admin/dashboard?tab=events"
            className={`font-body border-b-2 px-3 py-2 text-[0.9rem] ${
              tab === "events"
                ? "border-text text-text"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            Івенти
          </Link>
          <Link
            href="/admin/dashboard?tab=projects"
            className={`font-body border-b-2 px-3 py-2 text-[0.9rem] ${
              tab === "projects"
                ? "border-text text-text"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            Проєкти
          </Link>
          <Link
            href="/admin/dashboard?tab=opencall"
            className={`font-body border-b-2 px-3 py-2 text-[0.9rem] ${
              tab === "opencall"
                ? "border-text text-text"
                : "border-transparent text-text-muted hover:text-text"
            }`}
          >
            Open Call
          </Link>
        </div>
        {tab === "events" ? (
          <>
            <h1 className="font-head text-2xl font-bold text-text">Івенти</h1>
            <AdminEventList events={events as { id: string; title: string; date_label: string | null; is_published: boolean }[]} />
          </>
        ) : null}
        {tab === "projects" ? (
          <>
            <h1 className="font-head text-2xl font-bold text-text">Проєкти</h1>
            <AdminProjectList projects={projects as { id: string; slug: string; title: string; author: string }[]} />
          </>
        ) : null}
        {tab === "opencall" ? (
          <>
            <h1 className="font-head text-2xl font-bold text-text">Open Call</h1>
            <AdminBlogList posts={posts as { id: string; title: string; published_at: string | null }[]} />
          </>
        ) : null}
      </main>
    </div>
  );
}
