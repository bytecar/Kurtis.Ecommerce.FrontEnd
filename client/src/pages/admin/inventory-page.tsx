import { useEffect } from "react";
import { InventoryManagement } from "@/components/admin/inventory-management";

export default function InventoryPage() {
  useEffect(() => {
    document.title = "Inventory Management | Kurtis & More";
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Inventory Management</h1>
      <InventoryManagement />
    </div>
  );
}
