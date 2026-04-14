import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { getAdminContent } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const content = await getAdminContent();

  return <AdminDashboard initialContent={content} />;
}

