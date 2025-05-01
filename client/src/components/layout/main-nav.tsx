import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";

export function MainNav() {
  const [location] = useLocation();
  const { t } = useTranslation();
  
  // Check if current path is an admin path
  const isAdminPath = location.startsWith('/admin');
  
  // Hide navigation on admin pages
  if (isAdminPath) {
    return null;
  }

  const navItems = [
    { id: "home", name: t("common.home"), href: "/" },
    { id: "women", name: t("categories.womenswear"), href: "/products/women" },
    { id: "men", name: t("categories.menswear"), href: "/products/men" },
    { id: "newArrivals", name: t("home.newArrivals"), href: "/products/new" },
    { id: "sale", name: t("product.sale"), href: "/products/sale" },
  ];

  return (
    <nav className="bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <ul className="flex items-center gap-6 overflow-x-auto py-3 text-sm font-medium scrollbar-hide">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link href={item.href}>
                <div 
                  className={`pb-3 cursor-pointer ${
                    location === item.href
                      ? "text-primary border-b-2 border-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  {item.name}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
