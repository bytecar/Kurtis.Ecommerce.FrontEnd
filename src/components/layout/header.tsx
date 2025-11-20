import { useState } from "react";
import { Logo } from "./logo.js";
import { MainNav } from "./main-nav.js";
import { UserNav } from "./user-nav.js";
import { AdminMobileNav } from "./admin-mobile-nav.js";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Input } from "@/components/ui/input";
import { Search, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@/components/common/LanguageSwitcher";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [location, navigate] = useLocation();
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);
  const { user } = useAuth();
  const { t } = useTranslation();
  
  // Check if current path is an admin path
  const isAdminPath = location.startsWith('/admin');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  // If we're on an admin page, show a simplified header with back button
  if (isAdminPath) {
    return (
      <header className="sticky top-0 z-50 bg-background shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AdminMobileNav />
            
            <Link href="/">
              <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>{t('common.backToSite')}</span>
              </Button>
            </Link>
            
            <h1 className="text-xl font-bold">
              {location.includes('dashboard') && t('adminDashboard.dashboard')}
              {location.includes('reviews') && t('adminDashboard.reviews')}
              {location.includes('customers') && t('adminDashboard.customers')}
              {location.includes('inventory') && t('adminDashboard.inventory')}
              {location.includes('ratings') && t('adminDashboard.ratings')}
              {location.includes('returns') && t('adminDashboard.returns')}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {user && (
              <span className="text-sm text-muted-foreground hidden md:inline-block">
                {t('common.loggedInAs')}: {user.fullName}
              </span>
            )}
          </div>
        </div>
      </header>
    );
  }
  
  // Regular header for normal site pages
  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm">
      {/* Top announcement bar */}
      <div className="bg-primary text-white px-4 py-1 text-xs md:text-sm flex justify-center">
        <p>{t('common.announcementBar', 'Free shipping on orders above ₹999 | Use code FIRST10 for 10% off on your first order')}</p>
      </div>
      
      {/* Main header */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Logo />
        
        {/* Search bar (desktop) */}
        <form 
          onSubmit={handleSearch}
          className="hidden md:flex items-center flex-1 max-w-xl mx-6"
        >
          <div className="relative w-full">
            <Input
              type="text"
              placeholder={t('common.search', 'Search for products, brands and more...')}
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </form>
        
        {/* User actions */}
        <div className="flex items-center gap-3 md:gap-5">
          {/* Search button (mobile only) */}
          <button 
            onClick={() => setMobileSearchVisible(!mobileSearchVisible)}
            className="md:hidden text-foreground/70 hover:text-primary"
          >
            <Search className="h-5 w-5" />
          </button>
          
          <LanguageSwitcher />
          <ThemeToggle />
          <UserNav />
        </div>
      </div>
      
      {/* Mobile search bar (hidden by default) */}
      {mobileSearchVisible && (
        <form 
          onSubmit={handleSearch}
          className="md:hidden p-3 border-t border-border"
        >
          <Input
            type="text"
            placeholder={t('common.search', 'Search for products, brands and more...')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      )}
      
      {/* Navigation */}
      <MainNav />
    </header>
  );
}
