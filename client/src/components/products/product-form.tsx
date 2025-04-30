import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertProductSchema, Product } from "@shared/schema";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, X } from "lucide-react";

// Extended product schema for the form
const productFormSchema = insertProductSchema.extend({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  discountedPrice: z.coerce.number().min(0).optional(),
  brand: z.string().min(1, "Brand is required"),
  category: z.string().min(1, "Category is required"),
  gender: z.string().min(1, "Gender is required"),
  imageUrls: z.array(z.string()).min(1, "At least one image is required"),
  tempImageUrl: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  onSuccess?: () => void;
  product?: Product; // For editing existing product
}

export function ProductForm({ onSuccess, product }: ProductFormProps) {
  const { toast } = useToast();
  const [tempImageUrl, setTempImageUrl] = useState("");
  
  // Initialize form with default values or existing product data
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: product ? {
      ...product,
      tempImageUrl: "",
    } : {
      name: "",
      description: "",
      price: 0,
      discountedPrice: 0,
      brand: "",
      category: "",
      gender: "women",
      imageUrls: [],
      tempImageUrl: "",
    },
  });
  
  // Create/update product mutation
  const productMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      // Omit tempImageUrl as it's only for the form
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tempImageUrl, ...productData } = data;
      
      if (product) {
        // Update existing product
        const res = await apiRequest("PATCH", `/api/products/${product.id}`, productData);
        return await res.json();
      } else {
        // Create new product
        const res = await apiRequest("POST", "/api/products", productData);
        return await res.json();
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: product ? "Product updated" : "Product created",
        description: product 
          ? "The product has been updated successfully." 
          : "The product has been added to inventory.",
      });
      form.reset();
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Add image URL to the form
  const handleAddImage = () => {
    const url = form.getValues("tempImageUrl");
    if (url && form.getValues("imageUrls").indexOf(url) === -1) {
      form.setValue("imageUrls", [...form.getValues("imageUrls"), url]);
      form.setValue("tempImageUrl", "");
      setTempImageUrl("");
    }
  };
  
  // Remove image URL from the form
  const handleRemoveImage = (url: string) => {
    form.setValue(
      "imageUrls",
      form.getValues("imageUrls").filter((imageUrl) => imageUrl !== url)
    );
  };
  
  // Handle form submission
  const onSubmit = (data: ProductFormValues) => {
    productMutation.mutate(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Brand */}
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="Enter brand name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Price */}
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    placeholder="Enter price" 
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Discounted Price */}
          <FormField
            control={form.control}
            name="discountedPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Discounted Price (₹)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0" 
                    placeholder="Enter discounted price (optional)" 
                    {...field}
                    value={field.value || ""}
                    onChange={(e) => {
                      const value = e.target.value === "" ? undefined : parseInt(e.target.value);
                      field.onChange(value);
                    }}
                  />
                </FormControl>
                <FormDescription>
                  Leave empty or set to 0 if there's no discount
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Category */}
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="kurtis">Kurtis</SelectItem>
                    <SelectItem value="sarees">Sarees</SelectItem>
                    <SelectItem value="lehengas">Lehengas</SelectItem>
                    <SelectItem value="kurta-sets">Kurta Sets</SelectItem>
                    <SelectItem value="gowns">Gowns</SelectItem>
                    <SelectItem value="pants">Pants</SelectItem>
                    <SelectItem value="tops">Tops</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Gender */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter product description" 
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Image URLs */}
          <div className="md:col-span-2 space-y-4">
            <FormLabel>Product Images</FormLabel>
            <div className="flex space-x-3">
              <Input
                placeholder="Enter image URL"
                value={tempImageUrl}
                onChange={(e) => {
                  setTempImageUrl(e.target.value);
                  form.setValue("tempImageUrl", e.target.value);
                }}
              />
              <Button
                type="button"
                onClick={handleAddImage}
                disabled={!tempImageUrl}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            
            <FormField
              control={form.control}
              name="imageUrls"
              render={() => (
                <FormItem>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {form.getValues("imageUrls").map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Product image ${index + 1}`}
                          className="w-full h-40 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => handleRemoveImage(url)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={productMutation.isPending}
            className="min-w-[120px]"
          >
            {productMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {product ? "Updating..." : "Creating..."}
              </>
            ) : (
              product ? "Update Product" : "Create Product"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
