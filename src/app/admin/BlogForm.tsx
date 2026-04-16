"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import RichTextEditor from "./RichTextEditor";
import { slugFromTitle } from "@/lib/slugify";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  published_at: string | null;
}

export default function BlogForm({
  post,
  onDelete,
}: {
  post?: BlogPost;
  onDelete?: () => void;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const slugEditedByUser = useRef(!!post);
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [publishedAt, setPublishedAt] = useState(post?.published_at ? post.published_at.slice(0, 10) : "");
  const [status, setStatus] = useState(post?.published_at ? "published" : "draft");
  const [coverImageUrl, setCoverImageUrl] = useState(post?.cover_image_url ?? "");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!coverFile) {
      setCoverPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(coverFile);
    setCoverPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [coverFile]);

  useEffect(() => {
    if (post) return;
    if (slugEditedByUser.current) return;
    if (!title.trim()) {
      setSlug("");
      return;
    }
    setSlug(slugFromTitle(title));
  }, [title, post]);

  const previewUrl = coverPreviewUrl || coverImageUrl || post?.cover_image_url || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const stripped = content.replace(/<[^>]*>/g, "").trim();
    if (!stripped) {
      setError("Контент не може бути порожнім");
      return;
    }
    setLoading(true);
    try {
      let finalCoverImageUrl = coverImageUrl;
      if (coverFile) {
        const formData = new FormData();
        formData.append("file", coverFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) {
          const text = await uploadRes.text();
          let errMsg = "Upload failed";
          try {
            const data = text ? JSON.parse(text) : {};
            if (data.error) errMsg = data.error;
          } catch {
            if (text) errMsg = text.slice(0, 100);
          }
          throw new Error(errMsg);
        }
        const uploadData = await uploadRes.json();
        finalCoverImageUrl = uploadData.url ?? "";
      }

      const body = {
        slug: slugFromTitle(slug.trim() || title),
        title,
        excerpt: excerpt || undefined,
        content,
        cover_image_url: finalCoverImageUrl || undefined,
        published_at: status === "published" && publishedAt ? `${publishedAt}T10:00:00.000Z` : undefined,
      };
      const res = await fetch(post ? `/api/blog/${post.id}` : "/api/blog", {
        method: post ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        let errMsg = "Помилка";
        try {
          const data = text ? JSON.parse(text) : {};
          if (data.error) errMsg = data.error;
        } catch {
          if (text) errMsg = text.slice(0, 100);
        }
        throw new Error(errMsg);
      }
      router.push("/admin/dashboard?tab=opencall");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Помилка");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div>
          <label className="font-body mb-1.5 block text-[0.85rem] text-text-muted">Заголовок</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-body w-full border-b border-text-muted/30 bg-transparent py-2.5 text-text outline-none focus:border-text"
            required
          />
        </div>
        <div>
          <label className="font-body mb-1.5 block text-[0.85rem] text-text-muted">
            URL (slug)
          </label>
          <p className="mb-1 font-body text-[0.75rem] text-text-muted">
            Адреса сторінки: /open-call/<span className="text-text">{slug.trim() || "…"}</span>
          </p>
          <input
            type="text"
            value={slug}
            onChange={(e) => {
              slugEditedByUser.current = true;
              setSlug(e.target.value);
            }}
            className="font-body w-full border-b border-text-muted/30 bg-transparent py-2.5 text-text outline-none focus:border-text"
            placeholder="латиниця-через-дефіс"
            required
          />
        </div>
        <div>
          <label className="font-body mb-1.5 block text-[0.85rem] text-text-muted">Короткий опис</label>
          <input
            type="text"
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="font-body w-full border-b border-text-muted/30 bg-transparent py-2.5 text-text outline-none focus:border-text"
          />
        </div>
        <div>
          <label className="font-body mb-1.5 block text-[0.85rem] text-text-muted">Статус</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value === "published" ? "published" : "draft")}
            className="font-body w-full border-b border-text-muted/30 bg-transparent py-2.5 text-text outline-none focus:border-text"
          >
            <option value="published">Опубліковано</option>
            <option value="draft">Чернетка</option>
          </select>
        </div>
        <div>
          <label className="font-body mb-1.5 block text-[0.85rem] text-text-muted">Дата публікації</label>
          <input
            type="date"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            className="font-body w-full border-b border-text-muted/30 bg-transparent py-2.5 text-text outline-none focus:border-text"
            disabled={status !== "published"}
          />
        </div>
        <div>
          <label className="font-body mb-1.5 block text-[0.85rem] text-text-muted">Обкладинка</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)}
            className="font-body mt-2 w-full text-[0.9rem] text-text file:mr-4 file:py-2 file:px-3 file:bg-accent file:text-bg file:font-medium"
          />
          {previewUrl ? (
            <div className="mt-3 aspect-[16/10] w-full max-w-[360px] overflow-hidden rounded border border-border">
              <div className="relative h-full w-full">
                <Image src={previewUrl} alt="" fill unoptimized className="object-cover" />
              </div>
            </div>
          ) : null}
          <input
            type="url"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            className="font-body mt-2 w-full border-b border-text-muted/30 bg-transparent py-2 text-[0.9rem] text-text outline-none focus:border-text"
            placeholder="Або URL обкладинки"
          />
        </div>
        <div>
          <label className="font-body mb-1.5 block text-[0.85rem] text-text-muted">Контент</label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Текст публікації..."
            rows={10}
            editorKey={post?.id ?? "new-blog"}
          />
        </div>
      </div>
      {error ? <p className="font-body text-[0.9rem] text-accent">{error}</p> : null}
      <div className="flex items-center gap-6 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="font-body bg-text px-6 py-3 text-[0.9rem] font-semibold text-bg transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "..." : post ? "Зберегти" : "Створити"}
        </button>
        <Link href="/admin/dashboard" className="font-body text-[0.9rem] text-text-muted hover:text-accent">
          Скасувати
        </Link>
        {(post || title.trim()) ? (
          <Link
            href={`/open-call/${slugFromTitle(slug.trim() || title)}?preview=1`}
            target="_blank"
            className="font-body text-[0.9rem] text-text-muted hover:text-accent"
          >
            Preview
          </Link>
        ) : null}
        {post && onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            className="ml-auto font-body text-[0.9rem] text-accent hover:underline"
          >
            Видалити
          </button>
        ) : null}
      </div>
    </form>
  );
}
