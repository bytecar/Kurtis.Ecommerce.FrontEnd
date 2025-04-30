import { Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Heart, ShoppingBag, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function UserNav() {
  const { user, logoutMutation } = useAuth();
  const { totalItems } = useCart();

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="flex items-center gap-3 md:gap-5">
      {/* Account dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="flex flex-col items-center p-0">
            <User className="h-5 w-5" />
            <span className="text-xs hidden md:block mt-1">Account</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          {user ? (
            <>
              <DropdownMenuLabel>
                <p>Hi, {user.fullName}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <div className="w-full cursor-pointer">My Profile</div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">
                    <div className="w-full cursor-pointer">My Orders</div>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/wishlist">
                    <div className="w-full cursor-pointer">My Wishlist</div>
                  </Link>
                </DropdownMenuItem>
                
                {/* Admin links */}
                {user.role === "admin" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard">
                        <div className="w-full cursor-pointer">Admin Dashboard</div>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/reviews">
                        <div className="w-full cursor-pointer">Review Management</div>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                {/* Content Manager links */}
                {(user.role === "contentManager" || user.role === "admin") && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/admin/inventory">
                        <div className="w-full cursor-pointer">Inventory Management</div>
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                  Logout
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          ) : (
            <>
              <div className="px-2 py-2">
                <p className="font-medium mb-1">Welcome</p>
                <p className="text-xs text-muted-foreground mb-3">
                  To access account and manage orders
                </p>
                <div className="flex gap-2">
                  <Link href="/auth">
                    <Button variant="default" className="w-full" size="sm">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth?tab=register">
                    <Button variant="outline" className="w-full" size="sm">
                      Register
                    </Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Wishlist - only show if logged in */}
      {user && (
        <Link href="/wishlist">
          <Button variant="ghost" className="flex flex-col items-center p-0">
            <Heart className="h-5 w-5" />
            <span className="text-xs hidden md:block mt-1">Wishlist</span>
          </Button>
        </Link>
      )}

      {/* Cart */}
      <Link href="/cart">
        <Button variant="ghost" className="flex flex-col items-center p-0 relative">
          <ShoppingBag className="h-5 w-5" />
          <span className="text-xs hidden md:block mt-1">Cart</span>
          {totalItems > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
              {totalItems}
            </Badge>
          )}
        </Button>
      </Link>
    </div>
  );
}
