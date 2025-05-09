import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/auth-context"

export default function UserLayout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold">E-Commerce</span>
            </Link>
            {user && (
              <nav className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/order-history"
                  className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === "/order-history" ? "text-primary" : "text-muted-foreground"}`}
                >
                  Order History
                </Link>
              </nav>
            )}
          </div>
          <div className="flex items-center space-x-4">
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {user.role === 'User' && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/order-history">Order History</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                    </>
                  )}
                  {(user.role === 'Admin' || user.role === 'moderator') && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/order-history">Order History</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </header>
      <main className="max-w-3xl mx-auto py-10 px-4">
        {children}
      </main>
    </div>
  )
} 