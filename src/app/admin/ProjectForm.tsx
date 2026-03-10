"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RichTextEditor from "./RichTextEditor";
import QRCodeBlock from "./QRCodeBlock";
import { slugFromTitle } from "@/lib/slugify";

interface Project {
  id: string;
  slug: string;
  title: string;
  author: string;
  description: string;
  cost: string;
  image_url: string | null;
  currency?: string | null;
}

export default function ProjectForm({
  project,
  onDelete,
}: {
  project?: Project;
  onDelete?: () => void;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(project?.title ?? "");
  const [author, setAuthor] = useState(project?.author ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [cost, setCost] = useState(project?.cost ?? "");
  const [currency, setCurrency] = useState(project?.currency ?? "uah");
  const [imageUrl, setImageUrl] = useState(project?.image_url ?? "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!imageFile) {
      setFilePreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setFilePreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const previewUrl = filePreviewUrl || imageUrl || project?.image_url || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const stripped = description.replace(/<[^>]*>/g, "").trim();
    if (!stripped) {
      setError("Опис не може бути порожнім");
      return;
    }
    setLoading(true);
    try {
      let finalImageUrl = imageUrl;
      if (imageFile) {
        const formData = new FormData();
        formData.append("file", imageFile);
        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        if (!uploadRes.ok) {
          const errText = await uploadRes.text();
          let errMsg = "Upload failed";
          try {
            const errData = errText ? JSON.parse(errText) : {};
            if (errData.error) errMsg = errData.error;
          } catch {
            if (errText) errMsg = errText.slice(0, 100);
          }
          throw new Error(errMsg);
        }
        const uploadData = await uploadRes.json();
        finalImageUrl = uploadData.url ?? "";
      }
      const body = {
        slug: project ? project.slug : slugFromTitle(title),
        title,
        author,
        description,
        cost,
        currency,
        image_url: finalImageUrl || undefined,
      };
      if (project) {
        const res = await fetch(`/api/projects/${project.id}`, {
          method: "PATCH",
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
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
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
      }
      router.push("/admin/dashboard");
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
          <label className="font-body mb-1.5 block text-[0.85rem] text-text-muted">
            Назва
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-body w-full border-b border-text-muted/30 bg-transparent py-2.5 text-text outline-none focus:border-text"
            placeholder="Назва проєкту"
            required
          />
        </div>
        <div>
          <label className="font-body mb-1.5 block text-[0.85rem] text-text-muted">
            Автор
          </label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="font-body w-full border-b border-text-muted/30 bg-transparent py-2.5 text-text outline-none focus:border-text"
            placeholder="Ім'я автора"
            required
          />
        </div>
        <div>
          <label className="font-body mb-1.5 block text-[0.85rem] text-text-muted">
            Опис
          </label>
          <p className="mb-2 font-body text-[0.75rem] text-text-muted">
            Виділіть текст і натисніть кнопку для форматування
          </p>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder="Опис..."
            rows={8}
            editorKey={project?.id ?? "new"}
          />
        </div>
        <div>
          <label className="font-body mb-1.5 block text-[0.85rem] text-text-muted">
            Вартість
          </label>
          <input
            type="text"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="font-body w-full border-b border-text-muted/30 bg-transparent py-2.5 text-text outline-none focus:border-text"
            placeholder={currency === "usd" ? "100" : "5000"}
            required
          />
        </div>
        <div>
          <label className="font-body mb-1.5 block text-[0.85rem] text-text-muted">
            Валюта
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setCurrency("uah")}
              className={`font-body rounded-full border px-3 py-1 text-[0.85rem] ${
                currency === "uah"
                  ? "border-text bg-text text-bg"
                  : "border-border bg-transparent text-text-muted"
              }`}
            >
              ₴ Гривня
            </button>
            <button
              type="button"
              onClick={() => setCurrency("usd")}
              className={`font-body rounded-full border px-3 py-1 text-[0.85rem] ${
                currency === "usd"
                  ? "border-text bg-text text-bg"
                  : "border-border bg-transparent text-text-muted"
              }`}
            >
              $ Долар
            </button>
          </div>
        </div>
        <div>
          <label className="font-body mb-1.5 block text-[0.85rem] text-text-muted">
            Фото
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="font-body mt-2 w-full text-[0.9rem] text-text file:mr-4 file:py-2 file:px-3 file:bg-accent file:text-bg file:font-medium"
          />
          {previewUrl && (
            <div className="mt-3 aspect-[3/4] w-full max-w-[200px] overflow-hidden rounded border border-border">
              <img
                src={previewUrl}
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="font-body mt-2 w-full border-b border-text-muted/30 bg-transparent py-2 text-[0.9rem] text-text outline-none focus:border-text"
            placeholder="Або URL"
          />
        </div>
        <QRCodeBlock slug={project ? project.slug : slugFromTitle(title)} />
      </div>
      {error && (
        <p className="font-body text-[0.9rem] text-accent">{error}</p>
      )}
      <div className="flex items-center gap-6 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="font-body bg-text px-6 py-3 text-[0.9rem] font-semibold text-bg transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "..." : project ? "Зберегти" : "Створити"}
        </button>
        <Link
          href="/admin/dashboard"
          className="font-body text-[0.9rem] text-text-muted hover:text-accent"
        >
          Скасувати
        </Link>
        {project && onDelete && (
          <button
            type="button"
            onClick={onDelete}
            className="ml-auto font-body text-[0.9rem] text-accent hover:underline"
          >
            Видалити
          </button>
        )}
      </div>
    </form>
  );
}
