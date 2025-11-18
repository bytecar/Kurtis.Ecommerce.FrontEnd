import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { InsertProduct, Product, Inventory } from "@shared/schema";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Loader2, PlusCircle, Trash, Save, Upload, Edit, Package, PackageOpen, FileSpreadsheet } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { queryClient, apiRequest } from "@/lib/queryClient";

// Create a product form schema
const productFormSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  brandId: z.number().min(2, "Brand name must be at least 2 characters"),
  gender: z.string().min(1, "Please select a gender"),
  categoryId: z.number().min(1, "Please select a category"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.coerce.number().positive("Price must be positive"),
  discountedPrice: z.coerce.number().nullable().optional(),
  imageUrls: z.array(z.string()).min(1, "Add at least one image")
});

type ProductFormValues = z.infer<typeof productFormSchema>;

// Create an inventory form schema
const inventoryFormSchema = z.object({
  size: z.string().min(1, "Size is required"),
  quantity: z.coerce.number().min(0, "Quantity cannot be negative"),
  productId: z.number().optional()
});

type InventoryFormValues = z.infer<typeof inventoryFormSchema>;

// Create a bulk update schema
const bulkUpdateSchema = z.object({
  selectedIds: z.array(z.number()),
  action: z.enum(["discount", "category", "stock"]),
  discount: z.coerce.number().min(0).max(100).optional(),
  newCategory: z.string().optional(),
  stockChange: z.coerce.number().optional(),
  sizeToUpdate: z.string().optional()
});

type BulkUpdateValues = z.infer<typeof bulkUpdateSchema>;

export default function ProductManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isBulkOpen, setIsBulkOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);
  const [imageUploads, setImageUploads] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Query products
  const { data: products, isLoading: isLoadingProducts } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/products");
      return await res.json();
    }
  });

  // Query inventory for a specific product
  const { data: inventory, isLoading: isLoadingInventory } = useQuery<Inventory[]>({
    queryKey: ["/api/inventory/product", selectedProductId],
    queryFn: async () => {
      if (!selectedProductId) return [];
      const res = await apiRequest("GET", `/api/inventory/product/${selectedProductId}`);
      return await res.json();
    },
    enabled: !!selectedProductId
  });

  // Form for creating/editing products
  const productForm = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      brandId: 0,
      gender: "",
      categoryId: 0,
      description: "",
      price: 0,
      discountedPrice: null,
      imageUrls: []
    }
  });

  // Form for adding/editing inventory
  const inventoryForm = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: {
      size: "",
      quantity: 0,
      productId: undefined
    }
  });

  // Form for bulk updates
  const bulkForm = useForm<BulkUpdateValues>({
    resolver: zodResolver(bulkUpdateSchema),
    defaultValues: {
      selectedIds: [],
      action: "discount",
      discount: 0,
      newCategory: "",
      stockChange: 0,
      sizeToUpdate: ""
    }
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues) => {
      const res = await apiRequest("POST", "/api/products", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      productForm.reset();
      setImageUploads([]);
      setImagePreviewUrls([]);
      setIsOpen(false);
      toast({
        title: "Product Created",
        description: "Product has been created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: ProductFormValues & { id: number }) => {
      const { id, ...productData } = data;
      const res = await apiRequest("PATCH", `/api/products/${id}`, productData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      productForm.reset();
      setEditingProduct(null);
      setImageUploads([]);
      setImagePreviewUrls([]);
      setIsOpen(false);
      toast({
        title: "Product Updated",
        description: "Product has been updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update product",
        variant: "destructive",
      });
    }
  });

  const createInventoryMutation = useMutation({
    mutationFn: async (data: InventoryFormValues) => {
      const res = await apiRequest("POST", "/api/inventory", data);
      return await res.json();
    },
    onSuccess: () => {
      if (selectedProductId) {
        queryClient.invalidateQueries({ queryKey: ["/api/inventory/product", selectedProductId] });
      }
      inventoryForm.reset();
      toast({
        title: "Inventory Updated",
        description: "Product inventory has been updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update inventory",
        variant: "destructive",
      });
    }
  });

  const updateInventoryMutation = useMutation({
    mutationFn: async (data: InventoryFormValues & { id: number }) => {
      const { id, ...inventoryData } = data;
      const res = await apiRequest("PATCH", `/api/inventory/${id}`, inventoryData);
      return await res.json();
    },
    onSuccess: () => {
      if (selectedProductId) {
        queryClient.invalidateQueries({ queryKey: ["/api/inventory/product", selectedProductId] });
      }
      inventoryForm.reset();
      toast({
        title: "Inventory Updated",
        description: "Product inventory has been updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update inventory",
        variant: "destructive",
      });
    }
  });

  const bulkUpdateMutation = useMutation({
    mutationFn: async (data: BulkUpdateValues) => {
      const res = await apiRequest("POST", "/api/products/bulk-update", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      bulkForm.reset();
      setSelectedProducts([]);
      setIsBulkOpen(false);
      toast({
        title: "Bulk Update Completed",
        description: "Selected products have been updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to perform bulk update",
        variant: "destructive",
      });
    }
  });

  // Upload images to server
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newUploads = Array.from(files);
    setIsUploading(true);

    try {
      // Create a FormData instance to send to the server
      const formData = new FormData();
      newUploads.forEach(file => {
        formData.append('images', file);
      });

      // Use fetch directly to send FormData
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include' // Necessary for sending auth cookies
      });

      if (!response.ok) {
        throw new Error('Upload failed: ' + response.statusText);
      }

      const result = await response.json();
      
      // Set image previews with the server-returned URLs
      setImagePreviewUrls(prev => [...prev, ...result.urls]);
      setImageUploads(prev => [...prev, ...newUploads]);
      
      // Update the form with the new image URLs
      const currentUrls = productForm.getValues("imageUrls");
      productForm.setValue("imageUrls", [...currentUrls, ...result.urls]);
      productForm.trigger("imageUrls");
      
      toast({
        title: "Images Uploaded",
        description: `Successfully uploaded ${result.urls.length} images.`,
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Remove an uploaded image
  const removeImage = (index: number) => {
    const newUploads = [...imageUploads];
    newUploads.splice(index, 1);
    setImageUploads(newUploads);

    const newPreviewUrls = [...imagePreviewUrls];
    newPreviewUrls.splice(index, 1);
    setImagePreviewUrls(newPreviewUrls);

    productForm.setValue("imageUrls", newPreviewUrls);
    productForm.trigger("imageUrls");
  };

  // Handle product form submission
  const onProductSubmit = (values: ProductFormValues) => {
    // Image URLs are already uploaded to the server via handleImageUpload
    // and stored in the form values
    
    if (editingProduct) {
      updateProductMutation.mutate({
        ...values,
        id: editingProduct.id
      });
    } else {
      createProductMutation.mutate(values);
    }
  };

  // Handle inventory form submission
  const onInventorySubmit = (values: InventoryFormValues) => {
    if (!selectedProductId) return;
    
    // Check if this size already exists for the product
    const existingInventory = inventory?.find(item => item.size === values.size);
    
    if (existingInventory) {
      // Update existing inventory
      updateInventoryMutation.mutate({
        ...values,
        id: existingInventory.id,
        productId: selectedProductId
      });
    } else {
      // Create new inventory entry
      createInventoryMutation.mutate({
        ...values,
        productId: selectedProductId
      });
    }
  };

  // Handle bulk update form submission
  const onBulkSubmit = (values: BulkUpdateValues) => {
    bulkUpdateMutation.mutate({
      ...values,
      selectedIds: selectedProducts
    });
  };

  // Reset product form when opening the dialog
  const openNewProductDialog = () => {
    productForm.reset();
    setEditingProduct(null);
    setImageUploads([]);
    setImagePreviewUrls([]);
    setIsOpen(true);
  };

  // Set form values when editing a product
  const openEditProductDialog = (product: Product) => {
    setEditingProduct(product);
    
    // Set form values
    productForm.reset({
      name: product.name,
      brandId: product.brandId,
      gender: product.gender,
      categoryId: product.categoryId,
      description: product.description,
      price: product.price,
      discountedPrice: product.discountedPrice,
      imageUrls: Array.isArray(product.imageUrls) ? product.imageUrls : []
    });
    
    // Set image previews
    setImagePreviewUrls(Array.isArray(product.imageUrls) ? product.imageUrls : []);
    setImageUploads([]);
    
    setIsOpen(true);
  };

  // Open inventory dialog for a product
  const openInventoryDialog = (productId: number) => {
    setSelectedProductId(productId);
    inventoryForm.reset();
    setIsInventoryOpen(true);
  };

  // Toggle product selection for bulk updates
  const toggleProductSelection = (productId: number) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    } else {
      setSelectedProducts([...selectedProducts, productId]);
    }
  };

  // Open bulk update sheet
  const openBulkUpdateSheet = () => {
    bulkForm.reset({
      selectedIds: selectedProducts,
      action: "discount",
      discount: 0,
      newCategory: "",
      stockChange: 0,
      sizeToUpdate: ""
    });
    setIsBulkOpen(true);
  };

  // Update bulkForm when selectedProducts changes
  useEffect(() => {
    bulkForm.setValue("selectedIds", selectedProducts);
  }, [selectedProducts, bulkForm]);

  // Gender options for select dropdown
  const genderOptions = [
    { value: "men", label: "Men" },
    { value: "women", label: "Women" },
    { value: "unisex", label: "Unisex" },
    { value: "kids", label: "Kids" }
  ];

  // Category options for select dropdown
  const categoryOptions = [
    { value: "kurta", label: "Kurta" },
    { value: "saree", label: "Saree" },
    { value: "dhoti_set", label: "Dhoti Set" },
    { value: "kurti", label: "Kurti" },
    { value: "palazzo_suit", label: "Palazzo Suit" },
    { value: "sherwani", label: "Sherwani" },
    { value: "indo_western", label: "Indo-Western" },
    { value: "lehenga", label: "Lehenga" },
    { value: "wedding", label: "Wedding Collection" },
    { value: "festival", label: "Festival Collection" }
  ];

  // Standard size options
  const sizeOptions = [
    { value: "XS", label: "XS - Extra Small" },
    { value: "S", label: "S - Small" },
    { value: "M", label: "M - Medium" },
    { value: "L", label: "L - Large" },
    { value: "XL", label: "XL - Extra Large" },
    { value: "XXL", label: "XXL - Double Extra Large" },
    { value: "XXXL", label: "XXXL - Triple Extra Large" },
    { value: "Free", label: "Free Size" }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Product Management</h1>
          <p className="text-muted-foreground">Manage products and inventory</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={openBulkUpdateSheet}
            disabled={selectedProducts.length === 0}
          >
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Bulk Update ({selectedProducts.length})
          </Button>
          <Button onClick={openNewProductDialog}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            View and manage all products in your inventory
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingProducts ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : (
            <div className="border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox 
                        checked={selectedProducts.length > 0 && selectedProducts.length === products?.length}
                        onCheckedChange={(checked) => {
                          if (checked && products) {
                            setSelectedProducts(products.map(p => p.id));
                          } else {
                            setSelectedProducts([]);
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Image</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products && products.length > 0 ? (
                    products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedProducts.includes(product.id)}
                            onCheckedChange={() => toggleProductSelection(product.id)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="h-12 w-12 rounded-md overflow-hidden">
                            <img 
                              src={Array.isArray(product.imageUrls) && product.imageUrls.length > 0 
                                ? product.imageUrls[0] 
                                : "https://placehold.co/100x100?text=No+Image"}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>{product.brandId}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge>                                    
                            {product.categoryId + product.categoryId}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">₹{product.discountedPrice ?? product.price}</span>
                            {product.discountedPrice && (
                              <span className="text-sm text-muted-foreground line-through">₹{product.price}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openEditProductDialog(product)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => openInventoryDialog(product.id)}
                            >
                              <Package className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                        No products found. Add your first product!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Product Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
            <DialogDescription>
              {editingProduct 
                ? "Update product details and inventory" 
                : "Add a new product to your inventory"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...productForm}>
            <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Product Name */}
                <FormField
                  control={productForm.control}
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
                  control={productForm.control}
                  name="brandId"
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

                {/* Gender */}
                <FormField
                  control={productForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {genderOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={productForm.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={String(field.value)}
                        value={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
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
                  control={productForm.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (₹)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Discounted Price */}
                <FormField
                  control={productForm.control}
                  name="discountedPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Discounted Price (₹) (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="0" 
                          step="0.01" 
                          placeholder="Leave empty for no discount"
                          value={field.value !== null ? field.value : ""} 
                          onChange={(e) => {
                            const value = e.target.value;
                            field.onChange(value === "" ? null : parseFloat(value));
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Leave empty if there is no discount
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Description */}
              <FormField
                control={productForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Enter product description"
                        rows={4}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Image Uploads */}
              <FormField
                control={productForm.control}
                name="imageUrls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Images</FormLabel>
                    <FormControl>
                      <div className="space-y-4">
                        {/* File input for image upload */}
                        <div className="flex items-center gap-4">
                          <Label 
                            htmlFor="product-images" 
                            className="cursor-pointer flex items-center gap-2 p-2 border rounded-md hover:bg-accent"
                          >
                            <Upload className="h-4 w-4" />
                            <span>Upload Images</span>
                          </Label>
                          <Input 
                            id="product-images" 
                            type="file"
                            accept="image/*" 
                            multiple 
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={isUploading}
                          />
                          {isUploading && <Loader2 className="h-4 w-4 animate-spin" />}
                        </div>

                        {/* Image preview grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {imagePreviewUrls.map((url, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={url} 
                                alt={`Preview ${index}`} 
                                className="h-24 w-full object-cover rounded-md" 
                              />
                              <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 p-1 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={createProductMutation.isPending || updateProductMutation.isPending}
                >
                  {(createProductMutation.isPending || updateProductMutation.isPending) ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {editingProduct ? "Update Product" : "Save Product"}
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Inventory Management Dialog */}
      <Dialog open={isInventoryOpen} onOpenChange={setIsInventoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Inventory</DialogTitle>
            <DialogDescription>
              Update stock levels for this product
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Current inventory table */}
            <div>
              <h3 className="text-sm font-medium mb-2">Current Inventory</h3>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Size</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoadingInventory ? (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                        </TableCell>
                      </TableRow>
                    ) : inventory && inventory.length > 0 ? (
                      inventory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.size}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>
                            {item.quantity > 5 ? (
                              <Badge className="bg-green-100 text-green-700">
                                In Stock
                              </Badge>
                            ) : item.quantity > 0 ? (
                              <Badge className="bg-yellow-100 text-yellow-700">
                                Low Stock
                              </Badge>
                            ) : (
                              <Badge className="bg-red-100 text-red-700">
                                Out of Stock
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                          No inventory records found for this product.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Form to add/update inventory */}
            <Form {...inventoryForm}>
              <form onSubmit={inventoryForm.handleSubmit(onInventorySubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Size */}
                  <FormField
                    control={inventoryForm.control}
                    name="size"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Size</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {sizeOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Quantity */}
                  <FormField
                    control={inventoryForm.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsInventoryOpen(false)}
                  >
                    Close
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createInventoryMutation.isPending || updateInventoryMutation.isPending}
                  >
                    {(createInventoryMutation.isPending || updateInventoryMutation.isPending) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Update Inventory
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Update Sheet */}
      <Sheet open={isBulkOpen} onOpenChange={setIsBulkOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Bulk Update Products</SheetTitle>
            <SheetDescription>
              Update multiple products at once. {selectedProducts.length} products selected.
            </SheetDescription>
          </SheetHeader>

          <div className="py-6">
            <Form {...bulkForm}>
              <form onSubmit={bulkForm.handleSubmit(onBulkSubmit)} className="space-y-6">
                {/* Action type selection */}
                <FormField
                  control={bulkForm.control}
                  name="action"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Update Action</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="discount">Apply Discount</SelectItem>
                          <SelectItem value="category">Change Category</SelectItem>
                          <SelectItem value="stock">Update Stock</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Conditional fields based on action */}
                {bulkForm.watch("action") === "discount" && (
                  <FormField
                    control={bulkForm.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discount Percentage (%)</FormLabel>
                        <FormControl>
                          <Input type="number" min="0" max="100" {...field} />
                        </FormControl>
                        <FormDescription>
                          Enter a discount percentage. This will calculate and apply the discounted price.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {bulkForm.watch("action") === "category" && (
                  <FormField
                    control={bulkForm.control}
                    name="newCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Category</FormLabel>
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
                            {categoryOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {bulkForm.watch("action") === "stock" && (
                  <>
                    <FormField
                      control={bulkForm.control}
                      name="sizeToUpdate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Size to Update</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sizeOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={bulkForm.control}
                      name="stockChange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Stock Change</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Enter +/- value to adjust stock" 
                              {...field} 
                            />
                          </FormControl>
                          <FormDescription>
                            Enter a positive number to add stock, or a negative number to reduce stock
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                <SheetFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsBulkOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={bulkUpdateMutation.isPending}
                  >
                    {bulkUpdateMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Apply Bulk Update
                      </>
                    )}
                  </Button>
                </SheetFooter>
              </form>
            </Form>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}