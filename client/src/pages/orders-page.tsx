import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Order } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Package,
  Truck,
  ShoppingBag,
} from "lucide-react";

// Status badge component
const OrderStatusBadge = ({ status }: { status: string }) => {
  let color = "";
  let icon = null;

  switch (status) {
    case "pending":
      color = "bg-yellow-100 text-yellow-800";
      icon = <Clock className="w-3 h-3 mr-1" />;
      break;
    case "processing":
      color = "bg-blue-100 text-blue-800";
      icon = <Package className="w-3 h-3 mr-1" />;
      break;
    case "shipped":
      color = "bg-indigo-100 text-indigo-800";
      icon = <Truck className="w-3 h-3 mr-1" />;
      break;
    case "delivered":
      color = "bg-green-100 text-green-800";
      icon = <CheckCircle2 className="w-3 h-3 mr-1" />;
      break;
    case "cancelled":
      color = "bg-red-100 text-red-800";
      icon = <AlertCircle className="w-3 h-3 mr-1" />;
      break;
    default:
      color = "bg-gray-100 text-gray-800";
  }

  return (
    <Badge
      variant="outline"
      className={`${color} flex items-center gap-1 font-normal`}
    >
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default function OrdersPage() {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "My Orders | Kurtis & More";
  }, []);

  // Fetch user orders
  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery<Order[]>({
    queryKey: ["/api/orders/user"],
    enabled: !!user,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold mb-8">My Orders</h1>
        <div className="space-y-4">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="border rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold mb-8">My Orders</h1>
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5" />
            <h2 className="text-lg font-medium">Error loading orders</h2>
          </div>
          <p>
            There was a problem retrieving your order history. Please try again
            later.
          </p>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-serif font-bold mb-8">My Orders</h1>

        <div className="text-center py-16 border rounded-lg">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-4">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-medium mb-2">No orders yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            You haven't placed any orders yet. Start shopping to see your order
            history here.
          </p>
          <Link href="/products/women">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-serif font-bold mb-2">My Orders</h1>
      <p className="text-muted-foreground mb-8">
        View and track all your orders
      </p>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell>₹{order.total}</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/order/${order.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
