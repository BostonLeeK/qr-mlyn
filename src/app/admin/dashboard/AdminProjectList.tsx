"use client";

import Link from "next/link";

interface Project {
  id: string;
  slug: string;
  title: string;
  author: string;
}

export default function AdminProjectList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <p className="mt-8 font-body text-text-muted">
        Немає проєктів.{" "}
        <Link href="/admin/projects/new" className="text-accent hover:underline">
          Додати
        </Link>
      </p>
    );
  }

  return (
    <ul className="mt-8 space-y-1">
      {projects.map((p) => (
        <li key={p.id}>
          <Link
            href={`/admin/projects/${p.id}`}
            className="font-body flex items-center justify-between py-4 text-text hover:text-accent transition-colors"
          >
            <span>{p.title}</span>
            <span className="text-[0.9rem] text-text-muted">{p.author}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
