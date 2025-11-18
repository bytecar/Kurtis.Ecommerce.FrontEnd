import { useEffect } from "react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Order, OrderItem } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  AlertCircle, 
  ChevronLeft, 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  FileClock, 
  Loader2 
} from "lucide-react";

// Status badge component
const OrderStatusBadge = ({ status }: { status: string }) => {
  let color = "";
  let icon = null;
  
  switch (status) {
    case "pending":
      color = "bg-yellow-100 text-yellow-800";
      icon = <Clock className="w-4 h-4 mr-1" />;
      break;
    case "processing":
      color = "bg-blue-100 text-blue-800";
      icon = <Package className="w-4 h-4 mr-1" />;
      break;
    case "shipped":
      color = "bg-indigo-100 text-indigo-800";
      icon = <Truck className="w-4 h-4 mr-1" />;
      break;
    case "delivered":
      color = "bg-green-100 text-green-800";
      icon = <CheckCircle2 className="w-4 h-4 mr-1" />;
      break;
    case "cancelled":
      color = "bg-red-100 text-red-800";
      icon = <AlertCircle className="w-4 h-4 mr-1" />;
      break;
    default:
      color = "bg-gray-100 text-gray-800";
  }
  
  return (
    <div className={`${color} px-3 py-1 rounded-full inline-flex items-center text-sm font-medium`}>
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </div>
  );
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: number }>();
  const orderId = id;
  
  // Fetch order details
  const { 
    data: order, 
    isLoading: isOrderLoading,
    isError: isOrderError
  } = useQuery<Order>({
    queryKey: [`/api/orders/${orderId}`],
    enabled: !isNaN(orderId),
  });
  
  // Fetch order items
  const { 
    data: orderItems, 
    isLoading: isItemsLoading,
    isError: isItemsError
  } = useQuery<OrderItem[]>({
    queryKey: [`/api/orders/${orderId}/items`],
    enabled: !isNaN(orderId),
  });
  
  // Update page title when order data is available
  useEffect(() => {
    if (order) {
      document.title = `Order #${order.id} | Kurtis & More`;
    } else {
      document.title = "Order Details | Kurtis & More";
    }
  }, [order]);
  
  if (isOrderLoading || isItemsLoading) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  if (isOrderError || isItemsError || !order) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-5 h-5" />
            <h2 className="text-lg font-medium">Order not found</h2>
          </div>
          <p>The order you're looking for doesn't exist or you don't have permission to view it.</p>
          <Button variant="outline" className="mt-4" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Link href="/orders">
            <a className="inline-flex items-center hover:text-primary">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to Orders
            </a>
          </Link>
        </div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold">Order #{order.id}</h1>
            <p className="text-muted-foreground">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Order Items */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              {orderItems && orderItems.length > 0 ? (
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orderItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded overflow-hidden">
                                <img 
                                  src="https://images.unsplash.com/photo-1612722432474-b971cdcea546?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8d29tZW4ncyBpbmRpYW4gZXRobmljIGRyZXNzZXN8fHx8fHwxNzE4NTU3Njk5&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=1080"
                                  alt="Product"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <div className="font-medium">Product #{item.productId}</div>
                                <Link href={`/product/${item.productId}`}>
                                  <a className="text-sm text-primary">View Product</a>
                                </Link>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{item.size}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">₹{item.price * item.quantity}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  No items found for this order.
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground">
                <p className="font-medium text-foreground">{order.fullName}</p>
                <p>{order.address}</p>
                <p>{order.city}, {order.state} {order.postalCode}</p>
                <p>Phone: {order.phone}</p>
                <p>Email: {order.email}</p>
              </div>
            </CardContent>
          </Card>
          
          {/* Return or Cancel Options */}
          <Card>
            <CardHeader>
              <CardTitle>Order Actions</CardTitle>
              <CardDescription>
                Need to make changes to your order?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {order.status === "pending" && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Clock className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-yellow-800">Your order is being processed</h3>
                      <p className="text-sm text-yellow-700">You can cancel your order while it's being processed.</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-3 border-yellow-300 hover:bg-yellow-100 text-yellow-800"
                  >
                    Cancel Order
                  </Button>
                </div>
              )}
              
              {order.status === "delivered" && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FileClock className="w-5 h-5 text-gray-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium">Need to return or exchange an item?</h3>
                      <p className="text-sm text-muted-foreground">You can initiate a return within 30 days of delivery.</p>
                    </div>
                  </div>
                  <Link href={`/returns?orderId=${order.id}`}>
                    <Button
                      variant="outline"
                      className="mt-3"
                    >
                      Initiate Return
                    </Button>
                  </Link>
                </div>
              )}
              
              {(order.status === "processing" || order.status === "shipped") && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Package className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800">Your order is on its way</h3>
                      <p className="text-sm text-blue-700">
                        {order.status === "processing" ? "Your order is being prepared for shipping." : "Your order has been shipped and is on its way to you."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {order.status === "cancelled" && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-red-800">This order has been cancelled</h3>
                      <p className="text-sm text-red-700">If you have any questions about this cancellation, please contact customer support.</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{order.total - (order.total >= 999 ? 0 : 99)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{order.total >= 999 ? 'Free' : '₹99'}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>₹{order.total}</span>
              </div>
              <div className="text-sm text-muted-foreground text-right">
                Including taxes
              </div>
            </CardContent>
          </Card>
          
          {/* Payment Details */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment Method</span>
                <Badge variant="outline">Cash on Delivery</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Payment Status</span>
                <Badge variant="outline" className="bg-green-100 text-green-800">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Paid
                </Badge>
              </div>
            </CardContent>
          </Card>
          
          {/* Need Help? */}
          <Card>
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Have questions about your order? Our customer support team is here to help.
              </p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
