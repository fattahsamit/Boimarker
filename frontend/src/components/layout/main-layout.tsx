// src/components/layout/main-layout.tsx
"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../app/contexts/AuthContext";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { SearchIcon, HomeIcon, MenuIcon, BookmarkIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { token, logout } = useAuth();
  const [open, setOpen] = useState(false);

  // Check authentication
  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  const routes = [
    { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
    { href: "/search", label: "Search", icon: SearchIcon },
  ];

  const handleLogout = () => {
    console.log("Logout button clicked");
    logout();
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile Navigation */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-50"
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] sm:w-[300px]">
          <div className="flex flex-col h-full">
            <div className="px-6 py-4">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 text-2xl font-bold"
              >
                <BookmarkIcon className="h-6 w-6 text-primary" />
                Boimarker
              </Link>
            </div>
            <nav className="flex-1 py-4">
              <ul className="space-y-2 px-2">
                {routes.map((route) => {
                  const Icon = route.icon;
                  return (
                    <li key={route.href}>
                      <Link
                        href={route.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-colors",
                          pathname === route.href && "text-primary bg-muted"
                        )}
                      >
                        <Icon className="h-5 w-5" />
                        {route.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <div className="border-t py-4 px-4">
              {/* Add theme toggle to mobile menu */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium">Toggle Theme</span>
                <ThemeToggle />
              </div>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col w-64 bg-card">
        <div className="px-6 py-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity"
          >
            <BookmarkIcon className="h-6 w-6 text-primary" />
            Boimarker
          </Link>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2 px-2">
            {routes.map((route) => {
              const Icon = route.icon;
              return (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary hover:bg-muted transition-colors",
                      pathname === route.href && "text-primary bg-muted"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {route.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="p-4 border-t">
          {/* Add theme toggle to desktop sidebar */}
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-medium">Theme</span>
            <ThemeToggle />
          </div>
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col border-l">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <div className="lg:hidden w-6" /> {/* Spacer for mobile */}
          <div className="flex items-center gap-2">
            {/* Theme toggle in header */}
            <ThemeToggle />
          </div>
          <Avatar className="h-8 w-8">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </header>
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
