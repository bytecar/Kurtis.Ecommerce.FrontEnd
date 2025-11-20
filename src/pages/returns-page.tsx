import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Order, OrderItem } from "@/shared/schema";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertCircle, 
  ChevronLeft, 
  Loader2, 
  PackageCheck, 
  PackageX 
} from "lucide-react";
import { ReturnsAPI } from "../services/returns.service";

// Return form schema
// Define return reasons
export const returnReasons = [
  "Damaged on arrival",
  "Wrong size ordered",
  "Item does not match description",
  "Color different from what was shown",
  "Quality not as expected",
  "Received incorrect item",
  "Found better price elsewhere",
  "Changed my mind"
];

export const returnFormSchema = z.object({
  orderId: z.number(),
  orderItemId: z.number(),
  returnReason: z.string().min(1, "Please select a reason for return"),
  reason: z.string().min(10, "Please provide more details about the return reason"),
});

export type ReturnFormValues = z.infer<typeof returnFormSchema>;

export default function ReturnsPage() {
  const [location] = useLocation();
  const { toast } = useToast();
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  
  // Extract order ID from URL if present
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1] || "");
    const orderId = params.get("orderId");
    if (orderId) {
      setSelectedOrder(parseInt(orderId));
    }
    
    document.title = "Return an Item | Kurtis & More";
  }, [location]);
  
  // Fetch user's orders
  const { 
    data: orders, 
    isLoading: isOrdersLoading,
  } = useQuery<Order[]>({
    queryKey: ["/api/orders/user"],
  });
  
  // Fetch selected order items
  const { 
    data: orderItems, 
    isLoading: isItemsLoading,
  } = useQuery<OrderItem[]>({
    queryKey: [`/api/orders/${selectedOrder}/items`],
    enabled: !!selectedOrder,
  });
  
  // Initialize return form
  const form = useForm<ReturnFormValues>({
    resolver: zodResolver(returnFormSchema),
    defaultValues: {
      orderId: selectedOrder || 0,
      orderItemId: 0,
      returnReason: "",
      reason: "",
    },
  });
  
  // Update form values when selectedOrder changes
  useEffect(() => {
    if (selectedOrder) {
      form.setValue("orderId", selectedOrder);
    }
  }, [selectedOrder, form]);
  
  // Submit return request mutation
  const submitReturnMutation = useMutation({
      mutationFn: async (data: { orderId: number, orderItemId: number, reason: string }) => {
      const res = await ReturnsAPI.getReturn(data.orderId);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Return request submitted",
        description: "Your return request has been submitted successfully. We'll process it soon.",
      });
      form.reset();
      setSelectedOrder(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit return request",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Handle form submission
  const onSubmit = (data: ReturnFormValues) => {
    // Combine returnReason and reason for API submission
    const submitData = {
      orderId: data.orderId,
      orderItemId: data.orderItemId,
      reason: `${data.returnReason}: ${data.reason}`
    };
    
    submitReturnMutation.mutate(submitData);
  };
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="mb-6">
        <Link href="/orders">
          <a className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-2">
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back to Orders
          </a>
        </Link>
        <h1 className="text-3xl font-serif font-bold">Return an Item</h1>
        <p className="text-muted-foreground">
          Request a return for an item you purchased
        </p>
      </div>
      
      <div className="space-y-8">
        {/* Return Policy Information */}
        <Card>
          <CardHeader>
            <CardTitle>Return Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 text-blue-800 p-2 rounded">
                <PackageCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">30-Day Return Window</h3>
                <p className="text-sm text-muted-foreground">
                  You can return items within 30 days of delivery. Items must be unworn, undamaged, and in original packaging.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-red-100 text-red-800 p-2 rounded">
                <PackageX className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-medium mb-1">Non-Returnable Items</h3>
                <p className="text-sm text-muted-foreground">
                  Customized items, intimate wear, and sale items marked as final sale cannot be returned.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Return Form */}
        <Card>
          <CardHeader>
            <CardTitle>Return Request Form</CardTitle>
            <CardDescription>
              Fill in the details to initiate a return
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Order Selection */}
                <FormField
                  control={form.control}
                  name="orderId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Order</FormLabel>
                      <Select
                        disabled={isOrdersLoading || !!selectedOrder}
                        onValueChange={(value) => {
                          field.onChange(parseInt(value));
                          setSelectedOrder(parseInt(value));
                        }}
                        defaultValue={field.value.toString()}
                        value={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an order" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {orders?.filter(order => order.status === "delivered").map((order) => (
                            <SelectItem key={order.id} value={order.id.toString()}>
                              Order #{order.id} - {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "N/A"}
                            </SelectItem>
                          ))}
                          {orders && orders.filter(order => order.status === "delivered").length === 0 && (
                            <SelectItem value="none" disabled>
                              No eligible orders found
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Only delivered orders are eligible for returns
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Show Order Items if an order is selected */}
                {selectedOrder && (
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Product</TableHead>
                          <TableHead>Size</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Select</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isItemsLoading ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4">
                              <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                            </TableCell>
                          </TableRow>
                        ) : orderItems && orderItems.length > 0 ? (
                          orderItems.map((item) => (
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
                                  <span>Product #{item.productId}</span>
                                </div>
                              </TableCell>
                              <TableCell>{item.size}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>₹{item.price}</TableCell>
                              <TableCell>
                                <input
                                  type="radio"
                                  name="orderItemId"
                                  className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                                  value={item.id}
                                  onChange={() => form.setValue("orderItemId", item.id)}
                                />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                              No items found for this order
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
                
                {/* Return Reason Type */}
                <FormField
                  control={form.control}
                  name="returnReason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Return</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a reason for your return" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Return Reasons</SelectLabel>
                            {returnReasons.map(reason => (
                              <SelectItem key={reason} value={reason}>
                                {reason}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Additional Return Details */}
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Details</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide more details about your return"
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Provide as much detail as possible to help us process your return quickly
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  disabled={!selectedOrder || form.getValues("orderItemId") === 0 || submitReturnMutation.isPending}
                >
                  {submitReturnMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Submit Return Request'
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {/* Return FAQs */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-1">How long do returns take to process?</h3>
              <p className="text-sm text-muted-foreground">
                Once we receive your returned item, it typically takes 3-5 business days to process the return and initiate a refund.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Will I get a refund for the shipping cost?</h3>
              <p className="text-sm text-muted-foreground">
                Shipping costs are refunded only if the return is due to our error (wrong item, defective product, etc.).
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-1">Can I exchange instead of returning?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, you can request an exchange for a different size or color. Please mention this in your return reason.
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              For more information, please see our complete <a href="#" className="text-primary underline">Return Policy</a> or <a href="#" className="text-primary underline">contact Customer Support</a>.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
