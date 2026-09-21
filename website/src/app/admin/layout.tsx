import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser().catch(() => null);
  // Login page has its own layout; anything reaching here needs a session
  if (!user) redirect("/admin/login");

  return (
    <div className="flex min-h-screen bg-walnut-2">
      <AdminNav user={user} />
      <main className="min-w-0 flex-1 p-6 lg:p-10">{children}</main>
    </div>
  );
}
