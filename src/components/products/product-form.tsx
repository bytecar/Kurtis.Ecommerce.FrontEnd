import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { insertProductSchema, Product } from "@/shared/schema";
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
import { ProductsAPI } from "../../services/products.service";
import { BrandsAPI } from "../../services/brands.service";
import { CategoriesAPI } from "../../services/categories.service";

type ProductFormValues = z.infer<typeof insertProductSchema>;

interface ProductFormProps {
  onSuccess?: () => void;
  product?: Product; // For editing existing product
}

export function ProductForm({ onSuccess, product }: ProductFormProps) {
  const { toast } = useToast();

  // Fetch brands and categories
  const { data: brandsData } = useQuery({
    queryKey: ["/api/brands"],
    queryFn: async () => {
      const res = await BrandsAPI.getAllBrands();
      return await res.data.json();
    }
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const res = await CategoriesAPI.getAllCategories();
      return await res.data.json();
    }
  });

  // Initialize form with default values or existing product data
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(insertProductSchema),
    defaultValues: product ? {
      name: product.name,
      description: product.description,
      price: product.price,
      discountedPrice: product.discountedPrice ?? 0,
      brandId: product.brandId,
      categoryId: product.categoryId,
      gender: product.gender,
      imageUrls: product.imageUrls,
      tempImageUrl: "",
      id: product.id,
      sizes: product.sizes || [],
      averageRating: product.averageRating || 0,
      ratingCount: product.ratingCount || 0,
      featured: product.featured || false,
      isNew: product.isNew || false,
    } : {
      name: "",
      description: "",
      price: 0,
      discountedPrice: 0,
      brandId: 0,
      categoryId: 0,
      gender: "women",
      imageUrls: [],
      tempImageUrl: "",
      sizes: [],
      averageRating: 0,
      ratingCount: 0,
      featured: false,
      isNew: false,
    },
  });

  const tempImageUrl = form.watch("tempImageUrl");

  // Create/update product mutation
  const productMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      // Omit tempImageUrl as it's only for the form
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { tempImageUrl, ...productData } = data;

      if (product) {
        // Update existing product
        const res = await ProductsAPI.updateProduct(product.id, productData);
        return await res.data.json();
      } else {
        // Create new product
        const res = await ProductsAPI.createProduct(productData);
        return await res.data.json();
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
    if (!url) return;
    const images = form.getValues("imageUrls");
    if (!images.includes(url)) {
      form.setValue("imageUrls", [...images, url]);
    }
    form.setValue("tempImageUrl", ""); // clear input
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
            name="brandId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {brandsData?.map((brand: any) => (
                      <SelectItem key={brand.id} value={String(brand.id)}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                      const value = e.target.value === "" ? 0 : Number(e.target.value);
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
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value ? String(field.value) : undefined}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categoriesData?.map((category: any) => (
                      <SelectItem key={category.id} value={String(category.id)}>
                        {category.name}
                      </SelectItem>
                    ))}
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
                value={form.watch("tempImageUrl") || ""}
                onChange={(e) => {
                  form.setValue("tempImageUrl", e.target.value);
                }}
              />
              <Button
                type="button"
                onClick={handleAddImage}
                disabled={!Boolean(tempImageUrl)}
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
