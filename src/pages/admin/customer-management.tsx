import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
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
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, Loader2, MoreHorizontal, PlusCircle, Search, Trash2, UserCog, UserPlus } from "lucide-react";
import { format } from 'date-fns';
import { UsersAPI } from '../../services/users.service';

// Define user type
type User = {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: string;
  createdAt: Date;
  status: string;
  profilePicture?: string;
  lastLogin?: Date;
  address?: string;
  phoneNumber?: string;
  gender?: string;
  birthdate?: Date;
};

// Generate realistic mock data for demonstration
const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const getRandomStatus = (): 'active' | 'inactive' | 'suspended' => {
  const statuses: Array<'active' | 'inactive' | 'suspended'> = ['active', 'inactive', 'suspended'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

const getRandomRole = (): 'admin' | 'customer' | 'contentManager' => {
  const roles: Array<'admin' | 'customer' | 'contentManager'> = ['admin', 'customer', 'contentManager'];
  const weights = [0.1, 0.8, 0.1]; // 10% admin, 80% customer, 10% content manager
  
  const randomValue = Math.random();
  let cumulativeWeight = 0;
  
  for (let i = 0; i < roles.length; i++) {
    cumulativeWeight += weights[i];
    if (randomValue <= cumulativeWeight) {
      return roles[i];
    }
  }
  
  return 'customer';
};

const getRandomGender = (): string | undefined => {
  const genders = ['male', 'female', 'non-binary', undefined];
  return genders[Math.floor(Math.random() * genders.length)];
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
};

// For realistic names
const firstNames = [
  'Aarav', 'Sanya', 'Arjun', 'Divya', 'Rohan', 'Neha', 'Vikram', 'Priya', 
  'Rahul', 'Anjali', 'Kiran', 'Ananya', 'Raj', 'Aisha', 'Dev', 'Meera',
  'Amit', 'Kavita', 'Vijay', 'Deepika', 'Sunil', 'Pooja', 'Rajiv', 'Sunita'
];

const lastNames = [
  'Sharma', 'Patel', 'Singh', 'Kumar', 'Agarwal', 'Verma', 'Joshi', 'Mehta',
  'Kapoor', 'Gupta', 'Shah', 'Das', 'Rao', 'Reddy', 'Nair', 'Iyer',
  'Chauhan', 'Malhotra', 'Jain', 'Chopra', 'Bhatia', 'Venkatesh', 'Banerjee', 'Chatterjee'
];

const getRandomName = (): string => {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  return `${firstName} ${lastName}`;
};

// Generate avatar URLs based on name
const getAvatarUrl = (name: string, gender?: string): string => {
  // Use realistic avatar generation based on name
  const genderParam = gender === 'male' ? 'men' : gender === 'female' ? 'women' : Math.random() > 0.5 ? 'men' : 'women';
  const randomNum = Math.floor(Math.random() * 100);
  return `https://randomuser.me/api/portraits/${genderParam}/${randomNum}.jpg`;
};

// Generate realistic email
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

// Generate mock users data
const generateMockUsers = (count: number): User[] => {
  const users: User[] = [];
  
  for (let i = 0; i < count; i++) {
    const fullName = getRandomName();
    const gender = getRandomGender();
    const role = getRandomRole();
    const createdAt = getRandomDate(new Date(2020, 0, 1), new Date());
    const lastLogin = Math.random() > 0.2 ? getRandomDate(createdAt, new Date()) : undefined;
    
    users.push({
      id: i + 1,
      username: fullName.toLowerCase().replace(' ', '.'),
      email: getEmail(fullName),
      fullName,
      role,
      createdAt,
      status: getRandomStatus(),
      profilePicture: getAvatarUrl(fullName, gender),
      lastLogin,
      address: Math.random() > 0.3 ? `${Math.floor(Math.random() * 1000)} ${['Main St', 'Park Ave', 'Gandhi Road', 'Marina Drive', 'Hill View'][Math.floor(Math.random() * 5)]}, ${['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'][Math.floor(Math.random() * 6)]}` : undefined,
      phoneNumber: Math.random() > 0.3 ? `+91 ${Math.floor(Math.random() * 10000000000).toString().padStart(10, '0')}` : undefined,
      gender,
      birthdate: Math.random() > 0.4 ? getRandomDate(new Date(1970, 0, 1), new Date(2000, 0, 1)) : undefined,
    });
  }
  
  return users;
};

const CustomerManagement: React.FC = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    password: '',
    role: 'customer',
    status: 'active',
    gender: '',
    address: '',
    phoneNumber: '',
  });

  // Fetch all users
  const { data: users = [], isLoading, error } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    refetchOnWindowFocus: false,
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: Partial<User> & { password: string }) => {
      const res = await UsersAPI.createUser(userData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: t('admin.userCreated'),
        description: t('admin.userCreatedDescription'),
      });
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (userData: Partial<User>) => {
      if (!selectedUser) return null;
      const res = await UsersAPI.updateUser(selectedUser.id, userData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: t('admin.userUpdated'),
        description: t('admin.userUpdatedDescription'),
      });
      setIsEditDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      const res = await UsersAPI.deleteUser(userId);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: t('admin.userDeleted'),
        description: t('admin.userDeletedDescription'),
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      fullName: '',
      password: '',
      role: 'customer',
      status: 'active',
      gender: '',
      address: '',
      phoneNumber: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateUser = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.fullName) {
      toast({
        title: t('common.validationError'),
        description: t('admin.fillRequiredFields'),
        variant: 'destructive',
      });
      return;
    }
    
    createUserMutation.mutate(formData);
  };

  const handleUpdateUser = () => {
    if (!selectedUser) return;
    
    // Collect form data from input elements
    const fullName = (document.getElementById('fullName') as HTMLInputElement)?.value || selectedUser.fullName;
    const username = (document.getElementById('username') as HTMLInputElement)?.value || selectedUser.username;
    const email = (document.getElementById('email') as HTMLInputElement)?.value || selectedUser.email;
    const phoneNumber = (document.getElementById('phoneNumber') as HTMLInputElement)?.value || selectedUser.phoneNumber;
    const address = (document.getElementById('address') as HTMLInputElement)?.value || selectedUser.address;
    const password = (document.getElementById('resetPassword') as HTMLInputElement)?.value;
    const profilePicture = (document.getElementById('profilePicture') as HTMLInputElement)?.value || selectedUser.profilePicture;
    
    // Get dropdown values
    // For status and role, find radix elements in specific tabs
    const accessTab = document.querySelector('[data-value="access"]')?.parentElement;
    const statusElement = accessTab?.querySelector('[data-value="active"], [data-value="inactive"], [data-value="suspended"]');
    const roleElement = accessTab?.querySelector('[data-value="admin"], [data-value="customer"], [data-value="contentManager"]');
    
    // For gender, we created a hidden input with the selected value
    const genderInput = document.getElementById('gender-value') as HTMLInputElement;
    
    const status = statusElement?.getAttribute('data-value') || selectedUser.status;
    const role = roleElement?.getAttribute('data-value') || selectedUser.role;
    const gender = genderInput?.value || selectedUser.gender;
    
    // Handle birthdate - ensure it's properly processed
    const birthdateEl = document.getElementById('birthdate') as HTMLInputElement;
    let birthdate = selectedUser.birthdate;
    if (birthdateEl && birthdateEl.value) {
      try {
        birthdate = new Date(birthdateEl.value);
      } catch (err) {
        console.error("Failed to parse birthdate", err);
      }
    }
    
    const userData: Partial<User> & { password?: string } = {
      fullName,
      username,
      email,
      profilePicture,
      status,
      role,
      phoneNumber,
      address,
      gender,
      birthdate
    };
    
    // Omit password if it's empty (means no change)
    if (!password) {
      delete userData.password;
    } else {
      userData.password = password;
    }
    
    updateUserMutation.mutate(userData);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id);
    }
  };

  const handleUserAction = (action: 'edit' | 'delete', user: User) => {
    setSelectedUser(user);
    
    if (action === 'edit') {
      setFormData({
        username: user.username,
        email: user.email,
        fullName: user.fullName,
        password: '', // Don't populate password for security
        role: user.role,
        status: user.status,
        gender: user.gender || '',
        address: user.address || '',
        phoneNumber: user.phoneNumber || '',
      });
      setIsEditDialogOpen(true);
    } else if (action === 'delete') {
      setIsDeleteDialogOpen(true);
    }
  };

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    try {
      // Search term
      const matchesSearch = searchTerm === '' || 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Status filter
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      
      // Role filter
      const matchesRole = roleFilter === 'all' || user.role === roleFilter;
      
      return matchesSearch && matchesStatus && matchesRole;
    } catch (error) {
      console.error('Error filtering user:', error, user);
      return false;
    }
  });

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'inactive':
        return 'bg-gray-500';
      case 'suspended':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive">{role}</Badge>;
      case 'contentManager':
        return <Badge variant="secondary">{role}</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  // Format dates for display
  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'Never';
    return format(new Date(date), 'MMM d, yyyy');
  };

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  // Show error state if there was an error loading users
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[400px] gap-4">
        <AlertCircle className="h-16 w-16 text-destructive" />
        <h2 className="text-2xl font-bold">{t('common.errorOccurred')}</h2>
        <p className="text-muted-foreground">{(error as Error).message}</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] })}>
          {t('common.tryAgain')}
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 px-4 md:px-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t('adminDashboard.customerManagement')}</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <UserPlus className="mr-2 h-4 w-4" />
          {t('admin.addNewUser')}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter the user list by different criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search by name, email or username..."
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={roleFilter}
              onValueChange={(value) => setRoleFilter(value)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="contentManager">Content Manager</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Users</CardTitle>
            <div className="text-sm text-muted-foreground">
              {filteredUsers.length} users found
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
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.profilePicture} alt={user.fullName} />
                            <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.fullName}</div>
                            <div className="text-sm text-muted-foreground">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(user.status)}`}></div>
                          <span className="capitalize">{user.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.lastLogin ? format(user.lastLogin, 'MMM d, yyyy') : 'Never'}
                      </TableCell>
                      <TableCell>{format(user.createdAt, 'MMM d, yyyy')}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleUserAction('edit', user)}>
                              <UserCog className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleUserAction('delete', user)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
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
            Showing {filteredUsers.length > 0 ? startIndex + 1 : 0} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} results
          </div>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prevPage => Math.max(prevPage - 1, 1))}
            >
              Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user's information. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Basic Details</TabsTrigger>
                <TabsTrigger value="access">Account Access</TabsTrigger>
                <TabsTrigger value="additional">Additional Info</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 py-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="space-y-2 flex-grow">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" defaultValue={selectedUser.fullName} />
                  </div>
                  <div className="space-y-2 flex-grow">
                    <Label htmlFor="username">Username</Label>
                    <Input id="username" defaultValue={selectedUser.username} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={selectedUser.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profilePicture">Profile Picture URL</Label>
                  <div className="flex gap-4 items-center">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedUser.profilePicture} />
                      <AvatarFallback>{getInitials(selectedUser.fullName)}</AvatarFallback>
                    </Avatar>
                    <Input id="profilePicture" defaultValue={selectedUser.profilePicture} className="flex-grow" />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="access" className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="status">User Status</Label>
                  <Select defaultValue={selectedUser.status}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">User Role</Label>
                  <Select defaultValue={selectedUser.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="customer">Customer</SelectItem>
                      <SelectItem value="contentManager">Content Manager</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resetPassword">Reset Password</Label>
                  <div className="flex gap-4">
                    <Input id="resetPassword" type="password" placeholder="New password" className="flex-grow" />
                    <Button variant="outline">Generate</Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="additional" className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input id="phoneNumber" defaultValue={selectedUser.phoneNumber || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" defaultValue={selectedUser.address || ''} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select 
                    name="gender" 
                    defaultValue={selectedUser.gender || "prefer-not-to-say"}
                    onValueChange={(value) => { 
                      // Just to ensure the value is captured and stored safely
                      const genderInput = document.createElement('input');
                      genderInput.type = 'hidden';
                      genderInput.id = 'gender-value';
                      genderInput.value = value;
                      document.body.appendChild(genderInput);
                    }}
                  >
                    <SelectTrigger id="gender-select">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non-binary">Non-binary</SelectItem>
                      <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthdate">Birthdate</Label>
                  <Input 
                    id="birthdate" 
                    type="date" 
                    defaultValue={selectedUser?.birthdate && selectedUser.birthdate instanceof Date && !isNaN(selectedUser.birthdate.getTime()) 
                      ? format(selectedUser.birthdate, 'yyyy-MM-dd') 
                      : ''} 
                  />
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Enter the user's information and credentials. Click create when you're done.
            </DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">User Details</TabsTrigger>
              <TabsTrigger value="access">Access & Role</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 py-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="space-y-2 flex-grow">
                  <Label htmlFor="newFullName">Full Name</Label>
                  <Input id="newFullName" placeholder="John Doe" />
                </div>
                <div className="space-y-2 flex-grow">
                  <Label htmlFor="newUsername">Username</Label>
                  <Input id="newUsername" placeholder="johndoe" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newEmail">Email</Label>
                <Input id="newEmail" type="email" placeholder="john.doe@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPhone">Phone Number (Optional)</Label>
                <Input id="newPhone" placeholder="+91 9876543210" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newAddress">Address (Optional)</Label>
                <Input id="newAddress" placeholder="123 Main St, City" />
              </div>
            </TabsContent>
            <TabsContent value="access" className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="newRole">User Role</Label>
                <Select defaultValue="customer">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="customer">Customer</SelectItem>
                    <SelectItem value="contentManager">Content Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newStatus">User Status</Label>
                <Select defaultValue="active">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Password</Label>
                <div className="flex gap-4">
                  <Input id="newPassword" type="password" placeholder="Password" className="flex-grow" />
                  <Button variant="outline">Generate</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="newConfirmPassword">Confirm Password</Label>
                <Input id="newConfirmPassword" type="password" placeholder="Confirm Password" />
              </div>
            </TabsContent>
          </Tabs>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateUser}>Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="my-4">
            {selectedUser && (
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedUser.profilePicture} alt={selectedUser.fullName} />
                  <AvatarFallback>{getInitials(selectedUser.fullName)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">{selectedUser.fullName}</div>
                  <div className="text-sm text-muted-foreground">{selectedUser.email}</div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser}>Delete User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CustomerManagement;