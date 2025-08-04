"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth-context"
import { RefreshCw } from "lucide-react"

export default function AuthDebugPage() {
  const { user, loading, refreshUser } = useAuth()
  const [directUser, setDirectUser] = useState<any>(null)
  const [checking, setChecking] = useState(false)
  const supabase = createClient()

  const checkDirectAuth = async () => {
    setChecking(true)
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      console.log("Direct auth check:", { user, error })
      setDirectUser({ user, error })
    } catch (err) {
      console.error("Direct auth error:", err)
      setDirectUser({ user: null, error: err })
    }
    setChecking(false)
  }

  useEffect(() => {
    checkDirectAuth()
  }, [])

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Authentication Debug</h1>
        <p className="text-muted-foreground">Debug authentication state and context</p>
      </div>

      <div className="space-y-6">
        {/* Auth Context Status */}
        <Card>
          <CardHeader>
            <CardTitle>Auth Context Status</CardTitle>
            <CardDescription>Status from useAuth hook</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Loading:</span>
                <Badge variant={loading ? "destructive" : "default"}>{loading ? "Yes" : "No"}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Has User:</span>
                <Badge variant={user ? "default" : "secondary"}>{user ? "Yes" : "No"}</Badge>
              </div>
              {user && (
                <>
                  <div className="flex items-center justify-between">
                    <span>Email:</span>
                    <span className="font-mono text-sm">{user.email}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>User ID:</span>
                    <span className="font-mono text-xs break-all">{user.id}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Role:</span>
                    <Badge variant="outline">{user.user_metadata?.role || "Not set"}</Badge>
                  </div>
                </>
              )}
              <Button onClick={refreshUser} variant="outline" size="sm" className="w-full bg-transparent">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Auth Context
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Direct Supabase Check */}
        <Card>
          <CardHeader>
            <CardTitle>Direct Supabase Check</CardTitle>
            <CardDescription>Direct call to supabase.auth.getUser()</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {checking ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-600 mx-auto"></div>
                  <p className="text-sm text-muted-foreground mt-2">Checking...</p>
                </div>
              ) : directUser ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Has User:</span>
                    <Badge variant={directUser.user ? "default" : "secondary"}>{directUser.user ? "Yes" : "No"}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Has Error:</span>
                    <Badge variant={directUser.error ? "destructive" : "default"}>
                      {directUser.error ? "Yes" : "No"}
                    </Badge>
                  </div>
                  {directUser.user && (
                    <>
                      <div className="flex items-center justify-between">
                        <span>Email:</span>
                        <span className="font-mono text-sm">{directUser.user.email}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>User ID:</span>
                        <span className="font-mono text-xs break-all">{directUser.user.id}</span>
                      </div>
                    </>
                  )}
                  {directUser.error && (
                    <div className="p-3 bg-red-50 rounded text-sm">
                      <p className="text-red-800 font-medium">Error:</p>
                      <p className="text-red-600">{directUser.error.message || String(directUser.error)}</p>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted-foreground">No data</p>
              )}
              <Button onClick={checkDirectAuth} variant="outline" size="sm" className="w-full bg-transparent">
                <RefreshCw className="h-4 w-4 mr-2" />
                Check Direct Auth
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Environment Check */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Check</CardTitle>
            <CardDescription>Supabase configuration status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span>Supabase URL:</span>
                <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_URL ? "default" : "destructive"}>
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Missing"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span>Supabase Anon Key:</span>
                <Badge variant={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "default" : "destructive"}>
                  {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Missing"}
                </Badge>
              </div>
              {process.env.NEXT_PUBLIC_SUPABASE_URL && (
                <div className="p-3 bg-gray-100 rounded text-xs">
                  <p className="font-medium">URL Preview:</p>
                  <p className="font-mono break-all">{process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
