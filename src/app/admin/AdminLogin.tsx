"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Помилка");
        return;
      }
      router.push("/admin/dashboard");
      router.refresh();
    } catch {
      setError("Помилка з'єднання");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-[340px]">
        <h1 className="font-head mb-10 text-2xl font-bold text-text">
          Адмін
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-body mb-1.5 block text-[0.85rem] text-text-muted">
              Логін
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="font-body w-full border-b border-text-muted/30 bg-transparent py-2.5 text-text outline-none transition placeholder:text-text-muted/50 focus:border-text"
              placeholder="admin"
              required
            />
          </div>
          <div>
            <label className="font-body mb-1.5 block text-[0.85rem] text-text-muted">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="font-body w-full border-b border-text-muted/30 bg-transparent py-2.5 text-text outline-none transition placeholder:text-text-muted/50 focus:border-text"
              placeholder="••••••••"
              required
            />
          </div>
          {error && (
            <p className="font-body text-[0.9rem] text-accent">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="font-body w-full bg-text py-3.5 text-[0.9rem] font-semibold text-bg transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "..." : "Увійти"}
          </button>
        </form>
        <a
          href="/"
          className="mt-8 block font-body text-center text-[0.9rem] text-text-muted hover:text-accent"
        >
          ← На головну
        </a>
      </div>
    </div>
  );
}
