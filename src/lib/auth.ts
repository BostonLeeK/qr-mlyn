import { cookies } from "next/headers";

const ADMIN_USER = process.env.ADMIN_USER ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin";

export function validateCredentials(
  username: string,
  password: string
): boolean {
  return username === ADMIN_USER && password === ADMIN_PASSWORD;
}

export async function setAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.set("admin_auth", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.get("admin_auth")?.value === "1";
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_auth");
}
