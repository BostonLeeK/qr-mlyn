import { getProjectBySlug } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const search = await searchParams;
  const canPreview = search.preview === "1" && (await isAuthenticated());
  const project = await getProjectBySlug(slug, { includeDrafts: canPreview });

  if (!project) notFound();
  const eventSlug = (project as { event_slug?: string }).event_slug;
  if (!eventSlug) notFound();

  redirect(`/e/${eventSlug}/p/${slug}${canPreview ? "?preview=1" : ""}`);
}
