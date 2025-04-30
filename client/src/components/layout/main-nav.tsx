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
    <nav className="bg-white border-t border-gray-200">
      <div className="container mx-auto px-4">
        <ul className="flex items-center gap-6 overflow-x-auto py-3 text-sm font-medium scrollbar-hide">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href}>
                <a 
                  className={`pb-3 ${
                    location === item.href
                      ? "text-primary border-b-2 border-primary"
                      : "text-gray-600 hover:text-primary"
                  }`}
                >
                  {item.name}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
