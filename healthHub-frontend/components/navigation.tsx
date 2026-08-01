"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Menu, X, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useAuth } from "@/lib/auth-context"

export function Navigation() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const { user, checkedAuth, logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    router.push("/")
    router.refresh()
  }

  return (
    <nav className="border-b border-border bg-card sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center group-hover:shadow-lg transition-shadow">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-semibold text-foreground hidden sm:inline">HealthHub</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Home
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              About
            </Link>
            <Link href="/contact" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
              Contact
            </Link>
            {checkedAuth && user && (
              <Link href="/dashboard" className="text-foreground hover:text-primary transition-colors text-sm font-medium">
                Dashboard
              </Link>
            )}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            {checkedAuth && user ? (
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-block bg-transparent"
                onClick={handleLogout}
              >
                Logout
              </Button>
            ) : (
              checkedAuth && (
                <>
                  <Link href="/signin" className="hidden sm:inline-block">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" className="hidden sm:inline-block">
                    <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      Register
                    </Button>
                  </Link>
                </>
              )
            )}

            {/* Mobile Menu Button */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <Link href="/" className="block px-4 py-2 text-foreground hover:text-primary hover:bg-muted rounded transition-colors">
              Home
            </Link>
            <Link href="/about" className="block px-4 py-2 text-foreground hover:text-primary hover:bg-muted rounded transition-colors">
              About
            </Link>
            <Link href="/contact" className="block px-4 py-2 text-foreground hover:text-primary hover:bg-muted rounded transition-colors">
              Contact
            </Link>
            {checkedAuth && user && (
              <Link href="/dashboard" className="block px-4 py-2 text-foreground hover:text-primary hover:bg-muted rounded transition-colors">
                Dashboard
              </Link>
            )}

            <div className="px-4 pt-4 gap-2 flex flex-col">
              {checkedAuth && user ? (
                <Button variant="outline" size="sm" className="w-full bg-transparent" onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                checkedAuth && (
                  <>
                    <Link href="/signin" className="w-full">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" className="w-full">
                      <Button size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                        Register
                      </Button>
                    </Link>
                  </>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}