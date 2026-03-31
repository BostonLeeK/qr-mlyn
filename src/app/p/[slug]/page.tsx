import { getProjectBySlug } from "@/lib/db";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();
  const eventSlug = (project as { event_slug?: string }).event_slug;
  if (!eventSlug) notFound();

  redirect(`/e/${eventSlug}/p/${slug}`);
}
