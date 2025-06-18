"use client";
import { useState } from "react";

export default function UploadBook() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:8000/books/upload", {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setMessage("Upload successful!");
    } else {
      setMessage("Upload failed.");
    }
  };

  return (
    <main>
      <h1>Upload Book</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".epub,.pdf"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files && e.target.files[0]) {
              setFile(e.target.files[0]);
            } else {
              setFile(null);
            }
          }}
        />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
    </main>
  );
}
