"use client"

import Link from "next/link"
import { Mountain, Plus, User, LogOut, TestTube } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"

export function Header() {
  const { user, loading, signOut } = useAuth()

  const userRole = user?.user_metadata?.role

  // Check if we're in development mode safely
  const isDevelopment = typeof window !== "undefined" && window.location.hostname === "localhost"

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center bg-white border-b">
      <Link href="/" className="flex items-center justify-center" prefetch={false}>
        <Mountain className="h-6 w-6 text-teal-600" />
        <span className="ml-2 text-lg font-semibold">Match2B</span>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
        <Link href="/" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
          Home
        </Link>
        <Link href="/explore" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
          Explore
        </Link>

        {/* Test Menu - Only show in development */}
        {isDevelopment && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <TestTube className="h-4 w-4" />
                Tests
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href="/dummy-accounts">Dummy Accounts</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/create-test-accounts">Create Test Accounts</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/test-survey-auth">Test Survey Auth</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/test-auth">Test Auth System</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {loading ? (
          <div className="w-8 h-8 animate-pulse bg-gray-200 rounded"></div>
        ) : user ? (
          <div className="flex items-center gap-2">
            {userRole === "provider" && (
              <Button asChild size="sm" className="bg-teal-600 hover:bg-teal-700">
                <Link href="/provider/submit">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Solution
                </Link>
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {user.email?.split("@")[0]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                {userRole === "provider" && (
                  <DropdownMenuItem asChild>
                    <Link href="/provider/manage">Manage Solutions</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild size="sm">
              <Link href="/auth">Get Started</Link>
            </Button>
          </div>
        )}
      </nav>
    </header>
  )
}
