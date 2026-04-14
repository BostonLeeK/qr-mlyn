import { getEventBySlug, getProjectsByEventSlug, initDb } from "@/lib/db";
import { SegmentedLine } from "@/components/SegmentedLine";
import { InstagramIcon } from "@/components/InstagramIcon";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function EventPage({
  params,
}: {
  params: Promise<{ eventSlug: string }>;
}) {
  await initDb();
  const { eventSlug } = await params;
  const event = await getEventBySlug(eventSlug);
  if (!event) notFound();
  const projects = await getProjectsByEventSlug(eventSlug);

  return (
    <div className="flex min-h-screen flex-col">
      <SegmentedLine />
      <div className="flex-1">
        <header className="mx-auto max-w-6xl px-8 py-10">
          <div className="flex items-center justify-between">
            <Link href="/" className="relative block h-12 w-28 shrink-0 transition-opacity hover:opacity-70 md:h-16 md:w-36">
              <Image
                src="/logo.png"
                alt="mlyn"
                fill
                className="object-contain object-left"
              />
            </Link>
            <p className="max-w-xs text-right font-body text-sm leading-relaxed text-text-muted">
              {event.subtitle}
            </p>
          </div>
        </header>
        <main className="mx-auto max-w-6xl px-8 pb-32">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex items-center gap-2 font-body text-xs uppercase tracking-[0.14em] text-text-muted">
              <li>
                <Link href="/" className="transition-colors hover:text-accent">
                  Головна
                </Link>
              </li>
              <li>/</li>
              <li className="text-text">{event.title}</li>
            </ol>
          </nav>
          <div className="mb-20 text-center">
            <h1 className="font-head font-head-condensed text-5xl font-bold uppercase tracking-tight text-text md:text-6xl lg:text-7xl">
              {event.title}
            </h1>
          </div>
          {projects.length === 0 ? (
            <div className="py-32 text-center">
              <p className="font-body text-text-muted">Поки що немає проєктів</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 border-t border-border md:grid-cols-3">
              {(
                projects as {
                  id: string;
                  slug: string;
                  title: string;
                  author: string;
                  image_url: string | null;
                  category_label?: string | null;
                }[]
              ).map((project) => (
                <Link
                  key={project.id}
                  href={`/e/${eventSlug}/p/${project.slug}`}
                  className="group flex flex-col items-center border-b border-border px-10 py-14 md:border-r md:[&:nth-child(3n)]:border-r-0"
                >
                  <div className="relative h-48 w-48 overflow-hidden rounded-full bg-bg-subtle">
                    {project.image_url ? (
                      <Image
                        src={project.image_url}
                        alt={project.title}
                        fill
                        sizes="192px"
                        className="object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="font-head text-4xl text-text-muted/40">
                          —
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="mt-6 font-body text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                    {project.category_label?.trim() || "Кераміка"}
                  </p>
                  <h2 className="mt-5 text-center font-head text-xl font-semibold text-text">
                    {project.title}
                  </h2>
                  <p className="mt-2 font-body text-sm text-accent">
                    {project.author}
                  </p>
                </Link>
              ))}
            </div>
          )}
          <div className="mt-24 flex flex-col gap-12 border-t border-border pt-24 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-head text-4xl font-bold leading-tight text-text md:text-5xl">
                {event.date_label ?? ""}
              </p>
              <p className="mt-3 font-body text-sm text-text-muted">
                {event.location ?? ""}
              </p>
            </div>
            <div>
              <p className="font-body text-xs uppercase tracking-[0.2em] text-text-muted">
                Inst
              </p>
              <a
                href={`https://www.instagram.com/${(event.instagram_handle ?? "@mlyn_dhp").replace("@", "")}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 flex items-center gap-2 font-body text-sm text-text transition-colors hover:text-accent"
                aria-label={`Instagram ${event.instagram_handle ?? "@mlyn_dhp"}`}
              >
                <InstagramIcon className="size-4" />
                {event.instagram_handle ?? "@mlyn_dhp"}
              </a>
            </div>
          </div>
        </main>
      </div>
      <SegmentedLine />
    </div>
  );
}
