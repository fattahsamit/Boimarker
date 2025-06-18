import Link from "next/link";
import { BookmarkIcon } from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BookmarkIcon className="h-5 w-5 text-primary" />
          <p className="text-sm leading-loose text-muted-foreground">
            © {currentYear} Boimarker. All rights reserved.
          </p>
        </div>
        <nav className="flex gap-6">
          <Link
            href="/terms"
            className="text-sm leading-loose text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms
          </Link>
          <Link
            href="/privacy"
            className="text-sm leading-loose text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy
          </Link>
          <Link
            href="/contact"
            className="text-sm leading-loose text-muted-foreground hover:text-foreground transition-colors"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
