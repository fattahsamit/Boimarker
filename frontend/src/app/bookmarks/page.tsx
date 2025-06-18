// src/app/bookmarks/page.tsx
"use client";

import { useState } from "react";
import MainLayout from "@/components/layout/main-layout";
import { BookmarkDialog } from "@/components/bookmark/bookmark-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ExternalLinkIcon,
  MoreHorizontalIcon,
  EditIcon,
  TrashIcon,
  SearchIcon,
  BookmarkIcon,
  TagIcon,
} from "lucide-react";

export default function BookmarksPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState(null);

  // Mock data for bookmarks
  const bookmarks = [
    {
      id: 1,
      title: "Shadcn UI Components",
      url: "https://ui.shadcn.com",
      description:
        "Re-usable components built using Radix UI and Tailwind CSS.",
      tags: ["UI", "React", "Components"],
      createdAt: "2023-06-10T12:00:00Z",
    },
    {
      id: 2,
      title: "Next.js Documentation",
      url: "https://nextjs.org/docs",
      description: "The React Framework for the Web",
      tags: ["React", "Framework", "Documentation"],
      createdAt: "2023-06-08T10:30:00Z",
    },
    {
      id: 3,
      title: "FastAPI",
      url: "https://fastapi.tiangolo.com",
      description:
        "FastAPI framework, high performance, easy to learn, fast to code, ready for production",
      tags: ["Python", "API", "Backend"],
      createdAt: "2023-06-05T14:15:00Z",
    },
    {
      id: 4,
      title: "Tailwind CSS",
      url: "https://tailwindcss.com",
      description:
        "A utility-first CSS framework for rapidly building custom designs.",
      tags: ["CSS", "Design", "Frontend"],
      createdAt: "2023-06-03T09:20:00Z",
    },
    {
      id: 5,
      title: "Python Tutorial",
      url: "https://docs.python.org/3/tutorial",
      description: "Python is an easy to learn, powerful programming language.",
      tags: ["Python", "Tutorial", "Programming"],
      createdAt: "2023-06-01T16:45:00Z",
    },
  ];

  const filteredBookmarks = bookmarks.filter(
    (bookmark) =>
      bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bookmark.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleAddBookmark = () => {
    setEditingBookmark(null);
    setDialogOpen(true);
  };

  const handleEditBookmark = (bookmark) => {
    setEditingBookmark(bookmark);
    setDialogOpen(true);
  };

  const handleSaveBookmark = (data) => {
    // Handle saving bookmark - either add new or update existing
    console.log("Saving bookmark:", data);
    // Here you would call your API to save the bookmark
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Bookmarks</h1>
          <Button onClick={handleAddBookmark}>
            <BookmarkIcon className="h-4 w-4 mr-2" />
            Add New
          </Button>
        </div>

        <div className="relative">
          <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookmarks..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="space-y-4">
          {filteredBookmarks.length === 0 ? (
            <p className="text-center py-10 text-muted-foreground">
              No bookmarks found. Try a different search term.
            </p>
          ) : (
            filteredBookmarks.map((bookmark) => (
              <BookmarkCard
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={handleEditBookmark}
              />
            ))
          )}
        </div>

        <BookmarkDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          bookmark={editingBookmark}
          onSave={handleSaveBookmark}
        />
      </div>
    </MainLayout>
  );
}

function BookmarkCard({ bookmark, onEdit }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{bookmark.title}</h3>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline flex items-center"
            >
              {bookmark.url.replace(/^https?:\/\//, "")}
              <ExternalLinkIcon className="h-3 w-3 ml-1" />
            </a>

            <p className="text-sm text-muted-foreground">
              {bookmark.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-3">
              {bookmark.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex items-center bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs"
                >
                  <TagIcon className="h-3 w-3 mr-1" />
                  {tag}
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-3">
              Added on {formatDate(bookmark.createdAt)}
            </p>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontalIcon className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(bookmark)}>
                <EditIcon className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
