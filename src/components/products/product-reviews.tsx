import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Review, insertReviewSchema } from "@/shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { StarRating } from "@/components/products/star-rating";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ProductReviewsProps {
  productId: number;
  className?: string;
}

const reviewSchema = insertReviewSchema.extend({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Review must be at least 10 characters").max(500),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

export function ProductReviews({ productId, className }: ProductReviewsProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);

  // Fetch reviews for this product
  const { data: reviews, isLoading } = useQuery<Review[]>({
    queryKey: [`/api/products/${productId}/reviews`],
    enabled: !!productId,
  });

  // Initialize form
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      productId,
      userId: user?.id || 0,
      rating: 5,
      comment: "",
    },
  });

  // Create review mutation
  const submitReviewMutation = useMutation({
    mutationFn: async (data: ReviewFormValues) => {
      const res = await apiRequest("POST", "/api/reviews", data);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/products/${productId}/reviews`] });
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback!",
      });
      setShowForm(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit review",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Calculate average rating
  const avgRating = reviews?.length
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  // Handle form submission
  const onSubmit = (data: ReviewFormValues) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please log in to submit a review",
        variant: "destructive",
      });
      return;
    }

    submitReviewMutation.mutate({
      ...data,
      userId: user.id,
      productId,
    });
  };

  return (
    <div className={className}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold">Customer Reviews</h2>
        {user && !showForm && (
          <Button
            onClick={() => setShowForm(true)}
            variant="outline"
          >
            Write a Review
          </Button>
        )}
      </div>

      {/* Review summary */}
      {!isLoading && reviews && reviews.length > 0 && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="text-center md:border-r md:pr-6 md:mr-6">
              <div className="text-4xl font-bold mb-1">{avgRating.toFixed(1)}</div>
              <StarRating rating={avgRating} size="lg" />
              <div className="text-sm text-muted-foreground mt-1">
                Based on {reviews.length} reviews
              </div>
            </div>

            <div className="flex-1 w-full">
              {/* Rating distribution */}
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = reviews.filter(r => r.rating === rating).length;
                const percentage = reviews.length ? (count / reviews.length) * 100 : 0;

                return (
                  <div key={rating} className="flex items-center mb-1">
                    <div className="w-12 text-sm mr-2">{rating} stars</div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                      <div
                        className="bg-amber-400 h-2.5 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-sm w-10 text-right">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Review form */}
      {showForm && (
        <div className="bg-gray-50 p-6 rounded-lg mb-8">
          <h3 className="text-lg font-medium mb-4">Write Your Review</h3>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <FormControl>
                      <StarRating
                        rating={field.value}
                        size="lg"
                        interactive
                        onRatingChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Review</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your experience with this product..."
                        className="resize-none min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Your review will help other customers make better purchase decisions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-3 justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitReviewMutation.isPending}
                >
                  {submitReviewMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Review'
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}

      {/* Review list */}
      {isLoading ? (
        <div className="space-y-4">
          {Array(3).fill(0).map((_, index) => (
            <div key={index} className="border-b pb-4 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : reviews && reviews.length > 0 ? (
        <div className="space-y-6">
          {reviews.map((review) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex justify-between mb-2">
                <StarRating rating={review.rating} size="sm" />
                <span className="text-sm text-muted-foreground">
                  {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                Verified Purchaser
              </p>
              <p className="text-sm">{review.comment}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p>No reviews yet. Be the first to review this product!</p>
          {user && !showForm && (
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
              className="mt-4"
            >
              Write a Review
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
