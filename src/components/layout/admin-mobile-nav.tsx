import { useState } from "react";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTranslation } from "react-i18next";

export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden" size="icon">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle admin menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pt-10">
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="space-y-4 py-4">
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-lg font-semibold">
                {t('adminDashboard.adminPanel')}
              </h2>
              <div className="space-y-1">
                <Link href="/admin/dashboard" onClick={handleLinkClick}>
                  <Button variant="ghost" className="w-full justify-start">
                    {t('adminDashboard.dashboard')}
                  </Button>
                </Link>
                <Link href="/admin/inventory" onClick={handleLinkClick}>
                  <Button variant="ghost" className="w-full justify-start">
                    {t('adminDashboard.inventory')}
                  </Button>
                </Link>
                <Link href="/admin/reviews" onClick={handleLinkClick}>
                  <Button variant="ghost" className="w-full justify-start">
                    {t('adminDashboard.reviews')}
                  </Button>
                </Link>
                <Link href="/admin/customers" onClick={handleLinkClick}>
                  <Button variant="ghost" className="w-full justify-start">
                    {t('adminDashboard.customers')}
                  </Button>
                </Link>
                <Link href="/admin/ratings" onClick={handleLinkClick}>
                  <Button variant="ghost" className="w-full justify-start">
                    {t('adminDashboard.ratings')}
                  </Button>
                </Link>
                <Link href="/admin/returns" onClick={handleLinkClick}>
                  <Button variant="ghost" className="w-full justify-start">
                    {t('adminDashboard.returns')}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}