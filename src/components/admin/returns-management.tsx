import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MoreHorizontal, Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { format } from "date-fns";
import { ReturnsAPI } from "../../services/returns.service";
import { OrdersAPI } from "../../services/orders.service";
import { queryClient } from "../../lib/queryClient";

interface Return {
  id: number;
  orderId: number;
  orderItemId: number;
  status: string;
  reason: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

interface Order {
  id: number;
  email: string;
  fullName: string;
  status: string;
  total: number;
  createdAt: string | Date;
}

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  price: number;
  quantity: number;
  productName: string;
}

export default function ReturnsManagement() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [viewDetails, setViewDetails] = useState<Return | null>(null);
  const [orderDetails, setOrderDetails] = useState<Order | null>(null);
  const [orderItemDetails, setOrderItemDetails] = useState<OrderItem | null>(null);

  // Fetch returns data
  const { data: returns, isLoading } = useQuery<Return[]>({
    queryKey: ["/api/returns"],
    queryFn: async () => await ReturnsAPI.getAllReturns(),
  });

  // Update return status mutation
  const updateReturnMutation = useMutation({
      mutationFn: async ({ id, status }: { id: number; status: string }) => {
            const res = await ReturnsAPI.updateReturnStatus(id, status);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/returns"] });
      toast({
        title: "Return status updated",
        description: "The return status has been updated successfully",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Failed to update return status",
        description: error.message,
      });
    },
  });

  // Fetch order details when viewing a return
  useEffect(() => {
    if (viewDetails?.orderId) {
      const fetchOrderDetails = async () => {
          try {
          const res = await OrdersAPI.getOrder(viewDetails.orderId);
          const data = await res.json();
          setOrderDetails(data);
        } catch (error) {
          console.error("Failed to fetch order details:", error);
        }
      };

      const fetchOrderItemDetails = async () => {
        try {
          const res = await fetch(`/api/orders/${viewDetails.orderId}/items`);
          const data = await res.json();
          const orderItem = data.find(
            (item: OrderItem) => item.id === viewDetails.orderItemId
          );
          setOrderItemDetails(orderItem || null);
        } catch (error) {
          console.error("Failed to fetch order item details:", error);
        }
      };

      fetchOrderDetails();
      fetchOrderItemDetails();
    }
  }, [viewDetails]);

  // Filter returns based on search term
  const filteredReturns = returns?.filter((returnItem) => {
    const searchContent = [
      returnItem.id.toString(),
      returnItem.orderId.toString(),
      returnItem.status,
      returnItem.reason,
    ].join(" ").toLowerCase();
    
    return searchContent.includes(searchTerm.toLowerCase());
  });

  // Handle status change
  const handleStatusChange = (id: number, status: string) => {
    updateReturnMutation.mutate({ id, status });
  };

  // Get status badge color
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return format(date, "MMM dd, yyyy");
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Returns Management</CardTitle>
        <CardDescription>
          View and manage customer returns and refund requests
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search returns..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !returns || returns.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No returns found
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Return ID</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReturns?.map((returnItem) => (
                  <TableRow key={returnItem.id}>
                    <TableCell className="font-medium">#{returnItem.id}</TableCell>
                    <TableCell>#{returnItem.orderId}</TableCell>
                    <TableCell>{formatDate(returnItem.createdAt)}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {returnItem.reason}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                          returnItem.status
                        )}`}
                      >
                        {returnItem.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DialogTrigger asChild>
                            <DropdownMenuItem
                              onClick={() => setViewDetails(returnItem)}
                            >
                              View Details
                            </DropdownMenuItem>
                          </DialogTrigger>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(returnItem.id, "pending")
                            }
                            disabled={returnItem.status === "pending"}
                          >
                            Set as Pending
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(returnItem.id, "approved")
                            }
                            disabled={returnItem.status === "approved"}
                          >
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(returnItem.id, "rejected")
                            }
                            disabled={returnItem.status === "rejected"}
                          >
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusChange(returnItem.id, "completed")
                            }
                            disabled={returnItem.status === "completed"}
                          >
                            Mark as Completed
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Return Details Dialog */}
        <Dialog>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Return Details</DialogTitle>
              <DialogDescription>
                Detailed information about the return request
              </DialogDescription>
            </DialogHeader>

            {viewDetails && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-medium">Return Information</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Return ID:</span>
                        <span className="font-medium">#{viewDetails.id}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Status:</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(
                            viewDetails.status
                          )}`}
                        >
                          {viewDetails.status}
                        </span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{formatDate(viewDetails.createdAt)}</span>
                      </div>
                      <div className="flex justify-between border-b pb-1">
                        <span className="text-muted-foreground">Updated:</span>
                        <span>{formatDate(viewDetails.updatedAt)}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium">Order Information</h3>
                    <div className="mt-2 space-y-2">
                      {orderDetails ? (
                        <>
                          <div className="flex justify-between border-b pb-1">
                            <span className="text-muted-foreground">Order ID:</span>
                            <span className="font-medium">#{orderDetails.id}</span>
                          </div>
                          <div className="flex justify-between border-b pb-1">
                            <span className="text-muted-foreground">Customer:</span>
                            <span>{orderDetails.fullName}</span>
                          </div>
                          <div className="flex justify-between border-b pb-1">
                            <span className="text-muted-foreground">Email:</span>
                            <span className="truncate max-w-[180px]">
                              {orderDetails.email}
                            </span>
                          </div>
                          <div className="flex justify-between border-b pb-1">
                            <span className="text-muted-foreground">Order Date:</span>
                            <span>{formatDate(orderDetails.createdAt)}</span>
                          </div>
                        </>
                      ) : (
                        <div className="py-4 text-center text-muted-foreground">
                          Loading order details...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Item Information</h3>
                  <div className="mt-2">
                    {orderItemDetails ? (
                      <div className="border rounded-md p-3">
                        <div className="flex justify-between">
                          <span className="font-medium">
                            {orderItemDetails.productName}
                          </span>
                          <span>
                            ₹{orderItemDetails.price} × {orderItemDetails.quantity}
                          </span>
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Product ID: {orderItemDetails.productId}
                        </div>
                      </div>
                    ) : (
                      <div className="py-4 text-center text-muted-foreground border rounded-md">
                        Loading item details...
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Return Reason</h3>
                  <div className="mt-2 border rounded-md p-3">
                    <p className="text-sm whitespace-pre-wrap">{viewDetails.reason}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium">Update Status</h3>
                  <div className="mt-2 flex space-x-2">
                    <Select
                      value={viewDetails.status}
                      onValueChange={(value) =>
                        handleStatusChange(viewDetails.id, value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}