"use client";

import { useRouter } from "next/navigation";

export default function AdminLogout() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  };

  return (
    <button
      onClick={handleLogout}
      className="font-body text-[0.9rem] text-text-muted hover:text-accent transition-colors"
    >
      Вийти
    </button>
  );
}
