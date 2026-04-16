"use client";

import { useRouter } from "next/navigation";
import EventForm from "../../EventForm";

interface EventData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  poster_image_url: string | null;
  date_label: string | null;
  location: string | null;
  instagram_handle: string | null;
  is_published: boolean;
}

export default function EventFormWithDelete({ event }: { event: EventData }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Видалити івент?")) return;
    const res = await fetch(`/api/events/${event.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      const data = await res.json();
      alert(data.error ?? "Помилка видалення");
    }
  };

  return <EventForm event={event} onDelete={handleDelete} />;
}
