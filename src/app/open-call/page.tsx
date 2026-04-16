import { getBlogPostsByVisibility, initDb } from "@/lib/db";
import Image from "next/image";
import Link from "next/link";
import { SegmentedLine } from "@/components/SegmentedLine";

export const dynamic = "force-dynamic";

export default async function OpenCallPage() {
  await initDb();
  const posts = await getBlogPostsByVisibility({ publishedOnly: true });

  return (
    <div className="flex min-h-screen flex-col">
      <SegmentedLine />
      <div className="flex-1">
        <main className="mx-auto max-w-6xl px-8 py-12">
        <div className="mb-12 flex items-center justify-between">
          <h1 className="font-head text-4xl font-bold text-text">Open Call</h1>
          <Link href="/" className="font-body text-sm text-text-muted hover:text-accent">
            ← На головну
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="font-body text-text-muted">Поки що немає публікацій</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {(posts as {
              id: string;
              slug: string;
              title: string;
              excerpt: string | null;
              cover_image_url: string | null;
              published_at: string | null;
            }[]).map((post) => (
              <Link key={post.id} href={`/open-call/${post.slug}`} className="group block border border-border">
                <div className="relative aspect-[16/10] w-full bg-bg-subtle">
                  {post.cover_image_url ? (
                    <Image
                      src={post.cover_image_url}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : null}
                </div>
                <div className="p-6">
                  <p className="font-body text-xs uppercase tracking-[0.12em] text-text-muted">
                    {post.published_at ? new Date(post.published_at).toLocaleDateString("uk-UA") : ""}
                  </p>
                  <h2 className="mt-3 font-head text-2xl font-semibold text-text">{post.title}</h2>
                  <p className="mt-3 font-body text-sm text-text-muted">{post.excerpt ?? ""}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
        </main>
      </div>
      <SegmentedLine />
    </div>
  );
}
