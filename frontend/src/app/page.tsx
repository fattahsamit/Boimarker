"use client";
import { useEffect, useState } from "react";

// Define a type for the book object
type Book = {
  id: number;
  title: string;
  filename: string;
  author?: string;
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]); // Initialize as empty array with type
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:8000/books")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch books");
        }
        return res.json();
      })
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main>
      <h1>My Books</h1>
      {books.length === 0 ? (
        <p>No books found.</p>
      ) : (
        <ul>
          {books.map((book) => (
            <li key={book.id}>
              <strong>{book.title || book.filename}</strong>
              {book.author && <> by {book.author}</>}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
