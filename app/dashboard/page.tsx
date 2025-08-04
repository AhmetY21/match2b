"use client"

import { useAuth } from "@/lib/auth-context"
import { SeekerDashboard } from "@/components/seeker-dashboard"
import { ProviderDashboard } from "@/components/provider-dashboard"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  const userRole = user.user_metadata?.role

  // Redirect admin users to admin dashboard
  if (userRole === "admin") {
    router.push("/admin/dashboard")
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-56px)]">
        <div className="text-center">
          <p className="text-muted-foreground">Redirecting to admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Welcome back, {user.email?.split("@")[0]}!</h1>
        <p className="text-muted-foreground">
          {userRole === "provider"
            ? "Manage your solutions and track engagement"
            : "Track your solution search and survey results"}
        </p>
      </div>

      {userRole === "provider" ? <ProviderDashboard /> : <SeekerDashboard />}
    </div>
  )
}
