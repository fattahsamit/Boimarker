// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BookIcon,
  BookOpenIcon,
  PlusIcon,
  DownloadIcon,
  FileIcon,
  ClockIcon,
  BookmarkIcon,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { BookWithProgress } from "@/types/book";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<BookWithProgress[]>([]);
  const [error, setError] = useState("");
  const { token } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) return;

    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:8000/books", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }

        const data = await response.json();
        setBooks(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [token]);

  const handleDownload = async (bookId: number) => {
    try {
      // Instead of opening in a new tab, we'll fetch the file with authentication
      // and create a download link
      const response = await fetch(
        `http://localhost:8000/books/${bookId}/download`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download book");
      }

      // Get the file as a blob
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create a temporary link element
      const link = document.createElement("a");
      link.href = url;

      // Set the download attribute with filename
      // Try to get filename from content-disposition header if available
      const contentDisposition = response.headers.get("content-disposition");
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : `book_${bookId}.pdf`;

      link.setAttribute("download", filename);

      // Append to body, click and then remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the URL
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Error downloading book:", err);
      alert("Failed to download book. Please try again.");
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Library</h1>
            <p className="text-muted-foreground">
              Manage your eBook collection
            </p>
          </div>
          <Button onClick={() => router.push("/upload")}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Book
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Total Books"
            value={loading ? null : books.length.toString()}
            description="In your library"
            icon={<BookIcon className="h-5 w-5" />}
          />
          <DashboardCard
            title="Recent Activity"
            value={loading || books.length === 0 ? null : "Recently Added"}
            description={
              loading || books.length === 0 ? "No books yet" : books[0]?.title
            }
            icon={<ClockIcon className="h-5 w-5" />}
          />
          <DashboardCard
            title="Reading Progress"
            value={loading ? null : "Continue Reading"}
            description="Pick up where you left off"
            icon={<BookmarkIcon className="h-5 w-5" />}
          />
        </div>

        <Tabs defaultValue="books" className="space-y-4">
          <TabsList>
            <TabsTrigger value="books">All Books</TabsTrigger>
            <TabsTrigger value="recent">Recently Added</TabsTrigger>
          </TabsList>
          <TabsContent value="books" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="h-[100px] flex items-center justify-center bg-muted rounded-md mb-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                        </div>
                        <Skeleton className="h-5 w-2/3 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                    </Card>
                  ))
              ) : books.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
                  <BookOpenIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No books yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Upload your first eBook to get started
                  </p>
                  <Button onClick={() => router.push("/upload")}>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Upload Book
                  </Button>
                </div>
              ) : (
                books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onDownload={() => handleDownload(book.id)}
                    onRead={() => router.push(`/read/${book.id}`)}
                  />
                ))
              )}
            </div>
          </TabsContent>
          <TabsContent value="recent" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <Card key={i}>
                      <CardContent className="p-6">
                        <div className="h-[100px] flex items-center justify-center bg-muted rounded-md mb-4">
                          <Skeleton className="h-12 w-12 rounded-full" />
                        </div>
                        <Skeleton className="h-5 w-2/3 mb-2" />
                        <Skeleton className="h-4 w-full" />
                      </CardContent>
                    </Card>
                  ))
              ) : books.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center p-12 text-center">
                  <ClockIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    No recent books
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Your recently added books will appear here
                  </p>
                </div>
              ) : (
                books
                  .slice(0, 3)
                  .map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onDownload={() => handleDownload(book.id)}
                      onRead={() => router.push(`/read/${book.id}`)}
                    />
                  ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

function DashboardCard({ title, value, description, icon }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-2 bg-primary/10 rounded-md">{icon}</div>
          <div>
            <h3 className="font-medium">{title}</h3>
            {value ? (
              <p className="text-2xl font-bold">{value}</p>
            ) : (
              <Skeleton className="h-8 w-20 mt-1" />
            )}
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function BookCard({ book, onDownload, onRead }) {
  // Determine file type icon
  const getFileIcon = (mimetype: string) => {
    if (mimetype?.includes("pdf")) {
      return <FileIcon className="h-8 w-8" />;
    }
    return <BookIcon className="h-8 w-8" />;
  };

  return (
    <Card className="overflow-hidden flex flex-col">
      <div className="h-[100px] flex items-center justify-center bg-muted p-6">
        {getFileIcon(book.mimetype)}
      </div>
      <CardContent className="p-6 flex-grow">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
          {book.filename}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2 p-4 pt-0">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={onDownload}
        >
          <DownloadIcon className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button size="sm" className="flex-1" onClick={onRead}>
          <BookOpenIcon className="h-4 w-4 mr-2" />
          Read
        </Button>
      </CardFooter>
    </Card>
  );
}
