import { redirect } from "next/navigation";
import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import EventForm from "../../EventForm";

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  const auth = await isAuthenticated();
  if (!auth) redirect("/admin");

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
          Новий івент
        </h1>
        <div className="mt-10">
          <EventForm />
        </div>
      </main>
    </div>
  );
}
