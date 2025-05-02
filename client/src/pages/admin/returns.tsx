import { useEffect } from "react";
import ReturnsManagement from "@/components/admin/returns-management";

export default function AdminReturnsPage() {
  useEffect(() => {
    document.title = "Returns Management | Admin Dashboard";
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Returns Management</h1>
      <ReturnsManagement />
    </div>
  );
}