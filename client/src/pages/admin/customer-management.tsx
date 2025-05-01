import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { User } from '@shared/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { PencilIcon, TrashIcon, UserPlusIcon, FilterIcon } from 'lucide-react';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { useTranslation } from 'react-i18next';

export default function CustomerManagement() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Form states for create/edit user
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    fullName: '',
    role: 'customer',
    password: '',
  });

  // Fetch all users
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
    queryFn: async () => {
      const res = await apiRequest('GET', '/api/admin/users');
      return await res.json();
    },
    enabled: !!user && user.role === 'admin',
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: async (userData: Partial<User>) => {
      const res = await apiRequest('PATCH', `/api/admin/users/${selectedUser?.id}`, userData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: t('admin.userUpdated'),
        description: t('admin.userUpdatedSuccess'),
        variant: 'default',
      });
      setIsEditDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: t('admin.updateFailed'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: async (userData: typeof formData) => {
      const res = await apiRequest('POST', '/api/admin/users', userData);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: t('admin.userCreated'),
        description: t('admin.userCreatedSuccess'),
        variant: 'default',
      });
      setIsCreateDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: t('admin.createFailed'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('DELETE', `/api/admin/users/${selectedUser?.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      toast({
        title: t('admin.userDeleted'),
        description: t('admin.userDeletedSuccess'),
        variant: 'default',
      });
      setIsDeleteDialogOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: t('admin.deleteFailed'),
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Handle edit user dialog
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email || '',
      fullName: user.fullName || '',
      role: user.role || 'customer',
      password: '', // Empty password field on edit
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete user dialog
  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Handle create user dialog
  const handleCreateUser = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      username: '',
      email: '',
      fullName: '',
      role: 'customer',
      password: '',
    });
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Filter users based on role and search query
  const filteredUsers = users
    ? users.filter((user) => {
        const roleMatch = filterRole === 'all' || user.role === filterRole;
        const searchMatch =
          searchQuery === '' ||
          user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (user.fullName && user.fullName.toLowerCase().includes(searchQuery.toLowerCase()));
        return roleMatch && searchMatch;
      })
    : [];

  // If user is not admin, redirect or show error
  if (user?.role !== 'admin') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">{t('admin.accessDenied')}</h2>
            <p>{t('admin.adminRoleRequired')}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('admin.customerManagement')}</h1>

      <Tabs defaultValue="users">
        <TabsList className="mb-4">
          <TabsTrigger value="users">{t('admin.userManagement')}</TabsTrigger>
          <TabsTrigger value="roles">{t('admin.roleManagement')}</TabsTrigger>
          <TabsTrigger value="permissions">{t('admin.permissions')}</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-64">
                  <Input
                    placeholder={t('admin.searchUsers')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 absolute left-2.5 top-2.5 text-gray-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                <div className="flex items-center gap-2">
                  <FilterIcon className="h-4 w-4" />
                  <Select value={filterRole} onValueChange={(value) => setFilterRole(value)}>
                    <SelectTrigger className="w-[130px]">
                      <SelectValue placeholder={t('admin.filterByRole')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('admin.allRoles')}</SelectItem>
                      <SelectItem value="admin">{t('admin.adminRole')}</SelectItem>
                      <SelectItem value="customer">{t('admin.customerRole')}</SelectItem>
                      <SelectItem value="contentManager">{t('admin.contentManagerRole')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={handleCreateUser} className="flex-shrink-0">
                <UserPlusIcon className="h-4 w-4 mr-2" />
                {t('admin.addUser')}
              </Button>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[250px]" />
                        <Skeleton className="h-4 w-[200px]" />
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('admin.username')}</TableHead>
                      <TableHead>{t('admin.email')}</TableHead>
                      <TableHead>{t('admin.fullName')}</TableHead>
                      <TableHead>{t('admin.role')}</TableHead>
                      <TableHead>{t('admin.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          {searchQuery || filterRole !== 'all'
                            ? t('admin.noUsersMatchingCriteria')
                            : t('admin.noUsersFound')}
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email || '-'}</TableCell>
                          <TableCell>{user.fullName || '-'}</TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                user.role === 'admin'
                                  ? 'default'
                                  : user.role === 'contentManager'
                                  ? 'outline'
                                  : 'secondary'
                              }
                            >
                              {user.role || 'customer'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                                className="h-8 w-8 p-0"
                              >
                                <PencilIcon className="h-4 w-4" />
                                <span className="sr-only">{t('admin.edit')}</span>
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(user)}
                                className="h-8 w-8 p-0 text-destructive"
                              >
                                <TrashIcon className="h-4 w-4" />
                                <span className="sr-only">{t('admin.delete')}</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t('admin.roleDefinitions')}</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">{t('admin.adminRole')}</h3>
                <p className="text-gray-500">{t('admin.adminRoleDescription')}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">{t('admin.customerRole')}</h3>
                <p className="text-gray-500">{t('admin.customerRoleDescription')}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">{t('admin.contentManagerRole')}</h3>
                <p className="text-gray-500">{t('admin.contentManagerRoleDescription')}</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="permissions">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">{t('admin.permissionsMatrix')}</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('admin.capability')}</TableHead>
                    <TableHead>{t('admin.adminRole')}</TableHead>
                    <TableHead>{t('admin.contentManagerRole')}</TableHead>
                    <TableHead>{t('admin.customerRole')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{t('admin.userManagement')}</TableCell>
                    <TableCell>✓</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t('admin.productManagement')}</TableCell>
                    <TableCell>✓</TableCell>
                    <TableCell>✓</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t('admin.orderManagement')}</TableCell>
                    <TableCell>✓</TableCell>
                    <TableCell>✓</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t('admin.analyticsAccess')}</TableCell>
                    <TableCell>✓</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t('admin.inventoryManagement')}</TableCell>
                    <TableCell>✓</TableCell>
                    <TableCell>✓</TableCell>
                    <TableCell>-</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>{t('admin.profileManagement')}</TableCell>
                    <TableCell>✓</TableCell>
                    <TableCell>-</TableCell>
                    <TableCell>✓</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('admin.editUser')}</DialogTitle>
            <DialogDescription>
              {t('admin.editUserDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">{t('admin.username')}</Label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">{t('admin.email')}</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="fullName">{t('admin.fullName')}</Label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">{t('admin.role')}</Label>
              <Select 
                value={formData.role}
                onValueChange={(value) => handleSelectChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.selectRole')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{t('admin.adminRole')}</SelectItem>
                  <SelectItem value="customer">{t('admin.customerRole')}</SelectItem>
                  <SelectItem value="contentManager">{t('admin.contentManagerRole')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">{t('admin.newPassword')}</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder={t('admin.leaveEmptyToKeepCurrent')}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={() => updateUserMutation.mutate(formData)}
              disabled={updateUserMutation.isPending}
            >
              {updateUserMutation.isPending ? t('common.saving') : t('common.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('admin.deleteUser')}</DialogTitle>
            <DialogDescription>
              {t('admin.deleteUserConfirmation', { username: selectedUser?.username })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteUserMutation.mutate()}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? t('common.deleting') : t('common.delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{t('admin.addNewUser')}</DialogTitle>
            <DialogDescription>
              {t('admin.addNewUserDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="create-username">{t('admin.username')}</Label>
              <Input
                id="create-username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-email">{t('admin.email')}</Label>
              <Input
                id="create-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-fullName">{t('admin.fullName')}</Label>
              <Input
                id="create-fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-role">{t('admin.role')}</Label>
              <Select 
                value={formData.role}
                onValueChange={(value) => handleSelectChange('role', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('admin.selectRole')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">{t('admin.adminRole')}</SelectItem>
                  <SelectItem value="customer">{t('admin.customerRole')}</SelectItem>
                  <SelectItem value="contentManager">{t('admin.contentManagerRole')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="create-password">
                {t('admin.password')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="create-password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              onClick={() => createUserMutation.mutate(formData)}
              disabled={createUserMutation.isPending || !formData.username || !formData.password}
            >
              {createUserMutation.isPending ? t('common.creating') : t('common.create')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Badge component since we're using it in the table
const Badge = ({ 
  children, 
  variant = 'default' 
}: { 
  children: React.ReactNode, 
  variant?: 'default' | 'secondary' | 'outline' 
}) => {
  const variantClasses = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
  }
  
  return (
    <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variantClasses[variant]}`}>
      {children}
    </div>
  )
}