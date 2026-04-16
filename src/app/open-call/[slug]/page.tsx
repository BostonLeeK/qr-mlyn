import { getBlogPostBySlug, initDb } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SegmentedLine } from "@/components/SegmentedLine";
import MarkdownContent from "@/app/p/[slug]/MarkdownContent";

export const dynamic = "force-dynamic";

export default async function OpenCallPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  await initDb();
  const { slug } = await params;
  const search = await searchParams;
  const canPreview = search.preview === "1" && (await isAuthenticated());
  const post = await getBlogPostBySlug(slug, { includeDrafts: canPreview });
  if (!post) notFound();

  return (
    <div className="flex min-h-screen flex-col">
      <SegmentedLine />
      <div className="flex-1">
        <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/open-call" className="font-body text-sm text-text-muted hover:text-accent">
            ← До Open Call
          </Link>
          <p className="font-body text-xs uppercase tracking-[0.12em] text-text-muted">
            {post.published_at ? new Date(post.published_at).toLocaleDateString("uk-UA") : ""}
          </p>
        </div>
        <h1 className="font-head text-4xl font-bold leading-tight text-text">{post.title}</h1>
        {post.cover_image_url ? (
          <div className="relative mt-8 aspect-[16/10] w-full overflow-hidden rounded-sm">
            <Image
              src={post.cover_image_url}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
        ) : null}
        {post.excerpt ? <p className="mt-8 font-body text-lg text-text-muted">{post.excerpt}</p> : null}
        <article className="mt-10">
          <MarkdownContent
            content={post.content}
            className="font-body font-article leading-[1.9] text-text"
          />
        </article>
        </main>
      </div>
      <SegmentedLine />
    </div>
  );
}
