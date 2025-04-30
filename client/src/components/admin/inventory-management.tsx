import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Product, Inventory } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ProductForm } from "@/components/products/product-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
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
import { Loader2, Search, Edit, MoreHorizontal, Plus, Package, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sizes = ["XS", "S", "M", "L", "XL", "XXL"];

export function InventoryManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isManageInventoryOpen, setIsManageInventoryOpen] = useState(false);
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

  // Filter products
  const filteredProducts = products
    ? products.filter((product) => {
        let matchesCategory = true;
        if (filterCategory !== "all") {
          matchesCategory = product.category === filterCategory;
        }
        
        let matchesSearch = true;
        if (searchQuery) {
          matchesSearch = 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  // Get unique categories for filtering
  const categories = products
    ? Array.from(new Set(products.map((product) => product.category)))
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
          </TabsList>
          
          {activeTab === "products" && (
            <Button onClick={() => setIsAddProductOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
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
                          <TableCell>{product.brand}</TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
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
    </>
  );
}
