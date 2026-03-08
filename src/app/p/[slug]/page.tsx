import { getProjectBySlug } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import MarkdownContent from "./MarkdownContent";
import { SegmentedBackground } from "@/components/SegmentedBackground";
import { SegmentedLine } from "@/components/SegmentedLine";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const priceNumber =
    project.cost.replace(/[^\d.,]/g, "").replace(",", ".") || project.cost;

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-50 border-b border-border/80 bg-white backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-5">
          <Link href="/" className="block transition-opacity hover:opacity-70">
            <Image
              src="/logo.png"
              alt="mlyn"
              width={236}
              height={130}
              className="h-16 w-auto"
            />
          </Link>
          <Link
            href="/"
            className="font-body text-sm text-text-muted transition-colors hover:text-accent"
          >
            ← Назад
          </Link>
        </div>
      </header>
      <main>
        <section className="mx-auto max-w-4xl px-6 pt-14 pb-10">
          <p className="font-head text-sm font-medium tracking-[0.15em] text-accent">
            {project.author}
          </p>
          <h1 className="mt-4 font-head text-[2.25rem] font-bold leading-[1.15] tracking-tight text-text md:text-[2.75rem]">
            {project.title}
          </h1>
        </section>
        <section className="relative py-20">
          <SegmentedBackground />
          <div className="relative z-10 mx-auto flex max-w-4xl justify-end px-6">
            <figure className="relative w-full max-w-[340px]">
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm shadow-2xl">
                {project.image_url ? (
                  <img
                    src={project.image_url}
                    alt={project.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-bg-dark">
                    <span className="font-head text-5xl text-white/10">—</span>
                  </div>
                )}
              </div>
              <figcaption className="mt-5 bg-accent px-3 py-2 font-body text-sm leading-relaxed text-white">
                {project.title}, {project.author}
              </figcaption>
            </figure>
          </div>
        </section>
        <section className="mx-auto max-w-2xl px-6 py-20">
          <MarkdownContent
            content={project.description}
            className="font-body font-article leading-[1.9] text-text"
          />
          <div className="mt-16 flex items-baseline gap-1 border-t border-border pt-8">
            <span className="font-head text-2xl font-medium text-text-muted">
              $
            </span>
            <span className="font-head text-4xl font-bold tabular-nums tracking-tight text-text">
              {priceNumber}
            </span>
          </div>
        </section>
      </main>
      <SegmentedLine />
    </div>
  );
}
