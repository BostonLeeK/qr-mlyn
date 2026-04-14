"use client";

import { useRouter } from "next/navigation";
import BlogForm from "../../BlogForm";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published_at: string | null;
}

export default function BlogFormWithDelete({ post }: { post: BlogPost }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Видалити публікацію?")) return;
    const res = await fetch(`/api/blog/${post.id}`, { method: "DELETE" });
    if (!res.ok) return;
    router.push("/admin/dashboard?tab=opencall");
    router.refresh();
  };

  return <BlogForm post={post} onDelete={handleDelete} />;
}
