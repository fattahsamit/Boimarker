"use client";

import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering the theme provider after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <AuthProvider>{children}</AuthProvider>;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  );
}
