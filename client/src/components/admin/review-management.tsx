import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Review } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StarRating } from "@/components/products/star-rating";
import { Loader2, Search, Trash2, Eye, AlertTriangle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";

export function ReviewManagement() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterRating, setFilterRating] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  // Fetch all reviews
  const {
    data: reviews,
    isLoading,
    isError,
  } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  // Fetch product details for selected review
  const {
    data: product,
    isLoading: isProductLoading,
  } = useQuery({
    queryKey: [`/api/products/${selectedReview?.productId}`],
    enabled: !!selectedReview,
  });

  // Fetch user details for selected review
  const {
    data: user,
    isLoading: isUserLoading,
  } = useQuery({
    queryKey: [`/api/users/${selectedReview?.userId}`],
    enabled: !!selectedReview,
  });

  // Delete review mutation
  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: number) => {
      await apiRequest("DELETE", `/api/reviews/${reviewId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({
        title: "Review deleted",
        description: "The review has been deleted successfully.",
      });
      setDeleteDialogOpen(false);
      setSelectedReview(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Filter reviews
  const filteredReviews = reviews
    ? reviews.filter((review) => {
        let matchesRating = true;
        if (filterRating !== "all") {
          matchesRating = review.rating === parseInt(filterRating);
        }
        
        let matchesSearch = true;
        if (searchQuery) {
          matchesSearch = 
            review.comment?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            review.id.toString().includes(searchQuery);
        }
        
        return matchesRating && matchesSearch;
      })
    : [];

  // Calculate pagination
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(filteredReviews.length / ITEMS_PER_PAGE);
  const paginatedReviews = filteredReviews.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  // Handle review deletion
  const handleDeleteClick = (review: Review) => {
    setSelectedReview(review);
    setDeleteDialogOpen(true);
  };

  // Handle review view
  const handleViewClick = (review: Review) => {
    setSelectedReview(review);
    setViewDialogOpen(true);
  };

  // Handle delete confirmation
  const confirmDelete = () => {
    if (selectedReview) {
      deleteReviewMutation.mutate(selectedReview.id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-medium">Failed to load reviews</h3>
          <p className="text-muted-foreground">There was an error loading reviews. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Review Management</CardTitle>
          <CardDescription>
            Manage customer reviews and ratings for products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1); // Reset to first page when searching
                }}
              />
            </div>
            <Select
              value={filterRating}
              onValueChange={(value) => {
                setFilterRating(value);
                setPage(1); // Reset to first page when filtering
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filteredReviews.length === 0 ? (
            <div className="text-center py-12 border rounded-md">
              <h3 className="text-lg font-medium mb-1">No reviews found</h3>
              <p className="text-muted-foreground">
                {searchQuery || filterRating !== "all"
                  ? "Try adjusting your filters"
                  : "There are no reviews yet"}
              </p>
            </div>
          ) : (
            <>
              <div className="border rounded-md">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Review ID</TableHead>
                      <TableHead>Product ID</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Comment</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedReviews.map((review) => (
                      <TableRow key={review.id}>
                        <TableCell className="font-medium">#{review.id}</TableCell>
                        <TableCell>#{review.productId}</TableCell>
                        <TableCell>
                          <StarRating rating={review.rating} size="sm" />
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate">{review.comment}</p>
                        </TableCell>
                        <TableCell>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleViewClick(review)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteClick(review)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-6">
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <Button
                          key={pageNum}
                          variant={pageNum === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                          className="w-9"
                        >
                          {pageNum}
                        </Button>
                      )
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleteReviewMutation.isPending}
            >
              {deleteReviewMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Review Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Review ID</h3>
                  <p>#{selectedReview.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Date</h3>
                  <p>{new Date(selectedReview.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Rating</h3>
                  <StarRating rating={selectedReview.rating} size="md" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">User</h3>
                  {isUserLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : user ? (
                    <p>{user.fullName} ({user.email})</p>
                  ) : (
                    <Badge variant="outline">User not found</Badge>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Product</h3>
                {isProductLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : product ? (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded overflow-hidden">
                      <img 
                        src={Array.isArray(product.imageUrls) && product.imageUrls.length > 0 
                          ? product.imageUrls[0] 
                          : "https://placehold.co/100x100"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.brand}</p>
                    </div>
                  </div>
                ) : (
                  <Badge variant="outline">Product not found</Badge>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Comment</h3>
                <Textarea 
                  value={selectedReview.comment || 'No comment provided'} 
                  readOnly 
                  className="resize-none min-h-[100px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setViewDialogOpen(false)}
            >
              Close
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setViewDialogOpen(false);
                if (selectedReview) {
                  handleDeleteClick(selectedReview);
                }
              }}
            >
              Delete Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
