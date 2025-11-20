import { useEffect } from "react";
import { ReviewManagement } from "@/components/admin/review-management";
import { useTranslation } from "react-i18next";

export default function ReviewPage() {
  const { t } = useTranslation();

  useEffect(() => {
    document.title = "Review Management | Kurtis & More";
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('adminDashboard.reviews')}</h1>
      <ReviewManagement />
    </div>
  );
}
