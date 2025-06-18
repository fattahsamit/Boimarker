import type { Metadata } from "next";
import { AuthProvider } from "../app/contexts/AuthContext";
// import "./globals.css";

export const metadata: Metadata = {
  title: "Boimarker",
  description: "Personal Library",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
