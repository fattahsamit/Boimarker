"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MainLayout from "@/components/layout/main-layout";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
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
import { toast } from "sonner";
// Import AlertDialog components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// If you don't have a BookWithProgress type, you can use this one
type BookWithProgress = {
  id: number;
  title: string;
  mimetype?: string;
  author?: string;
  progress?: number;
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [books, setBooks] = useState<BookWithProgress[]>([]);
  const [error, setError] = useState("");
  const { token } = useAuth();
  const router = useRouter();

  // State for delete confirmation dialog
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<BookWithProgress | null>(
    null
  );
  const [isDeleting, setIsDeleting] = useState(false);

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
      toast.error("Failed to download book");
    }
  };

  // Handle opening delete confirmation dialog
  const handleDeleteClick = (book: BookWithProgress) => {
    setBookToDelete(book);
    setIsDeleteDialogOpen(true);
  };

  // Handle actual book deletion
  const handleDeleteConfirm = async () => {
    if (!bookToDelete) return;

    setIsDeleting(true);

    try {
      const response = await fetch(
        `http://localhost:8000/books/${bookToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete book");
      }

      // Remove book from state
      setBooks((prevBooks) =>
        prevBooks.filter((book) => book.id !== bookToDelete.id)
      );
      toast.success("Book deleted successfully");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete book");
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
      setBookToDelete(null);
    }
  };

  // Handle cancellation of deletion
  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setBookToDelete(null);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Library</h1>
            <p className="text-muted-foreground">
              Manage your eBook collection
            </p>
          </div>
          <Button onClick={() => router.push("/upload")}>
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Book
          </Button>
        </div>

        <div className="grid gap-6 mb-8 md:grid-cols-3">
          <DashboardCard
            title="Total Books"
            value={books.length}
            description="In your library"
            icon={<BookIcon className="h-5 w-5" />}
          />
          <DashboardCard
            title="Recent Activity"
            value="Recently Added"
            description={
              books.length > 0 ? books[0].title : "No recent activity"
            }
            icon={<ClockIcon className="h-5 w-5" />}
          />
          <DashboardCard
            title="Reading Progress"
            value="Continue Reading"
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
                    onDelete={() => handleDeleteClick(book)}
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
                      onDelete={() => handleDeleteClick(book)}
                    />
                  ))
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete{" "}
                <strong>&quot;{bookToDelete?.title}&quot;</strong> from your
                library. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={handleDeleteCancel}
                disabled={isDeleting}
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteConfirm}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
}

function DashboardCard({ title, value, description, icon }) {
  return (
    <Card>
      <CardContent className="flex flex-row items-center p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h4 className="text-2xl font-semibold">{value}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function BookCard({ book, onDownload, onRead, onDelete }) {
  return (
    <Card className="h-full flex flex-col">
      <div className="bg-muted h-48 flex items-center justify-center">
        {book.mimetype?.includes("pdf") ? (
          <FileIcon className="h-16 w-16 text-muted-foreground" />
        ) : (
          <BookIcon className="h-16 w-16 text-muted-foreground" />
        )}
      </div>
      <CardContent className="py-4 flex-grow">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
          {book.mimetype?.includes("pdf") ? "PDF Document" : "EPUB Book"}
        </p>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between gap-2">
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
        <Button
          variant="destructive"
          size="icon"
          className="flex-none h-9 w-9"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          aria-label="Delete book"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </Button>
      </CardFooter>
    </Card>
  );
}
