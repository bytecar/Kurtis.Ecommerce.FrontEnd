import { useState } from "react";
import { Logo } from "./logo";
import { MainNav } from "./main-nav";
import { UserNav } from "./user-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useLocation } from "wouter";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, navigate] = useLocation();
  const [mobileSearchVisible, setMobileSearchVisible] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background shadow-sm">
      {/* Top announcement bar */}
      <div className="bg-primary text-white px-4 py-1 text-xs md:text-sm flex justify-center">
        <p>Free shipping on orders above ₹999 | Use code FIRST10 for 10% off on your first order</p>
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
              placeholder="Search for products, brands and more..."
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
            placeholder="Search for products, brands and more..."
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
