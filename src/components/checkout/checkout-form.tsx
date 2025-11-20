import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { insertOrderSchema } from "@/shared/schema";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { OrdersAPI } from "../../services/orders.service";

// Extended schema for checkout form
const checkoutFormSchema = insertOrderSchema.extend({
  email: z.string().email(),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  state: z.string().min(2, "State must be at least 2 characters"),
  postalCode: z.string().min(6, "Postal code must be at least 6 characters"),
  phone: z.string().min(10, "Phone must be at least 10 characters"),
  paymentMethod: z.enum(["cod", "card", "upi"]),
  total: z.number().min(0),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

export function CheckoutForm() {
  const { user } = useAuth();
  const { items, totalPrice, totalItems, clearCart } = useCart();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with user data if available
  const form = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      userId: user?.id,
      email: user?.email || "",
      fullName: user?.fullName || "",
      address: "",
      city: "",
      state: "",
      postalCode: "",
      phone: "",
      total: totalPrice,
      paymentMethod: "cod",
    },
  });

  // Order creation mutation
  const createOrderMutation = useMutation({
    mutationFn: async (data: CheckoutFormValues) => {
          // First create order
          const orderRes = await OrdersAPI.createOrder({
              ...data,
              total: totalPrice >= 999 ? totalPrice : totalPrice + 99, // Add shipping if below threshold
          });      
      const order = await orderRes.json();
      
      // Then create order items
          const orderItemPromises = items.map((item) => {
              return OrdersAPI.createOrderItems({
          orderId: order.id,
          productId: item.product.id,
          size: item.size,
          quantity: item.quantity,
          price: item.product.discountedPrice || item.product.price,
        });
      });
      
      await Promise.all(orderItemPromises);
      return order;
    },
    onSuccess: (order) => {
      // Clear cart and navigate to success page
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order placed successfully!",
        description: `Your order #${order.id} has been placed successfully.`,
      });
      navigate(`/order/${order.id}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to place order",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    
    // If cart is empty, don't proceed
    if (items.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty. Please add some items before checkout.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    // Simulate payment processing
    setTimeout(() => {
      createOrderMutation.mutate(data);
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="md:col-span-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-medium mb-4">Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john.doe@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="9876543210" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St, Apt 4B" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Mumbai" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="Maharashtra" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="400001" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-medium mb-4">Payment Method</h2>
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="cod">Cash on Delivery</SelectItem>
                        <SelectItem value="card">Credit/Debit Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {form.watch("paymentMethod") === "card" && (
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <FormLabel>Card Number</FormLabel>
                    <Input placeholder="4111 1111 1111 1111" disabled />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FormLabel>Expiry</FormLabel>
                      <Input placeholder="MM/YY" disabled />
                    </div>
                    <div>
                      <FormLabel>CVV</FormLabel>
                      <Input placeholder="123" disabled />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground md:col-span-2">
                    Note: Card payment is not available in demo mode. Please use Cash on Delivery.
                  </p>
                </div>
              )}
              
              {form.watch("paymentMethod") === "upi" && (
                <div className="mt-4">
                  <FormLabel>UPI ID</FormLabel>
                  <Input placeholder="yourname@upi" disabled />
                  <p className="text-sm text-muted-foreground mt-2">
                    Note: UPI payment is not available in demo mode. Please use Cash on Delivery.
                  </p>
                </div>
              )}
            </Card>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                className="min-w-[150px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
      
      <div>
        <Card className="p-6">
          <h2 className="text-xl font-medium mb-4">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item) => (
              <div key={`${item.product.id}-${item.size}`} className="flex justify-between">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">Size: {item.size}, Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p>₹{(item.product.discountedPrice || item.product.price) * item.quantity}</p>
                </div>
              </div>
            ))}
            
            <Separator />
            
            <div className="flex justify-between">
              <span>Subtotal ({totalItems} items)</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{totalPrice >= 999 ? 'Free' : '₹99'}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-medium text-lg">
              <span>Total</span>
              <span>₹{totalPrice >= 999 ? totalPrice : totalPrice + 99}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
