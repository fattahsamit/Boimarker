// src/components/layout/main-layout.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "../../app/contexts/AuthContext"; // Make sure this import is correct
import {
  BookmarkIcon,
  TagIcon,
  SearchIcon,
  PlusCircleIcon,
  HomeIcon,
  MenuIcon,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout } = useAuth(); // Make sure we get logout from context
  const [open, setOpen] = useState(false);

  const routes = [
    { href: "/dashboard", label: "Dashboard", icon: HomeIcon },
    { href: "/bookmarks", label: "Bookmarks", icon: BookmarkIcon },
    { href: "/tags", label: "Tags", icon: TagIcon },
    { href: "/search", label: "Search", icon: SearchIcon },
  ];

  // Create a separate handler for logout
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
            <div className="py-4 border-b">
              <h2 className="text-2xl font-bold px-4">Boimarker</h2>
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
              {/* Fix: Use onClick handler for mobile logout */}
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
      <div className="hidden lg:flex flex-col w-64 border-r bg-card">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold">Boimarker</h1>
        </div>
        <nav className="flex-1 py-6">
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
          {/* Fix: Use onClick handler for desktop logout */}
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 border-b flex items-center justify-between px-6">
          <div className="lg:hidden w-6" /> {/* Spacer for mobile */}
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm">
              <PlusCircleIcon className="h-4 w-4 mr-2" />
              Add Bookmark
            </Button>
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
