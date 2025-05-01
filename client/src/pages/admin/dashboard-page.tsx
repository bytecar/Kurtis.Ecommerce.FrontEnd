import { useEffect } from "react";
import { Dashboard } from "@/components/admin/dashboard";
import { AdminLayout } from "@/components/layout/admin-layout";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const { t } = useTranslation();
  
  useEffect(() => {
    document.title = "Admin Dashboard | Kurtis & More";
  }, []);

  return (
    <AdminLayout title={t('adminDashboard.dashboard')}>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('adminDashboard.dashboard')}</h1>
        <Dashboard />
      </div>
    </AdminLayout>
  );
}
