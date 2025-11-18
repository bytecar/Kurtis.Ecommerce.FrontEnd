import { useEffect } from "react";
import { Dashboard } from "@/components/admin/dashboard";

export default function DashboardPage() {
  useEffect(() => {
    document.title = "Admin Dashboard | Kurtis & More";
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      <Dashboard />
    </div>
  );
}
