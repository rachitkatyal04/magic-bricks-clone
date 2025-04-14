import Link from "next/link";
import { Building } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <Building className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">
              MagicBricks Clone
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 ml-6">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/properties"
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              Properties
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/auth/login">
            <Button variant="outline" size="sm">
              Login
            </Button>
          </Link>
          <Link href="/admin">
            <Button size="sm">Admin</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
