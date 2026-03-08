import { getProjects, initDb } from "@/lib/db";
import { SegmentedLine } from "@/components/SegmentedLine";
import Image from "next/image";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function Home() {
  await initDb();
  const projects = await getProjects();

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
            Кераміка, що виходить за межі утилітарності
          </p>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-8 pb-32">
        <div className="mb-20 text-center">
          <h1 className="font-head font-head-condensed text-5xl font-bold uppercase tracking-tight text-text md:text-6xl lg:text-7xl">
            MLYN CERAMIC FAIR
          </h1>
          <p className="mt-6 font-body text-lg text-text-muted">
            Виставка кераміки та мистецтва
          </p>
        </div>
        {projects.length === 0 ? (
          <div className="py-32 text-center">
            <p className="font-body text-text-muted">Поки що немає проєктів</p>
            <Link
              href="/admin"
              className="mt-4 inline-block font-body text-accent hover:underline"
            >
              Адмінка →
            </Link>
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
              }[]
            ).map((project) => (
              <Link
                key={project.id}
                href={`/p/${project.slug}`}
                className="group flex flex-col items-center border-b border-border px-10 py-14 md:border-r md:[&:nth-child(3n)]:border-r-0"
              >
                <div className="relative h-48 w-48 overflow-hidden rounded-full bg-bg-subtle">
                  {project.image_url ? (
                    <img
                      src={project.image_url}
                      alt={project.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
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
                  Кераміка
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
        {projects.length > 0 && (
          <div className="mt-24 grid gap-12 border-t border-border pt-24 lg:grid-cols-[1fr,auto,1fr]">
            <div className="lg:pr-12">
              <p className="font-head text-4xl font-bold leading-tight text-text md:text-5xl">
                13.03 — 22.03
              </p>
              <p className="mt-4 font-body text-sm text-text-muted">
                Куратор проекту - Дмитро Білокінь
              </p>
            </div>
            <div className="hidden w-px bg-border lg:block" />
          </div>
        )}
      </main>
      </div>
      <SegmentedLine />
    </div>
  );
}
