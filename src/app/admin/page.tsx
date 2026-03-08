import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import AdminLogin from "./AdminLogin";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const auth = await isAuthenticated();
  if (auth) redirect("/admin/dashboard");
  return <AdminLogin />;
}
