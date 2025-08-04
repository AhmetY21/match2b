import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { ReactNode } from "react"

export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createClient()

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      redirect("/auth")
    }

    // Check if user has admin role
    const userRole = user.user_metadata?.role
    if (userRole !== "admin") {
      redirect("/dashboard")
    }

    return (
      <div className="min-h-screen bg-background">
        <div className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Admin Panel</h1>
              <div className="text-sm text-muted-foreground">Logged in as: {user.email}</div>
            </div>
          </div>
        </div>
        {children}
      </div>
    )
  } catch (error) {
    console.error("Admin layout error:", error)
    redirect("/auth")
  }
}
