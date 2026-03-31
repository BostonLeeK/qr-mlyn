"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { slugFromTitle } from "@/lib/slugify";

interface EventData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  poster_image_url: string | null;
  date_label: string | null;
  location: string | null;
  instagram_handle: string | null;
}

export default function EventForm({
  event,
  onDelete,
}: {
  event?: EventData;
  onDelete?: () => void;
}) {
  const router = useRouter();
  const [title, setTitle] = useState(event?.title ?? "");
  const [subtitle, setSubtitle] = useState(event?.subtitle ?? "");
  const [posterImageUrl, setPosterImageUrl] = useState(event?.poster_image_url ?? "");
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const [posterPreviewUrl, setPosterPreviewUrl] = useState<string | null>(null);
  const [dateLabel, setDateLabel] = useState(event?.date_label ?? "");
  const [location, setLocation] = useState(event?.location ?? "");
  const [instagramHandle, setInstagramHandle] = useState(event?.instagram_handle ?? "@mlyn_dhp");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!posterFile) {
      setPosterPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(posterFile);
    setPosterPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [posterFile]);

  const previewUrl = posterPreviewUrl || posterImageUrl || event?.poster_image_url || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      let finalPosterImageUrl = posterImageUrl;
      if (posterFile) {
        const formData = new FormData();
        formData.append("file", posterFile);
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
        finalPosterImageUrl = uploadData.url ?? "";
      }
      const body = {
        slug: event ? event.slug : slugFromTitle(title),
        title,
        subtitle,
        poster_image_url: finalPosterImageUrl || undefined,
        date_label: dateLabel || undefined,
        location: location || undefined,
        instagram_handle: instagramHandle || undefined,
      };
      const res = await fetch(event ? `/api/events/${event.id}` : "/api/events", {
        method: event ? "PATCH" : "POST",
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
            Назва івенту
          </label>
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
            Підзаголовок
          </label>
          <input
            type="text"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="font-body w-full border-b border-text-muted/30 bg-transparent py-2.5 text-text outline-none focus:border-text"
            required
          />
        </div>
        <div>
          <label className="font-body mb-1.5 block text-[0.85rem] text-text-muted">
            Постер івенту
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPosterFile(e.target.files?.[0] ?? null)}
            className="font-body mt-2 w-full text-[0.9rem] text-text file:mr-4 file:py-2 file:px-3 file:bg-accent file:text-bg file:font-medium"
          />
          {previewUrl && (
            <div className="mt-3 aspect-[16/10] w-full max-w-[360px] overflow-hidden rounded border border-border">
              <div className="relative h-full w-full">
                <Image
                  src={previewUrl}
                  alt=""
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
            </div>
          )}
          <input
            type="url"
            value={posterImageUrl}
            onChange={(e) => setPosterImageUrl(e.target.value)}
            className="font-body mt-2 w-full border-b border-text-muted/30 bg-transparent py-2 text-[0.9rem] text-text outline-none focus:border-text"
            placeholder="Або URL постера"
          />
        </div>
        <div>
          <label className="font-body mb-1.5 block text-[0.85rem] text-text-muted">
            Дати
          </label>
          <input
            type="text"
            value={dateLabel}
            onChange={(e) => setDateLabel(e.target.value)}
            className="font-body w-full border-b border-text-muted/30 bg-transparent py-2.5 text-text outline-none focus:border-text"
            placeholder="13.03 — 22.03"
          />
        </div>
        <div>
          <label className="font-body mb-1.5 block text-[0.85rem] text-text-muted">
            Локація
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="font-body w-full border-b border-text-muted/30 bg-transparent py-2.5 text-text outline-none focus:border-text"
          />
        </div>
        <div>
          <label className="font-body mb-1.5 block text-[0.85rem] text-text-muted">
            Instagram
          </label>
          <input
            type="text"
            value={instagramHandle}
            onChange={(e) => setInstagramHandle(e.target.value)}
            className="font-body w-full border-b border-text-muted/30 bg-transparent py-2.5 text-text outline-none focus:border-text"
            placeholder="@mlyn_dhp"
          />
        </div>
      </div>
      {error && <p className="font-body text-[0.9rem] text-accent">{error}</p>}
      <div className="flex items-center gap-6 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="font-body bg-text px-6 py-3 text-[0.9rem] font-semibold text-bg transition hover:opacity-90 disabled:opacity-50"
        >
          {loading ? "..." : event ? "Зберегти" : "Створити"}
        </button>
        <Link
          href="/admin/dashboard"
          className="font-body text-[0.9rem] text-text-muted hover:text-accent"
        >
          Скасувати
        </Link>
        {event && onDelete && (
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
