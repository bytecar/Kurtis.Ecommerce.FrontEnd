import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MoreHorizontal, Search, Star, Trash2, MessageSquareText, CheckCircle, XCircle } from "lucide-react";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";

// Types for rating management
type Rating = {
  id: number;
  userId: number;
  userName: string;
  userEmail: string;
  productId: number;
  productName: string;
  rating: number;
  comment: string;
  createdAt: Date;
  status: 'pending' | 'approved' | 'rejected';
};

// Function to generate fake product names
const getRandomProductName = (): string => {
  const productTypes = [
    'Silk Saree', 'Cotton Kurti', 'Embroidered Lehenga', 'Wedding Sherwani', 
    'Formal Kurta', 'Designer Blouse', 'Chikankari Dress', 'Printed Dupatta',
    'Banarasi Saree', 'Anarkali Suit', 'Patiala Salwar', 'Bandhani Scarf',
    'Traditional Dhoti', 'Handloom Fabric', 'Jacquard Shawl', 'Phulkari Stole'
  ];
  
  const adjectives = [
    'Elegant', 'Traditional', 'Handcrafted', 'Designer', 'Premium', 'Luxury',
    'Ethnic', 'Festive', 'Royal', 'Classic', 'Vibrant', 'Exclusive'
  ];
  
  const colors = [
    'Red', 'Blue', 'Green', 'Purple', 'Pink', 'Yellow', 'Orange', 'Turquoise',
    'Gold', 'Silver', 'Maroon', 'Teal', 'Navy', 'Magenta', 'Coral'
  ];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const productType = productTypes[Math.floor(Math.random() * productTypes.length)];
  
  return `${adjective} ${color} ${productType}`;
};

// Function to generate fake user names
const getRandomUserName = (): string => {
  const firstNames = [
    'Aarav', 'Sanya', 'Arjun', 'Divya', 'Rohan', 'Neha', 'Vikram', 'Priya', 
    'Rahul', 'Anjali', 'Kiran', 'Ananya', 'Raj', 'Aisha', 'Dev', 'Meera'
  ];
  
  const lastNames = [
    'Sharma', 'Patel', 'Singh', 'Kumar', 'Agarwal', 'Verma', 'Joshi', 'Mehta',
    'Kapoor', 'Gupta', 'Shah', 'Das', 'Rao', 'Reddy', 'Nair', 'Iyer'
  ];
  
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  
  return `${firstName} ${lastName}`;
};

// Generate random email based on name
const getRandomEmail = (name: string): string => {
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'example.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  const username = name.toLowerCase().replace(' ', '.') + Math.floor(Math.random() * 100);
  
  return `${username}@${domain}`;
};

// Function to generate random comments (review text)
const getRandomComment = (): string => {
  const comments = [
    "Absolutely love the quality and finish of this product. The material feels premium and the design is just stunning. Definitely worth every penny spent!",
    "The colors are vibrant and exactly as shown in the pictures. Fits perfectly and received many compliments when I wore it to a recent wedding.",
    "Good product overall, but the stitching could be better in some areas. The color and design are beautiful though.",
    "This exceeded my expectations! The design is intricate and the material is so comfortable to wear. Will definitely buy more from this brand.",
    "The fabric quality is excellent, but the color is slightly different from what was shown online. Still happy with my purchase.",
    "Perfect for festive occasions! The embroidery work is exquisite and the fit is just right. Shipping was quick too.",
    "Beautiful design but the sizing runs a bit large. Had to get it altered but now it fits perfectly.",
    "Amazing craftsmanship and attention to detail. This traditional piece has become my favorite for special occasions.",
    "The product looks even better in person than in the photos. The handwork is beautiful and the material is premium quality.",
    "Decent quality but took longer than expected to arrive. The color is gorgeous though and exactly what I wanted.",
    "Stunning piece! The intricate details and the quality of fabric make it stand out. Received countless compliments when I wore it.",
    "Good value for money. The material is comfortable and the design is traditional yet contemporary.",
    "The embellishments are beautifully done and the piece has a royal look to it. Perfect for wedding functions!",
    "Nice product but the color faded a bit after the first wash. Still looks good though and gets compliments.",
    "Exceptional quality and craftsmanship. The traditional design elements are perfectly balanced with modern aesthetics."
  ];
  
  return comments[Math.floor(Math.random() * comments.length)];
};

// Function to generate a random rating
const getRandomRating = (): number => {
  // Weighted distribution towards higher ratings (3-5 stars more common)
  const ratings = [1, 2, 3, 3, 4, 4, 4, 5, 5, 5, 5, 5];
  return ratings[Math.floor(Math.random() * ratings.length)];
};

// Function to generate random status
const getRandomStatus = (): 'pending' | 'approved' | 'rejected' => {
  const statuses: Array<'pending' | 'approved' | 'rejected'> = ['pending', 'approved', 'rejected'];
  const weights = [0.2, 0.7, 0.1]; // 20% pending, 70% approved, 10% rejected
  
  const randomValue = Math.random();
  let cumulativeWeight = 0;
  
  for (let i = 0; i < statuses.length; i++) {
    cumulativeWeight += weights[i];
    if (randomValue <= cumulativeWeight) {
      return statuses[i];
    }
  }
  
  return 'approved';
};

// Function to generate a random date within a range
const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate mock ratings data
const generateMockRatings = (count: number): Rating[] => {
  const ratings: Rating[] = [];
  
  for (let i = 0; i < count; i++) {
    const userName = getRandomUserName();
    const userEmail = getRandomEmail(userName);
    const productName = getRandomProductName();
    
    ratings.push({
      id: i + 1,
      userId: i + 100,  // Fake user ID
      userName: userName,
      userEmail: userEmail,
      productId: i + 200,  // Fake product ID
      productName: productName,
      rating: getRandomRating(),
      comment: getRandomComment(),
      createdAt: getRandomDate(new Date(2022, 0, 1), new Date()),
      status: getRandomStatus()
    });
  }
  
  return ratings;
};

// Generate mock data
const mockRatings = generateMockRatings(50);

const RatingManagement: React.FC = () => {
  const { toast } = useToast();
  const [ratings, setRatings] = useState<Rating[]>(mockRatings);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<Rating | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

  // Filter ratings based on search term and filters
  const filteredRatings = ratings.filter(rating => {
    // Search term
    const matchesSearch = 
      rating.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rating.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = statusFilter === 'all' || rating.status === statusFilter;
    
    // Rating filter
    const matchesRating = ratingFilter === 'all' || rating.rating.toString() === ratingFilter;
    
    return matchesSearch && matchesStatus && matchesRating;
  });

  const handleRatingAction = (action: 'view' | 'delete', rating: Rating) => {
    setSelectedRating(rating);
    if (action === 'view') {
      setIsDetailDialogOpen(true);
    } else if (action === 'delete') {
      setIsDeleteDialogOpen(true);
    }
  };

  const handleUpdateRatingStatus = (status: 'approved' | 'rejected') => {
    if (selectedRating) {
      // Update the rating status in the local state
      const updatedRatings = ratings.map(rating => 
        rating.id === selectedRating.id 
          ? { ...rating, status } 
          : rating
      );
      
      setRatings(updatedRatings);
      
      toast({
        title: `Rating ${status}`,
        description: `The rating has been ${status} successfully.`,
      });
      
      setIsDetailDialogOpen(false);
    }
  };

  const handleDeleteRating = () => {
    if (selectedRating) {
      // Remove the rating from the local state
      setRatings(ratings.filter(rating => rating.id !== selectedRating.id));
      
      toast({
        title: "Rating deleted",
        description: "The rating has been deleted successfully.",
      });
      
      setIsDeleteDialogOpen(false);
    }
  };

  // Helper function to render stars based on rating
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  // Helper function for status badge colors
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Rating & Review Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter reviews by different criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by product, user or comment..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={(value) => setStatusFilter(value)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={ratingFilter}
              onValueChange={(value) => setRatingFilter(value)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Rating" />
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Ratings & Reviews</CardTitle>
            <div className="text-sm text-muted-foreground">
              {filteredRatings.length} reviews found
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Comment Preview</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRatings.slice(0, 10).map((rating) => (
                    <TableRow key={rating.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {rating.productName}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{rating.userName}</div>
                          <div className="text-sm text-muted-foreground">{rating.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex">
                          {renderStars(rating.rating)}
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {rating.comment}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(rating.status)}
                      </TableCell>
                      <TableCell>
                        {format(rating.createdAt, 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleRatingAction('view', rating)}>
                              <MessageSquareText className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleRatingAction('delete', rating)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Review
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
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Showing 1 to 10 of {filteredRatings.length} results
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </CardFooter>
      </Card>

      {/* Rating Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Review Details</DialogTitle>
            <DialogDescription>
              Review and manage customer feedback
            </DialogDescription>
          </DialogHeader>
          {selectedRating && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedRating.productName}</h3>
                    <div className="flex mt-1">
                      {renderStars(selectedRating.rating)}
                      <span className="ml-2 text-sm font-medium">{selectedRating.rating} out of 5</span>
                    </div>
                  </div>
                  <div className="mt-1">
                    {getStatusBadge(selectedRating.status)}
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Review Comment</Label>
                <div className="p-4 border rounded-md bg-muted/30">
                  <p>{selectedRating.comment}</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Customer Information</Label>
                <div className="flex flex-col">
                  <span><span className="font-medium">Name:</span> {selectedRating.userName}</span>
                  <span><span className="font-medium">Email:</span> {selectedRating.userEmail}</span>
                  <span><span className="font-medium">Date Posted:</span> {format(selectedRating.createdAt, 'PPP')}</span>
                </div>
              </div>
              
              {selectedRating.status === 'pending' && (
                <div className="space-y-2">
                  <Label>Moderation Actions</Label>
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1"
                      onClick={() => handleUpdateRatingStatus('approved')}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => handleUpdateRatingStatus('rejected')}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Rating Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedRating && (
            <div className="my-4 space-y-2">
              <div className="font-medium">{selectedRating.productName}</div>
              <div className="flex">
                {renderStars(selectedRating.rating)}
              </div>
              <div className="text-sm text-muted-foreground truncate">{selectedRating.comment}</div>
              <div className="text-sm">by {selectedRating.userName}</div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteRating}>Delete Review</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RatingManagement;