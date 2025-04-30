import { Link, useLocation } from "wouter";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Women", href: "/products/women" },
  { name: "Men", href: "/products/men" },
  { name: "New Arrivals", href: "/products/new" },
  { name: "Sale", href: "/products/sale" },
];

export function MainNav() {
  const [location] = useLocation();

  return (
    <nav className="bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <ul className="flex items-center gap-6 overflow-x-auto py-3 text-sm font-medium scrollbar-hide">
          {navItems.map((item) => (
            <li key={item.name}>
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
