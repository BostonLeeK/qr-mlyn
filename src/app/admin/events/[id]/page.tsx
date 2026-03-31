import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getEventById } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import EventFormWithDelete from "./EventFormWithDelete";

export const dynamic = "force-dynamic";

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const auth = await isAuthenticated();
  if (!auth) redirect("/admin");

  const { id } = await params;
  const event = await getEventById(id);
  if (!event) notFound();

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
          Редагувати івент
        </h1>
        <div className="mt-10">
          <EventFormWithDelete
            event={
              event as {
                id: string;
                slug: string;
                title: string;
                subtitle: string;
                date_label: string | null;
                location: string | null;
                instagram_handle: string | null;
              }
            }
          />
        </div>
      </main>
    </div>
  );
}
