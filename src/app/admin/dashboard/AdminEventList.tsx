"use client";

import Link from "next/link";

interface EventItem {
  id: string;
  title: string;
  date_label: string | null;
}

export default function AdminEventList({ events }: { events: EventItem[] }) {
  if (events.length === 0) {
    return (
      <p className="mt-8 font-body text-text-muted">
        Немає івентів.{" "}
        <Link href="/admin/events/new" className="text-accent hover:underline">
          Додати
        </Link>
      </p>
    );
  }

  return (
    <ul className="mt-8 space-y-1">
      {events.map((event) => (
        <li key={event.id}>
          <Link
            href={`/admin/events/${event.id}`}
            className="font-body flex items-center justify-between py-4 text-text transition-colors hover:text-accent"
          >
            <span>{event.title}</span>
            <span className="text-[0.9rem] text-text-muted">{event.date_label ?? ""}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
