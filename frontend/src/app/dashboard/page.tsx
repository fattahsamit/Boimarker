// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { BookmarkIcon, TagIcon, ClockIcon } from "lucide-react";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's an overview of your bookmarks.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Total Bookmarks"
            value={loading ? null : "128"}
            description="All saved bookmarks"
            icon={<BookmarkIcon className="h-5 w-5" />}
          />
          <DashboardCard
            title="Categories"
            value={loading ? null : "15"}
            description="Organized collections"
            icon={<TagIcon className="h-5 w-5" />}
          />
          <DashboardCard
            title="Recent Activity"
            value={loading ? null : "24h ago"}
            description="Last bookmark added"
            icon={<ClockIcon className="h-5 w-5" />}
          />
        </div>

        <Tabs defaultValue="recent" className="space-y-4">
          <TabsList>
            <TabsTrigger value="recent">Recent Bookmarks</TabsTrigger>
            <TabsTrigger value="popular">Most Visited</TabsTrigger>
          </TabsList>
          <TabsContent value="recent" className="space-y-4">
            <RecentBookmarks loading={loading} />
          </TabsContent>
          <TabsContent value="popular" className="space-y-4">
            <PopularBookmarks loading={loading} />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

function DashboardCard({ title, value, description, icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        {value === null ? (
          <Skeleton className="h-7 w-20" />
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function RecentBookmarks({ loading }) {
  const dummyBookmarks = [
    {
      id: 1,
      title: "Shadcn UI Components",
      url: "https://ui.shadcn.com",
      date: "2h ago",
    },
    {
      id: 2,
      title: "Next.js Documentation",
      url: "https://nextjs.org/docs",
      date: "1d ago",
    },
    {
      id: 3,
      title: "React Hooks Guide",
      url: "https://reactjs.org/docs/hooks-intro.html",
      date: "3d ago",
    },
  ];

  return (
    <div className="space-y-4">
      {loading
        ? Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))
        : dummyBookmarks.map((bookmark) => (
            <Card key={bookmark.id}>
              <CardContent className="p-4">
                <h3 className="font-semibold">{bookmark.title}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {bookmark.url}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Added {bookmark.date}
                </p>
              </CardContent>
            </Card>
          ))}
    </div>
  );
}

function PopularBookmarks({ loading }) {
  const dummyBookmarks = [
    {
      id: 1,
      title: "FastAPI Documentation",
      url: "https://fastapi.tiangolo.com",
      visits: 32,
    },
    {
      id: 2,
      title: "Tailwind CSS",
      url: "https://tailwindcss.com",
      visits: 28,
    },
    {
      id: 3,
      title: "Python Tutorial",
      url: "https://docs.python.org/3/tutorial",
      visits: 24,
    },
  ];

  return (
    <div className="space-y-4">
      {loading
        ? Array(3)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex flex-col space-y-3">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-1/4" />
              </div>
            ))
        : dummyBookmarks.map((bookmark) => (
            <Card key={bookmark.id}>
              <CardContent className="p-4">
                <h3 className="font-semibold">{bookmark.title}</h3>
                <p className="text-sm text-muted-foreground truncate">
                  {bookmark.url}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  {bookmark.visits} visits
                </p>
              </CardContent>
            </Card>
          ))}
    </div>
  );
}
