"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

export default function AuthTestPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("test@example.com")
  const [password, setPassword] = useState("testpass123")
  const supabase = createClient()

  const testSignup = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { role: "seeker" },
        },
      })
      setResult({ type: "signup", success: !error, data, error: error?.message })
    } catch (err) {
      setResult({ type: "signup", success: false, error: `${err}` })
    }
    setLoading(false)
  }

  const testLogin = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      setResult({ type: "login", success: !error, data, error: error?.message })
    } catch (err) {
      setResult({ type: "login", success: false, error: `${err}` })
    }
    setLoading(false)
  }

  const testLogout = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      setResult({ type: "logout", success: !error, error: error?.message })
    } catch (err) {
      setResult({ type: "logout", success: false, error: `${err}` })
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Authentication Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="test-email">Test Email</Label>
              <Input
                id="test-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="test@example.com"
              />
            </div>
            <div>
              <Label htmlFor="test-password">Test Password</Label>
              <Input
                id="test-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button onClick={testSignup} disabled={loading}>
              Test Signup
            </Button>
            <Button onClick={testLogin} disabled={loading} variant="outline">
              Test Login
            </Button>
            <Button onClick={testLogout} disabled={loading} variant="outline">
              Test Logout
            </Button>
          </div>

          {result && (
            <div className="p-4 bg-gray-100 rounded">
              <h3 className="font-semibold mb-2">
                {result.type} Result: {result.success ? "✅ Success" : "❌ Failed"}
              </h3>
              <pre className="text-xs overflow-auto whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
