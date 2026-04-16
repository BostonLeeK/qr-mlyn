"use client";

import Link from "next/link";

interface BlogPost {
  id: string;
  title: string;
  published_at: string | null;
}

export default function AdminBlogList({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return (
      <p className="mt-8 font-body text-text-muted">
        Немає публікацій.{" "}
        <Link href="/admin/open-call/new" className="text-accent hover:underline">
          Додати
        </Link>
      </p>
    );
  }

  return (
    <ul className="mt-8 space-y-1">
      {posts.map((post) => (
        <li key={post.id}>
          <Link
            href={`/admin/open-call/${post.id}`}
            className="font-body flex items-center justify-between py-4 text-text transition-colors hover:text-accent"
          >
            <span>{post.title}</span>
            <span className="text-[0.9rem] text-text-muted">
              {post.published_at ? `Опубліковано · ${new Date(post.published_at).toLocaleDateString("uk-UA")}` : "Чернетка"}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
