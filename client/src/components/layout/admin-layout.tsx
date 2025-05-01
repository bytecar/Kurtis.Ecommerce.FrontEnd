import { ReactNode } from "react";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/hooks/use-auth";
import { ArrowLeft, LayoutDashboard, Users, Star, Package, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export function AdminLayout({ children, title }: AdminLayoutProps) {
  const { t } = useTranslation();
  const { user } = useAuth();

  if (!user || (user.role !== "admin" && user.role !== "contentManager")) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Admin header */}
      <header className="bg-background border-b border-border py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span>{t('common.backToSite')}</span>
              </Button>
            </Link>
            <h1 className="text-xl font-bold">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            {user && (
              <span className="text-sm text-muted-foreground">
                {t('common.loggedInAs')}: {user.fullName} ({user.role})
              </span>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Admin sidebar */}
        <aside className="w-64 border-r border-border bg-muted/30 hidden md:block">
          <nav className="p-4">
            <ul className="space-y-2">
              <li>
                <Link href="/admin/dashboard">
                  <a className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-muted transition-colors">
                    <LayoutDashboard className="h-5 w-5" />
                    <span>{t('adminDashboard.dashboard')}</span>
                  </a>
                </Link>
              </li>
              {user.role === "admin" && (
                <>
                  <li>
                    <Link href="/admin/reviews">
                      <a className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-muted transition-colors">
                        <Star className="h-5 w-5" />
                        <span>{t('adminDashboard.reviews')}</span>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/customers">
                      <a className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-muted transition-colors">
                        <Users className="h-5 w-5" />
                        <span>{t('adminDashboard.customers')}</span>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/ratings">
                      <a className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-muted transition-colors">
                        <Star className="h-5 w-5" />
                        <span>{t('adminDashboard.ratings')}</span>
                      </a>
                    </Link>
                  </li>
                  <li>
                    <Link href="/admin/returns">
                      <a className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-muted transition-colors">
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
                    <a className="flex items-center gap-3 px-4 py-2 rounded-md hover:bg-muted transition-colors">
                      <Package className="h-5 w-5" />
                      <span>{t('adminDashboard.inventory')}</span>
                    </a>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </aside>

        {/* Admin content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}