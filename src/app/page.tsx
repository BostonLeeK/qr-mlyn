import { getEventsByVisibility, initDb } from "@/lib/db";
import { SegmentedLine } from "@/components/SegmentedLine";
import { InstagramIcon } from "@/components/InstagramIcon";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  await initDb();
  const events = await getEventsByVisibility({ publishedOnly: true });

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
            Сучасний український дизайн ближче до людей
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-8 pb-32">
        <div className="mb-20 text-center">
          <h1 className="font-head font-head-condensed text-5xl font-bold uppercase tracking-tight text-text md:text-6xl lg:text-7xl">
            MLYN DESIGN HUB
          </h1>
          <p className="mt-6 font-body text-lg text-text-muted">
            Експозиційно-освітній простір сучасного українського дизайну
          </p>
          <p className="mt-3 font-body text-sm uppercase tracking-[0.14em] text-text-muted">
            Поділ, Спаська 36/31 • щодня 10:00 — 19:00 • вхід вільний
          </p>
        </div>
        {events.length === 0 ? (
          <div className="py-32 text-center">
            <p className="font-body text-text-muted">Поки що немає івентів</p>
            <Link
              href="/admin"
              className="mt-4 inline-block font-body text-accent hover:underline"
            >
              Адмінка →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 border-t border-border md:grid-cols-2">
            {(
              events as {
                id: string;
                slug: string;
                title: string;
                subtitle: string;
                poster_image_url: string | null;
                date_label: string | null;
                location: string | null;
                instagram_handle: string | null;
              }[]
            ).map((event) => (
              <Link
                key={event.id}
                href={`/e/${event.slug}`}
                className="group flex flex-col border-b border-border px-10 py-14 md:border-r md:[&:nth-child(2n)]:border-r-0"
              >
                <div className="relative mb-5 aspect-[3/4] w-full overflow-hidden rounded-md bg-bg-subtle">
                  {event.poster_image_url ? (
                    <Image
                      src={event.poster_image_url}
                      alt={event.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="font-head text-4xl text-text-muted/40">—</span>
                    </div>
                  )}
                </div>
                <p className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
                  Івент
                </p>
                <h2 className="mt-4 font-head text-2xl font-semibold text-text md:text-3xl">
                  {event.title}
                </h2>
                <p className="mt-3 font-body text-sm text-text-muted">
                  {event.subtitle}
                </p>
                <p className="mt-8 font-head text-xl font-bold text-text">
                  {event.date_label ?? ""}
                </p>
                <p className="mt-2 font-body text-sm text-text-muted">
                  {event.location ?? ""}
                </p>
              </Link>
            ))}
          </div>
        )}
        {events.length > 0 && (
          <div className="mt-24 flex flex-col gap-12 border-t border-border pt-24 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-body text-sm text-text-muted">
                Каталог івентів MLYN
              </p>
              <Link href="/open-call" className="mt-2 inline-block font-body text-sm text-accent hover:underline">
                Перейти до Open Call
              </Link>
            </div>
            <div>
              <p className="font-body text-xs uppercase tracking-[0.2em] text-text-muted">
                Inst
              </p>
              <a
                href="https://www.instagram.com/mlyn_dhp/"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1.5 flex items-center gap-2 font-body text-sm text-text transition-colors hover:text-accent"
                aria-label="Instagram @mlyn_dhp"
              >
                <InstagramIcon className="size-4" />
                @mlyn_dhp
              </a>
            </div>
          </div>
        )}
      </main>
      </div>
      <SegmentedLine />
    </div>
  );
}
