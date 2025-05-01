import { useState } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { Menu, X, LayoutDashboard, Users, Star, Package, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function AdminMobileNav() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);

  if (!user || (user.role !== "admin" && user.role !== "contentManager")) {
    return null;
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[250px] sm:w-[300px]">
        <SheetHeader>
          <SheetTitle>{t('adminDashboard.navigation')}</SheetTitle>
        </SheetHeader>
        <nav className="mt-8">
          <ul className="space-y-3">
            <li>
              <Link href="/admin/dashboard">
                <a 
                  className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-muted transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>{t('adminDashboard.dashboard')}</span>
                </a>
              </Link>
            </li>
            {user.role === "admin" && (
              <>
                <li>
                  <Link href="/admin/reviews">
                    <a 
                      className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <Star className="h-5 w-5" />
                      <span>{t('adminDashboard.reviews')}</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/customers">
                    <a 
                      className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <Users className="h-5 w-5" />
                      <span>{t('adminDashboard.customers')}</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/ratings">
                    <a 
                      className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <Star className="h-5 w-5" />
                      <span>{t('adminDashboard.ratings')}</span>
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/admin/returns">
                    <a 
                      className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      <RefreshCw className="h-5 w-5" />
                      <span>{t('adminDashboard.returns')}</span>
                    </a>
                  </Link>
                </li>
              </>
            )}
            {(user.role === "contentManager" || user.role === "admin") && (
              <li>
                <Link href="/admin/inventory">
                  <a 
                    className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-muted transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    <Package className="h-5 w-5" />
                    <span>{t('adminDashboard.inventory')}</span>
                  </a>
                </Link>
              </li>
            )}
            <li className="pt-4 mt-4 border-t">
              <Link href="/">
                <a 
                  className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-muted transition-colors"
                  onClick={() => setOpen(false)}
                >
                  <span>{t('common.backToSite')}</span>
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}