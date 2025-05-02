import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product, Inventory, Collection } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ProductForm } from "@/components/products/product-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, Edit, MoreHorizontal, Plus, Package, AlertTriangle, Tags, Trash, Check, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import * as z from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

// Form schema for creating/editing collections
const collectionFormSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  imageUrl: z.string().optional().nullable(),
  active: z.boolean().default(true),
  startDate: z.date().nullable().optional(),
  endDate: z.date().nullable().optional(),
});

type CollectionFormValues = z.infer<typeof collectionFormSchema>;

// Form schema for adding product to collection
const productCollectionFormSchema = z.object({
  productIds: z.array(z.number()).min(1, 'At least one product must be selected'),
});

type ProductCollectionFormValues = z.infer<typeof productCollectionFormSchema>;

export function InventoryManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isManageInventoryOpen, setIsManageInventoryOpen] = useState(false);
  const [isAddCollectionOpen, setIsAddCollectionOpen] = useState(false);
  const [isEditCollectionOpen, setIsEditCollectionOpen] = useState(false);
  const [isManageCollectionOpen, setIsManageCollectionOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("products");

  // Fetch all products
  const {
    data: products,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Fetch inventory for selected product
  const {
    data: inventoryItems,
    isLoading: isInventoryLoading,
    refetch: refetchInventory,
  } = useQuery<Inventory[]>({
    queryKey: [`/api/inventory/product/${selectedProduct?.id}`],
    enabled: !!selectedProduct && isManageInventoryOpen,
  });
  
  // Fetch all collections
  const {
    data: collections,
    isLoading: isCollectionsLoading,
    isError: isCollectionsError,
    refetch: refetchCollections,
  } = useQuery<Collection[]>({
    queryKey: ["/api/collections"],
  });
  
  // Fetch collections for a product
  const {
    data: productCollections,
    isLoading: isProductCollectionsLoading,
    refetch: refetchProductCollections,
  } = useQuery<Collection[]>({
    queryKey: [`/api/products/${selectedProduct?.id}/collections`],
    enabled: !!selectedProduct && isManageCollectionOpen,
  });
  
  // Fetch products in a collection
  const {
    data: collectionProducts,
    isLoading: isCollectionProductsLoading,
    refetch: refetchCollectionProducts,
  } = useQuery<Product[]>({
    queryKey: [`/api/collections/${selectedCollection?.id}/products`],
    enabled: !!selectedCollection && isManageCollectionOpen,
  });

  // Update inventory mutation
  const updateInventoryMutation = useMutation({
    mutationFn: async ({
      inventoryId,
      quantity,
    }: {
      inventoryId: number;
      quantity: number;
    }) => {
      await apiRequest("PATCH", `/api/inventory/${inventoryId}`, { quantity });
    },
    onSuccess: () => {
      refetchInventory();
      toast({
        title: "Inventory updated",
        description: "The inventory has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create inventory mutation
  const createInventoryMutation = useMutation({
    mutationFn: async ({
      productId,
      size,
      quantity,
    }: {
      productId: number;
      size: string;
      quantity: number;
    }) => {
      await apiRequest("POST", "/api/inventory", {
        productId,
        size,
        quantity,
      });
    },
    onSuccess: () => {
      refetchInventory();
      toast({
        title: "Size added",
        description: "The new size has been added to inventory.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Create collection mutation
  const createCollectionMutation = useMutation({
    mutationFn: async (collection: CollectionFormValues) => {
      await apiRequest("POST", "/api/collections", collection);
    },
    onSuccess: () => {
      refetchCollections();
      toast({
        title: "Collection created",
        description: "The collection has been created successfully.",
      });
      setIsAddCollectionOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Update collection mutation
  const updateCollectionMutation = useMutation({
    mutationFn: async ({
      id,
      collection,
    }: {
      id: number;
      collection: Partial<CollectionFormValues>;
    }) => {
      await apiRequest("PATCH", `/api/collections/${id}`, collection);
    },
    onSuccess: () => {
      refetchCollections();
      toast({
        title: "Collection updated",
        description: "The collection has been updated successfully.",
      });
      setIsEditCollectionOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Delete collection mutation
  const deleteCollectionMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/collections/${id}`);
    },
    onSuccess: () => {
      refetchCollections();
      toast({
        title: "Collection deleted",
        description: "The collection has been deleted successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Add product to collection mutation
  const addProductToCollectionMutation = useMutation({
    mutationFn: async ({ 
      productId, 
      collectionId 
    }: { 
      productId: number; 
      collectionId: number;
    }) => {
      await apiRequest("POST", `/api/products/${productId}/collections/${collectionId}`, {});
    },
    onSuccess: () => {
      if (selectedProduct) {
        refetchProductCollections();
      }
      if (selectedCollection) {
        refetchCollectionProducts();
      }
      toast({
        title: "Product added to collection",
        description: "The product has been added to the collection successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  
  // Remove product from collection mutation
  const removeProductFromCollectionMutation = useMutation({
    mutationFn: async ({ 
      productId, 
      collectionId 
    }: { 
      productId: number; 
      collectionId: number;
    }) => {
      await apiRequest("DELETE", `/api/products/${productId}/collections/${collectionId}`);
    },
    onSuccess: () => {
      if (selectedProduct) {
        refetchProductCollections();
      }
      if (selectedCollection) {
        refetchCollectionProducts();
      }
      toast({
        title: "Product removed from collection",
        description: "The product has been removed from the collection successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter products
  const filteredProducts = products
    ? products.filter((product) => {
        let matchesCategory = true;
        if (filterCategory !== "all") {
          // Use categoryId for filtering instead of category
          matchesCategory = product.categoryId.toString() === filterCategory;
        }
        
        let matchesSearch = true;
        if (searchQuery) {
          // Get brand and category names from their IDs
          const brandName = product.brandId ? product.brandId.toString() : '';
          const categoryName = product.categoryId ? product.categoryId.toString() : '';
          
          matchesSearch = 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            brandName.includes(searchQuery) ||
            categoryName.includes(searchQuery) ||
            product.id.toString().includes(searchQuery);
        }
        
        return matchesCategory && matchesSearch;
      })
    : [];

  // Handle inventory update
  const handleUpdateInventory = (inventoryId: number, quantity: number) => {
    updateInventoryMutation.mutate({ inventoryId, quantity });
  };

  // Handle adding new size to inventory
  const handleAddSize = (size: string, quantity: number) => {
    if (selectedProduct) {
      createInventoryMutation.mutate({
        productId: selectedProduct.id,
        size,
        quantity,
      });
    }
  };

  // Get available sizes that are not yet in inventory
  const getAvailableSizes = () => {
    if (!inventoryItems) return sizes;
    const existingSizes = inventoryItems.map((item) => item.size);
    return sizes.filter((size) => !existingSizes.includes(size));
  };

  // Manage inventory for a product
  const openInventoryManager = (product: Product) => {
    setSelectedProduct(product);
    setIsManageInventoryOpen(true);
  };

  // Edit a product
  const openProductEditor = (product: Product) => {
    setSelectedProduct(product);
    setIsEditProductOpen(true);
  };

  // Manage product collections
  const openProductCollections = (product: Product) => {
    setSelectedProduct(product);
    setIsManageCollectionOpen(true);
  };
  
  // Edit a collection
  const openCollectionEditor = (collection: Collection) => {
    setSelectedCollection(collection);
    setIsEditCollectionOpen(true);
  };
  
  // Manage collection products
  const openCollectionProducts = (collection: Collection) => {
    setSelectedCollection(collection);
    setIsManageCollectionOpen(true);
  };
  
  // Add product to collection
  const handleAddProductToCollection = (productId: number, collectionId: number) => {
    addProductToCollectionMutation.mutate({ productId, collectionId });
  };
  
  // Remove product from collection
  const handleRemoveProductFromCollection = (productId: number, collectionId: number) => {
    removeProductFromCollectionMutation.mutate({ productId, collectionId });
  };

  // Get unique category IDs for filtering
  const categories = products
    ? Array.from(new Set(products.map((product) => product.categoryId.toString())))
    : [];

  if (isProductsLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isProductsError) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-medium">Failed to load products</h3>
          <p className="text-muted-foreground">There was an error loading products. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Tabs defaultValue="products" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="add-product">Add New Product</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
          </TabsList>
          
          {activeTab === "products" && (
            <Button onClick={() => setIsAddProductOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          )}
          
          {activeTab === "collections" && (
            <Button onClick={() => setIsAddCollectionOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Collection
            </Button>
          )}
        </div>

        <TabsContent value="products" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>
                Manage products and inventory levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-12 border rounded-md">
                  <h3 className="text-lg font-medium mb-1">No products found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery || filterCategory !== "all"
                      ? "Try adjusting your filters"
                      : "Add your first product to get started"}
                  </p>
                  <Button className="mt-4" onClick={() => setActiveTab("add-product")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </div>
              ) : (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product ID</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">#{product.id}</TableCell>
                          <TableCell>
                            <div className="w-10 h-10 rounded overflow-hidden">
                              <img
                                src={Array.isArray(product.imageUrls) && product.imageUrls.length > 0
                                  ? product.imageUrls[0]
                                  : "https://placehold.co/40x40"}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </TableCell>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.brandId}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {product.categoryId.toString()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>₹{product.discountedPrice || product.price}</span>
                              {product.discountedPrice && (
                                <span className="text-sm text-muted-foreground line-through">
                                  ₹{product.price}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openProductEditor(product)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Product
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openInventoryManager(product)}>
                                  <Package className="mr-2 h-4 w-4" />
                                  Manage Inventory
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => openProductCollections(product)}>
                                  <Tags className="mr-2 h-4 w-4" />
                                  Manage Collections
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="add-product" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Add New Product</CardTitle>
              <CardDescription>
                Create a new product and add it to your inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProductForm
                onSuccess={() => {
                  setActiveTab("products");
                  queryClient.invalidateQueries({ queryKey: ["/api/products"] });
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collections" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Collections Management</CardTitle>
              <CardDescription>
                Create and manage product collections
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isCollectionsLoading ? (
                <div className="flex justify-center items-center h-96">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : isCollectionsError ? (
                <div className="flex justify-center items-center h-96">
                  <div className="text-center">
                    <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <h3 className="text-lg font-medium">Failed to load collections</h3>
                    <p className="text-muted-foreground">There was an error loading collections. Please try again later.</p>
                  </div>
                </div>
              ) : collections && collections.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Products</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {collections.map((collection) => (
                        <TableRow key={collection.id}>
                          <TableCell className="font-medium">#{collection.id}</TableCell>
                          <TableCell>{collection.name}</TableCell>
                          <TableCell className="max-w-xs truncate">{collection.description}</TableCell>
                          <TableCell>
                            <Badge variant={collection.active ? "outline" : "secondary"}>
                              {collection.active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openCollectionProducts(collection)}
                            >
                              Manage Products
                            </Button>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openCollectionEditor(collection)}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Edit Collection
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => deleteCollectionMutation.mutate(collection.id)}
                                  className="text-destructive"
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  Delete Collection
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-12 border rounded-md">
                  <h3 className="text-lg font-medium mb-1">No collections found</h3>
                  <p className="text-muted-foreground mb-4">
                    Add your first collection to group related products together
                  </p>
                  <Button onClick={() => setIsAddCollectionOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Collection
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Product Dialog */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Make changes to the product details
            </DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <ProductForm
              product={selectedProduct}
              onSuccess={() => {
                setIsEditProductOpen(false);
                queryClient.invalidateQueries({ queryKey: ["/api/products"] });
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add Product Dialog */}
      <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
            <DialogDescription>
              Create a new product and add it to your inventory
            </DialogDescription>
          </DialogHeader>
          <ProductForm
            onSuccess={() => {
              setIsAddProductOpen(false);
              queryClient.invalidateQueries({ queryKey: ["/api/products"] });
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Manage Inventory Dialog */}
      <Dialog open={isManageInventoryOpen} onOpenChange={setIsManageInventoryOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Manage Inventory</DialogTitle>
            <DialogDescription>
              {selectedProduct?.name} - Update stock levels for different sizes
            </DialogDescription>
          </DialogHeader>
          
          {isInventoryLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Size</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryItems && inventoryItems.length > 0 ? (
                      inventoryItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.size}</TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              min="0"
                              value={item.quantity}
                              onChange={(e) => {
                                const newQuantity = parseInt(e.target.value);
                                if (!isNaN(newQuantity) && newQuantity >= 0) {
                                  handleUpdateInventory(item.id, newQuantity);
                                }
                              }}
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            <Badge variant={item.quantity > 0 ? "outline" : "destructive"}>
                              {item.quantity > 0 ? "In Stock" : "Out of Stock"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4">
                          No sizes available. Add sizes below.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Add New Size */}
              {getAvailableSizes().length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Add New Size</h3>
                  <div className="flex gap-4">
                    <Select
                      onValueChange={(size) => {
                        if (selectedProduct) {
                          handleAddSize(size, 0);
                        }
                      }}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableSizes().map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Collection Dialog */}
      <Dialog open={isAddCollectionOpen} onOpenChange={setIsAddCollectionOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add New Collection</DialogTitle>
            <DialogDescription>
              Create a new collection to group related products
            </DialogDescription>
          </DialogHeader>
          
          <CollectionForm 
            onSuccess={() => {
              setIsAddCollectionOpen(false);
              queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Collection Dialog */}
      <Dialog open={isEditCollectionOpen} onOpenChange={setIsEditCollectionOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
            <DialogDescription>
              Update collection details
            </DialogDescription>
          </DialogHeader>
          
          {selectedCollection && (
            <CollectionForm 
              collection={selectedCollection}
              onSuccess={() => {
                setIsEditCollectionOpen(false);
                queryClient.invalidateQueries({ queryKey: ["/api/collections"] });
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Manage Collection Products Dialog */}
      <Dialog open={isManageCollectionOpen} onOpenChange={setIsManageCollectionOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct 
                ? `Manage Collections for ${selectedProduct.name}` 
                : selectedCollection 
                  ? `Manage Products in ${selectedCollection.name}` 
                  : 'Manage Collection Products'}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct 
                ? 'Add or remove this product from collections' 
                : 'Add or remove products from this collection'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedProduct && (
            <>
              {isProductCollectionsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="border rounded-md max-h-[400px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Collection Name</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {collections && collections.length > 0 ? (
                          collections.map((collection) => {
                            const isInCollection = productCollections?.some(
                              (pc) => pc.id === collection.id
                            );
                            
                            return (
                              <TableRow key={collection.id}>
                                <TableCell>{collection.name}</TableCell>
                                <TableCell>
                                  <Button
                                    variant={isInCollection ? "destructive" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                      if (isInCollection) {
                                        handleRemoveProductFromCollection(selectedProduct.id, collection.id);
                                      } else {
                                        handleAddProductToCollection(selectedProduct.id, collection.id);
                                      }
                                    }}
                                  >
                                    {isInCollection ? (
                                      <>
                                        <X className="h-4 w-4 mr-2" />
                                        Remove
                                      </>
                                    ) : (
                                      <>
                                        <Check className="h-4 w-4 mr-2" />
                                        Add
                                      </>
                                    )}
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={2} className="text-center py-4">
                              No collections available.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              )}
            </>
          )}
          
          {selectedCollection && (
            <>
              {isCollectionProductsLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="relative max-h-[400px] overflow-y-auto">
                    <div className="sticky top-0 z-10 bg-background pb-2">
                      <Input
                        placeholder="Search products..."
                        className="mb-2"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Brand</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => {
                              const isInCollection = collectionProducts?.some(
                                (cp) => cp.id === product.id
                              );
                              
                              return (
                                <TableRow key={product.id}>
                                  <TableCell className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded overflow-hidden">
                                      <img
                                        src={Array.isArray(product.imageUrls) && product.imageUrls.length > 0
                                          ? product.imageUrls[0]
                                          : "https://placehold.co/40x40"}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <span>{product.name}</span>
                                  </TableCell>
                                  <TableCell>{product.brandId}</TableCell>
                                  <TableCell>
                                    <Button
                                      variant={isInCollection ? "destructive" : "outline"}
                                      size="sm"
                                      onClick={() => {
                                        if (isInCollection) {
                                          handleRemoveProductFromCollection(product.id, selectedCollection.id);
                                        } else {
                                          handleAddProductToCollection(product.id, selectedCollection.id);
                                        }
                                      }}
                                    >
                                      {isInCollection ? (
                                        <>
                                          <X className="h-4 w-4 mr-2" />
                                          Remove
                                        </>
                                      ) : (
                                        <>
                                          <Check className="h-4 w-4 mr-2" />
                                          Add
                                        </>
                                      )}
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={3} className="text-center py-4">
                                No products found.
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

// Collection Form Component
function CollectionForm({ 
  collection, 
  onSuccess 
}: { 
  collection?: Collection;
  onSuccess: () => void;
}) {
  const { toast } = useToast();
  
  const form = useForm<CollectionFormValues>({
    resolver: zodResolver(collectionFormSchema),
    defaultValues: collection ? {
      name: collection.name,
      description: collection.description,
      imageUrl: collection.imageUrl || '',
      active: collection.active || true,
      startDate: collection.startDate ? new Date(collection.startDate) : null,
      endDate: collection.endDate ? new Date(collection.endDate) : null,
    } : {
      name: '',
      description: '',
      imageUrl: '',
      active: true,
      startDate: null,
      endDate: null,
    },
  });

  const createCollectionMutation = useMutation({
    mutationFn: async (values: CollectionFormValues) => {
      return await apiRequest('POST', '/api/collections', values);
    },
    onSuccess: () => {
      toast({
        title: 'Collection created',
        description: 'The collection was created successfully.',
      });
      form.reset();
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const updateCollectionMutation = useMutation({
    mutationFn: async (values: CollectionFormValues) => {
      if (!collection) return;
      return await apiRequest('PATCH', `/api/collections/${collection.id}`, values);
    },
    onSuccess: () => {
      toast({
        title: 'Collection updated',
        description: 'The collection was updated successfully.',
      });
      onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (values: CollectionFormValues) => {
    if (collection) {
      updateCollectionMutation.mutate(values);
    } else {
      createCollectionMutation.mutate(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collection Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter collection name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Enter collection description" 
                  className="min-h-24" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter image URL (optional)" {...field} value={field.value || ''} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <FormLabel>Active</FormLabel>
                <FormDescription>
                  Make this collection visible on the store
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end pt-4">
          <Button 
            type="submit"
            disabled={
              createCollectionMutation.isPending || 
              updateCollectionMutation.isPending
            }
          >
            {(createCollectionMutation.isPending || updateCollectionMutation.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {collection ? 'Update Collection' : 'Create Collection'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
