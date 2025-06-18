"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  ArrowLeftIcon,
  BookOpenIcon,
  HomeIcon,
  LoaderIcon,
} from "lucide-react";
import { BookWithProgress } from "@/types/book";

export default function ReadBookPage({ params }: { params: { id: string } }) {
  // Get bookId safely from params
  const bookId = parseInt(params.id);

  const [book, setBook] = useState<BookWithProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookData, setBookData] = useState<string | null>(null);
  const { token } = useAuth();
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!token || isNaN(bookId)) {
      router.push("/dashboard");
      return;
    }

    const fetchBook = async () => {
      try {
        console.log("Attempting to fetch book with ID:", bookId);

        // First try to debug the API endpoints
        console.log("API URL:", `http://localhost:8000/books/${bookId}`);

        // Fetch book details with error handling
        let response;
        try {
          response = await fetch(`http://localhost:8000/books/${bookId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("Book fetch response status:", response.status);

          if (!response.ok) {
            const errorText = await response.text();
            console.error("Book fetch error:", errorText);
            throw new Error(
              `Failed to fetch book: ${response.status} ${response.statusText}`
            );
          }
        } catch (err) {
          console.error("Network error fetching book:", err);
          throw new Error("Network error when fetching book details");
        }

        const bookData = await response.json();
        console.log("Book data received:", bookData);
        setBook(bookData);

        // Now try to fetch the file directly
        try {
          const fileResponse = await fetch(
            `http://localhost:8000/books/${bookId}/download`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          console.log("File fetch response status:", fileResponse.status);

          if (!fileResponse.ok) {
            const errorText = await fileResponse.text();
            console.error("File fetch error:", errorText);
            throw new Error(
              `Failed to download book: ${fileResponse.status} ${fileResponse.statusText}`
            );
          }

          const blob = await fileResponse.blob();
          const url = URL.createObjectURL(blob);
          setBookData(url);
        } catch (err) {
          console.error("Error downloading book file:", err);
          throw new Error("Failed to download the book file");
        }

        // Try to fetch progress as a separate step
        try {
          const progressResponse = await fetch(
            `http://localhost:8000/books/${bookId}/progress`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (progressResponse.ok) {
            const progressData = await progressResponse.json();
            setBook((prev) =>
              prev ? { ...prev, progress: progressData } : null
            );
          }
        } catch {
          // Progress might not exist yet, that's okay
          console.log("No progress found or error fetching progress");
        }
      } catch (err: unknown) {
        console.error("Overall error:", err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("Failed to load the book");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBook();

    // Cleanup function
    return () => {
      if (bookData) {
        URL.revokeObjectURL(bookData);
      }
    };
  }, [token, bookId, router]);

  // Save progress periodically or when leaving
  const saveProgress = async (position: string) => {
    if (!token || !bookId) return;

    try {
      await fetch(`http://localhost:8000/books/${bookId}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          position,
        }),
      });
    } catch (err) {
      console.error("Failed to save progress", err);
    }
  };

  useEffect(() => {
    // Save progress when user leaves page
    const handleBeforeUnload = () => {
      if (iframeRef.current) {
        // This is a simplified example - in a real app you'd need to
        // extract the current reading position from the PDF/EPUB viewer
        const position = "1"; // Placeholder
        saveProgress(position);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      handleBeforeUnload(); // Save on component unmount too
    };
  }, [bookId, token]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <LoaderIcon className="h-8 w-8 animate-spin mb-4" />
        <p>Loading your book...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="text-muted-foreground mb-6">
          {error || "Book not found"}
        </p>
        <div className="text-sm text-muted-foreground mb-6">
          Book ID: {bookId}, Token present: {token ? "Yes" : "No"}
        </div>
        <Button onClick={() => router.push("/dashboard")}>
          <HomeIcon className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>
          <h1 className="font-semibold truncate">{book.title}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => saveProgress("manual")}
          >
            Save Progress
          </Button>
        </div>
      </header>

      {/* Book Viewer */}
      <div className="flex-grow overflow-hidden">
        {bookData ? (
          book.mimetype?.includes("pdf") ? (
            <iframe
              ref={iframeRef}
              src={`${bookData}#toolbar=1&navpanes=1&scrollbar=1${
                book.progress ? `&page=${book.progress.position}` : ""
              }`}
              className="w-full h-full"
              title={book.title}
            />
          ) : (
            // For EPUBs, you would need an EPUB reader library like epub.js
            // This is just a placeholder
            <div className="flex flex-col items-center justify-center h-full">
              <BookOpenIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-xl font-semibold mb-2">EPUB Reader</p>
              <p className="text-muted-foreground mb-4">
                EPUB viewing is not implemented in this example
              </p>
              <Button
                onClick={() =>
                  (window.location.href = `http://localhost:8000/books/${bookId}/download`)
                }
              >
                Download Instead
              </Button>
            </div>
          )
        ) : (
          <div className="flex items-center justify-center h-full">
            <LoaderIcon className="h-8 w-8 animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
