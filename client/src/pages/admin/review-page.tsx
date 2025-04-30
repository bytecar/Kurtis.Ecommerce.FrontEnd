import { useEffect } from "react";
import { ReviewManagement } from "@/components/admin/review-management";

export default function ReviewPage() {
  useEffect(() => {
    document.title = "Review Management | Kurtis & More";
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Review Management</h1>
      <ReviewManagement />
    </div>
  );
}
