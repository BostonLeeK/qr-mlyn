"use client";

import { useRouter } from "next/navigation";
import ProjectForm from "../../ProjectForm";

interface Project {
  id: string;
  slug: string;
  title: string;
  author: string;
  description: string;
  cost: string | null;
  item_type?: string | null;
  instagram_url?: string | null;
  image_url: string | null;
  currency?: string | null;
  category_label?: string | null;
}

export default function ProjectFormWithDelete({ project }: { project: Project }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Видалити проєкт?")) return;
    const res = await fetch(`/api/projects/${project.id}`, { method: "DELETE" });
    if (res.ok) {
      router.push("/admin/dashboard");
      router.refresh();
    }
  };

  return <ProjectForm project={project} onDelete={handleDelete} />;
}
