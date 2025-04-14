import Link from "next/link"
import type { ReactNode } from "react"
import { Home, Settings, LogOut } from "lucide-react"

interface AdminLayoutProps {
  children: ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/admin" className="text-xl font-bold">
            MagicBricks Admin
          </Link>
          <nav className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1 hover:underline">
              <Home className="h-4 w-4" />
              View Site
            </Link>
            <Link href="/admin/settings" className="flex items-center gap-1 hover:underline">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
            <button className="flex items-center gap-1 hover:underline">
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 bg-gray-50">{children}</main>

      <footer className="bg-gray-100 p-4 text-center text-gray-600 text-sm">
        <div className="container mx-auto">
          &copy; {new Date().getFullYear()} MagicBricks Clone. All rights reserved.
        </div>
      </footer>
    </div>
  )
}
