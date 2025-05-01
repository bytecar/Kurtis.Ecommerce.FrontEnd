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
import { 
  Loader2, 
  MoreHorizontal, 
  Search, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  PackageOpen, 
  ShoppingBag, 
  CreditCard, 
  Eye,
  TruckIcon,
  CircleDollarSign,
  AlertCircle
} from "lucide-react";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Define return types
type Return = {
  id: number;
  orderId: number;
  orderItemId: number;
  userId: number;
  userName: string;
  userEmail: string;
  productName: string;
  productId: number;
  quantity: number;
  reason: string;
  additionalInfo?: string;
  status: 'pending' | 'approved' | 'rejected' | 'refunded' | 'returned';
  createdAt: Date;
  updatedAt?: Date;
  price: number;
  refundAmount?: number;
  returnMethod?: 'pickup' | 'drop-off';
  returnAddress?: string;
  returnTrackingId?: string;
};

// Helper function to generate random Indian names
const getRandomName = (): string => {
  const firstNames = [
    'Aarav', 'Sanya', 'Arjun', 'Divya', 'Rohan', 'Neha', 'Vikram', 'Priya', 
    'Rahul', 'Anjali', 'Kiran', 'Ananya', 'Raj', 'Aisha', 'Dev', 'Meera',
    'Amit', 'Kavita', 'Vijay', 'Deepika', 'Sunil', 'Pooja', 'Rajiv', 'Sunita'
  ];
  
  const lastNames = [
    'Sharma', 'Patel', 'Singh', 'Kumar', 'Agarwal', 'Verma', 'Joshi', 'Mehta',
    'Kapoor', 'Gupta', 'Shah', 'Das', 'Rao', 'Reddy', 'Nair', 'Iyer',
    'Chauhan', 'Malhotra', 'Jain', 'Chopra', 'Bhatia', 'Venkatesh', 'Banerjee'
  ];
  
  return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
};

// Generate email from name
const getEmail = (name: string): string => {
  const nameParts = name.toLowerCase().split(' ');
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'example.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  
  if (Math.random() > 0.5) {
    return `${nameParts[0]}.${nameParts[1]}@${domain}`;
  } else {
    return `${nameParts[0]}${Math.floor(Math.random() * 100)}@${domain}`;
  }
};

// Generate random product names
const getRandomProduct = (): string => {
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
  
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${colors[Math.floor(Math.random() * colors.length)]} ${productTypes[Math.floor(Math.random() * productTypes.length)]}`;
};

// Generate random return reasons
const getRandomReason = (): string => {
  const reasons = [
    'Wrong size ordered',
    'Item does not match the description',
    'Received damaged product',
    'Quality not as expected',
    'Color different from what was shown',
    'Received incorrect item',
    'Fabric quality is poor',
    'Fit issues',
    'Changed my mind',
    'Found better price elsewhere',
    'Stitching defects',
    'Ordered by mistake',
    'Product arrived too late for event',
    'Allergic reaction to fabric',
    'Missing parts or accessories'
  ];
  
  return reasons[Math.floor(Math.random() * reasons.length)];
};

// Generate random additional information
const getRandomAdditionalInfo = (): string | undefined => {
  if (Math.random() > 0.3) {
    const additionalInfo = [
      'The color is completely different from what was shown in the product image. I received a dark green instead of teal.',
      'The stitching around the neckline came apart after trying it on once.',
      'The fabric quality is very thin and feels cheap compared to what was advertised.',
      'I measured according to the size chart but the item is too small.',
      'I received only the top part, but the set was supposed to include matching bottoms as well.',
      'There are visible stains on the front of the garment that look like they were there before shipping.',
      'The embroidery work is nothing like what was shown in the pictures, it\'s much simpler.',
      'The buttons are missing from the front of the garment.',
      'I ordered this for a wedding but it arrived after the event date despite paying for express delivery.',
      'The dye is bleeding onto other clothes even after following the washing instructions.',
      'The design pattern is different from what was displayed on the website.',
      'I received a different style altogether, not what I ordered.',
      'The beadwork is coming off even without wearing it.'
    ];
    
    return additionalInfo[Math.floor(Math.random() * additionalInfo.length)];
  }
  
  return undefined;
};

// Generate random status with weighted probabilities
const getRandomStatus = (): 'pending' | 'approved' | 'rejected' | 'refunded' | 'returned' => {
  const statuses: Array<'pending' | 'approved' | 'rejected' | 'refunded' | 'returned'> = [
    'pending', 'approved', 'rejected', 'refunded', 'returned'
  ];
  
  const weights = [0.3, 0.2, 0.1, 0.2, 0.2];
  const randomValue = Math.random();
  let cumulativeWeight = 0;
  
  for (let i = 0; i < statuses.length; i++) {
    cumulativeWeight += weights[i];
    if (randomValue <= cumulativeWeight) {
      return statuses[i];
    }
  }
  
  return 'pending';
};

// Generate random date within a range
const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate random price for products
const getRandomPrice = (): number => {
  // Indian ethnic wear price range (in rupees, converted to paisa for integer storage)
  const minPrice = 1000; // ₹1,000
  const maxPrice = 15000; // ₹15,000
  
  // Generate a random price and round to nearest 100
  const price = Math.round(
    (Math.random() * (maxPrice - minPrice) + minPrice) / 100
  ) * 100;
  
  return price;
};

// Generate mock return data
const generateMockReturns = (count: number): Return[] => {
  const returns: Return[] = [];
  
  for (let i = 0; i < count; i++) {
    const userName = getRandomName();
    const userEmail = getEmail(userName);
    const productName = getRandomProduct();
    const price = getRandomPrice();
    const status = getRandomStatus();
    const createdAt = getRandomDate(new Date(2022, 0, 1), new Date());
    
    // Calculate updated date if status is not pending
    const updatedAt = status !== 'pending' 
      ? getRandomDate(createdAt, new Date()) 
      : undefined;
    
    // Calculate refund amount if status is refunded
    const refundAmount = status === 'refunded' || status === 'approved'
      ? Math.round(price * (0.8 + Math.random() * 0.2)) // 80-100% refund
      : undefined;
    
    // Return method if return is approved or returned
    const returnMethod = (status === 'approved' || status === 'returned') 
      ? (Math.random() > 0.5 ? 'pickup' : 'drop-off')
      : undefined;
    
    // Return address if return method is pickup
    const returnAddress = returnMethod === 'pickup'
      ? `${Math.floor(Math.random() * 1000)} ${['Main St', 'Park Ave', 'Gandhi Road', 'Marina Drive', 'Hill View'][Math.floor(Math.random() * 5)]}, ${['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'][Math.floor(Math.random() * 6)]}, India`
      : undefined;
      
    // Tracking ID if the item has been returned
    const returnTrackingId = status === 'returned'
      ? `RT${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}IN`
      : undefined;
    
    returns.push({
      id: 10000 + i,
      orderId: 20000 + i,
      orderItemId: 30000 + i,
      userId: 1000 + i,
      userName,
      userEmail,
      productName,
      productId: 2000 + i,
      quantity: Math.floor(Math.random() * 3) + 1,
      reason: getRandomReason(),
      additionalInfo: getRandomAdditionalInfo(),
      status,
      createdAt,
      updatedAt,
      price,
      refundAmount,
      returnMethod,
      returnAddress,
      returnTrackingId
    });
  }
  
  return returns;
};

// Generate mock data
const mockReturns = generateMockReturns(50);

const ReturnsManagement: React.FC = () => {
  const { toast } = useToast();
  const [returns, setReturns] = useState<Return[]>(mockReturns);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedReturn, setSelectedReturn] = useState<Return | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>('details');
  const [refundAmount, setRefundAmount] = useState<string>('');
  const [returnMethod, setReturnMethod] = useState<string>('pickup');
  const [returnTrackingId, setReturnTrackingId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  
  // Format currency in Indian Rupees
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Filter returns based on search and status filter
  const filteredReturns = returns.filter(returnItem => {
    try {
      // Search term
      const matchesSearch = searchTerm === '' || 
        returnItem.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        returnItem.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        returnItem.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
        returnItem.orderId.toString().includes(searchTerm) ||
        (returnItem.additionalInfo && returnItem.additionalInfo.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || returnItem.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    } catch (error) {
      console.error('Error filtering return:', error, returnItem);
      return false;
    }
  });
  
  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedReturns = filteredReturns.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredReturns.length / itemsPerPage);

  const handleReturnAction = (action: 'view' | 'delete', returnItem: Return) => {
    setSelectedReturn(returnItem);
    
    if (action === 'view') {
      setActiveTab('details');
      
      // Pre-fill the refund amount if there is one
      if (returnItem.refundAmount) {
        setRefundAmount(returnItem.refundAmount.toString());
      } else {
        // Default to full refund
        setRefundAmount(returnItem.price.toString());
      }
      
      // Pre-fill return method
      if (returnItem.returnMethod) {
        setReturnMethod(returnItem.returnMethod);
      }
      
      // Pre-fill tracking ID
      if (returnItem.returnTrackingId) {
        setReturnTrackingId(returnItem.returnTrackingId);
      } else {
        setReturnTrackingId(`RT${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}IN`);
      }
      
      setIsDetailDialogOpen(true);
    } else if (action === 'delete') {
      setIsDeleteDialogOpen(true);
    }
  };

  const handleUpdateReturnStatus = (status: 'approved' | 'rejected' | 'refunded' | 'returned') => {
    if (selectedReturn) {
      let updatedReturn: Return = {
        ...selectedReturn,
        status,
        updatedAt: new Date()
      };
      
      // Add refund amount if applicable
      if (status === 'approved' || status === 'refunded') {
        const refundAmountNum = parseInt(refundAmount);
        if (!isNaN(refundAmountNum)) {
          updatedReturn.refundAmount = refundAmountNum;
        }
      }
      
      // Add return method and address if applicable
      if (status === 'approved') {
        updatedReturn.returnMethod = returnMethod as 'pickup' | 'drop-off';
        
        if (returnMethod === 'pickup') {
          updatedReturn.returnAddress = selectedReturn.returnAddress || 
            `${Math.floor(Math.random() * 1000)} Main St, Mumbai, India`;
        }
      }
      
      // Add tracking ID if applicable
      if (status === 'returned') {
        updatedReturn.returnTrackingId = returnTrackingId || 
          `RT${Math.floor(Math.random() * 10000000).toString().padStart(7, '0')}IN`;
      }
      
      // Update the return in the state
      const updatedReturns = returns.map(item => 
        item.id === selectedReturn.id ? updatedReturn : item
      );
      
      setReturns(updatedReturns);
      
      toast({
        title: `Return ${status}`,
        description: `The return request has been marked as ${status}.`,
      });
      
      setIsDetailDialogOpen(false);
    }
  };

  const handleDeleteReturn = () => {
    if (selectedReturn) {
      // Remove the return from the state
      setReturns(returns.filter(item => item.id !== selectedReturn.id));
      
      toast({
        title: "Return deleted",
        description: "The return request has been deleted successfully.",
      });
      
      setIsDeleteDialogOpen(false);
    }
  };

  // Get status badge with appropriate color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-blue-500">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'refunded':
        return <Badge className="bg-green-500">Refunded</Badge>;
      case 'returned':
        return <Badge className="bg-purple-500">Returned</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <TruckIcon className="h-4 w-4 text-blue-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'refunded':
        return <CircleDollarSign className="h-4 w-4 text-green-500" />;
      case 'returned':
        return <PackageOpen className="h-4 w-4 text-purple-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Returns Management</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter return requests by different criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by order ID, product, customer or reason..."
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
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Return Requests</CardTitle>
            <div className="text-sm text-muted-foreground">
              {filteredReturns.length} requests found
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
                    <TableHead>Order ID</TableHead>
                    <TableHead>Product</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedReturns.map((returnItem) => (
                    <TableRow key={returnItem.id}>
                      <TableCell className="font-medium">
                        #{returnItem.orderId}
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {returnItem.productName}
                        <div className="text-xs text-muted-foreground">
                          Qty: {returnItem.quantity}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{returnItem.userName}</div>
                          <div className="text-sm text-muted-foreground">{returnItem.userEmail}</div>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {returnItem.reason}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(returnItem.price)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(returnItem.status)}
                          {getStatusBadge(returnItem.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {format(returnItem.createdAt, 'MMM d, yyyy')}
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
                            <DropdownMenuItem onClick={() => handleReturnAction('view', returnItem)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleReturnAction('delete', returnItem)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Request
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
            Showing {filteredReturns.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, filteredReturns.length)} of {filteredReturns.length} results
          </div>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage >= totalPages}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Return Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Return Request Details</DialogTitle>
            <DialogDescription>
              View and manage return request
            </DialogDescription>
          </DialogHeader>
          {selectedReturn && (
            <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="process" disabled={selectedReturn.status !== 'pending'}>
                  Process Return
                </TabsTrigger>
                <TabsTrigger value="tracking" disabled={selectedReturn.status !== 'approved' && selectedReturn.status !== 'returned'}>
                  Tracking
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 py-4">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">Order #{selectedReturn.orderId}</h3>
                    <div className="text-sm text-muted-foreground">
                      Return requested on {format(selectedReturn.createdAt, 'PPP')}
                    </div>
                  </div>
                  <div>{getStatusBadge(selectedReturn.status)}</div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-b py-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Product</h4>
                    <p className="font-medium">{selectedReturn.productName}</p>
                    <p className="text-sm">Quantity: {selectedReturn.quantity}</p>
                    <p className="text-sm">Price: {formatCurrency(selectedReturn.price)}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Customer</h4>
                    <p className="font-medium">{selectedReturn.userName}</p>
                    <p className="text-sm">{selectedReturn.userEmail}</p>
                    <p className="text-sm">User ID: {selectedReturn.userId}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Return Reason</h4>
                  <div className="p-3 border rounded-md bg-muted/30">
                    <p>{selectedReturn.reason}</p>
                  </div>
                </div>
                
                {selectedReturn.additionalInfo && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Additional Information</h4>
                    <div className="p-3 border rounded-md bg-muted/30">
                      <p>{selectedReturn.additionalInfo}</p>
                    </div>
                  </div>
                )}
                
                {selectedReturn.status !== 'pending' && selectedReturn.updatedAt && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Processing Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Status Updated</p>
                        <p>{format(selectedReturn.updatedAt, 'PPP')}</p>
                      </div>
                      
                      {selectedReturn.refundAmount && (
                        <div>
                          <p className="text-sm text-muted-foreground">Refund Amount</p>
                          <p className="font-medium">{formatCurrency(selectedReturn.refundAmount)}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {selectedReturn.status === 'pending' && (
                  <div className="flex flex-col md:flex-row gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => setActiveTab('process')}
                    >
                      Process Return
                    </Button>
                    <Button 
                      variant="destructive" 
                      className="flex-1"
                      onClick={() => handleUpdateReturnStatus('rejected')}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject Return
                    </Button>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="process" className="space-y-4 py-4">
                <h3 className="font-semibold text-lg">Process Return Request</h3>
                
                <div className="space-y-2">
                  <Label htmlFor="refundAmount">Refund Amount</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">₹</span>
                    <Input
                      id="refundAmount"
                      type="number"
                      value={refundAmount}
                      onChange={(e) => setRefundAmount(e.target.value)}
                      placeholder="Enter refund amount"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Original price: {formatCurrency(selectedReturn.price)}
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="returnMethod">Return Method</Label>
                  <Select
                    value={returnMethod}
                    onValueChange={setReturnMethod}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select return method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pickup">Pickup from customer</SelectItem>
                      <SelectItem value="drop-off">Customer drop-off</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {returnMethod === 'pickup' && (
                  <div className="space-y-2">
                    <Label htmlFor="pickupAddress">Pickup Address</Label>
                    <Textarea
                      id="pickupAddress"
                      defaultValue={selectedReturn.returnAddress || `${selectedReturn.userName}\n123 Main Street\nMumbai, Maharashtra\nIndia - 400001`}
                      rows={3}
                    />
                  </div>
                )}
                
                {returnMethod === 'drop-off' && (
                  <div className="p-4 border rounded-md bg-muted/30">
                    <h4 className="font-medium">Drop-off Instructions</h4>
                    <p className="text-sm mt-1">
                      Customer will drop off the item at one of our store locations. Once received, update the status to "Returned" and process the refund.
                    </p>
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setActiveTab('details')}
                  >
                    Back to Details
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => handleUpdateReturnStatus('approved')}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Approve Return
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="tracking" className="space-y-4 py-4">
                <h3 className="font-semibold text-lg">Return Tracking</h3>
                
                {selectedReturn.status === 'approved' && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="trackingId">Tracking ID</Label>
                      <Input
                        id="trackingId"
                        value={returnTrackingId}
                        onChange={(e) => setReturnTrackingId(e.target.value)}
                        placeholder="Enter tracking ID"
                      />
                    </div>
                    
                    <div className="border rounded-md p-4 bg-muted/30">
                      <h4 className="font-medium">Return Status</h4>
                      <p className="text-sm mt-1">
                        Return has been approved. {returnMethod === 'pickup' ? 'The pickup has been scheduled.' : 'Customer will drop off the item at one of our store locations.'}
                      </p>
                      <p className="text-sm mt-2">
                        Once the item is received, mark it as "Returned" and process the refund.
                      </p>
                    </div>
                    
                    <Button 
                      className="w-full"
                      onClick={() => handleUpdateReturnStatus('returned')}
                    >
                      <PackageOpen className="mr-2 h-4 w-4" />
                      Mark as Returned
                    </Button>
                  </>
                )}
                
                {selectedReturn.status === 'returned' && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Tracking ID</p>
                        <p className="font-medium">{selectedReturn.returnTrackingId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Return Method</p>
                        <p className="font-medium capitalize">{selectedReturn.returnMethod}</p>
                      </div>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-green-50 dark:bg-green-950/20 text-green-800 dark:text-green-300 mt-2">
                      <h4 className="font-medium flex items-center">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Return Completed
                      </h4>
                      <p className="text-sm mt-1">
                        The item has been returned successfully.
                      </p>
                    </div>
                    
                    {selectedReturn.status === 'returned' && !selectedReturn.refundAmount && (
                      <div className="space-y-2 mt-4">
                        <Label htmlFor="refundAmount">Refund Amount</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">₹</span>
                          <Input
                            id="refundAmount"
                            type="number"
                            value={refundAmount}
                            onChange={(e) => setRefundAmount(e.target.value)}
                            placeholder="Enter refund amount"
                          />
                        </div>
                        <Button 
                          className="w-full mt-2"
                          onClick={() => handleUpdateReturnStatus('refunded')}
                        >
                          <CircleDollarSign className="mr-2 h-4 w-4" />
                          Process Refund
                        </Button>
                      </div>
                    )}
                    
                    {selectedReturn.refundAmount && (
                      <div className="border rounded-md p-4 bg-blue-50 dark:bg-blue-950/20 text-blue-800 dark:text-blue-300 mt-2">
                        <h4 className="font-medium flex items-center">
                          <CircleDollarSign className="mr-2 h-4 w-4" />
                          Refund Processed
                        </h4>
                        <p className="text-sm mt-1">
                          A refund of {formatCurrency(selectedReturn.refundAmount)} has been processed.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDetailDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Return Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Return Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this return request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedReturn && (
            <div className="my-4 space-y-2">
              <div>
                <span className="font-medium">Order:</span> #{selectedReturn.orderId}
              </div>
              <div>
                <span className="font-medium">Product:</span> {selectedReturn.productName}
              </div>
              <div>
                <span className="font-medium">Customer:</span> {selectedReturn.userName}
              </div>
              <div>
                <span className="font-medium">Status:</span> {selectedReturn.status}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteReturn}>Delete Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReturnsManagement;