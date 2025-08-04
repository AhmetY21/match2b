"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle2, XCircle, AlertCircle, User, Mail, Calendar } from "lucide-react"
import { DummyAccountsInfo } from "@/components/dummy-accounts-info"

export default function TestAuthPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  const [supabaseStatus, setSupabaseStatus] = useState<string>("checking")

  const supabase = createClient()

  useEffect(() => {
    checkSupabaseConnection()
    checkCurrentUser()
  }, [])

  const checkSupabaseConnection = async () => {
    try {
      const { data, error } = await supabase.from("solutions").select("count").limit(1)
      if (error) {
        setSupabaseStatus(`Error: ${error.message}`)
      } else {
        setSupabaseStatus("Connected ✅")
      }
    } catch (err) {
      setSupabaseStatus(`Connection failed: ${err}`)
    }
  }

  const checkCurrentUser = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    } catch (err) {
      console.error("Error checking user:", err)
    }
  }

  const addTestResult = (test: string, success: boolean, message: string, details?: any) => {
    setTestResults((prev) => [
      ...prev,
      {
        test,
        success,
        message,
        details,
        timestamp: new Date().toLocaleTimeString(),
      },
    ])
  }

  const testSignup = async () => {
    setLoading(true)
    const testEmail = `test-${Date.now()}@example.com`
    const testPassword = "testpassword123"

    try {
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
          data: {
            role: "seeker",
          },
        },
      })

      if (error) {
        addTestResult("Signup Test", false, error.message, { email: testEmail })
      } else {
        addTestResult("Signup Test", true, "User created successfully", {
          email: testEmail,
          userId: data.user?.id,
          needsConfirmation: !data.user?.email_confirmed_at,
        })
      }
    } catch (err) {
      addTestResult("Signup Test", false, `Unexpected error: ${err}`)
    }
    setLoading(false)
  }

  const testLogin = async () => {
    setLoading(true)
    const testEmail = "test@test.com"
    const testPassword = "asdasdasd"

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword,
      })

      if (error) {
        addTestResult("Login Test", false, error.message, { email: testEmail })
      } else {
        addTestResult("Login Test", true, "Login successful", {
          email: testEmail,
          userId: data.user?.id,
        })
        setUser(data.user)
      }
    } catch (err) {
      addTestResult("Login Test", false, `Unexpected error: ${err}`)
    }
    setLoading(false)
  }

  const testLogout = async () => {
    setLoading(true)
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        addTestResult("Logout Test", false, error.message)
      } else {
        addTestResult("Logout Test", true, "Logout successful")
        setUser(null)
      }
    } catch (err) {
      addTestResult("Logout Test", false, `Unexpected error: ${err}`)
    }
    setLoading(false)
  }

  const testSurveyResponse = async () => {
    setLoading(true)
    const testAnswers = {
      company_size: "11-50",
      industry: "Tech",
      problem_area: "Customer support automation",
      urgent_need: true,
      budget: "$10k-$50k",
    }

    try {
      const { data, error } = await supabase
        .from("survey_responses")
        .insert({
          session_id: `test-${Date.now()}`,
          user_id: user?.id || null,
          answers: testAnswers,
        })
        .select()

      if (error) {
        addTestResult("Survey Save Test", false, error.message, testAnswers)
      } else {
        addTestResult("Survey Save Test", true, "Survey response saved", {
          responseId: data[0]?.id,
          answers: testAnswers,
        })
      }
    } catch (err) {
      addTestResult("Survey Save Test", false, `Unexpected error: ${err}`)
    }
    setLoading(false)
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <DummyAccountsInfo />
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Authentication System Test Dashboard
          </CardTitle>
          <CardDescription>
            Test the complete signup, login, and database operations with detailed error reporting.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label className="text-sm font-medium">Supabase Connection</Label>
              <Badge variant={supabaseStatus.includes("✅") ? "default" : "destructive"}>{supabaseStatus}</Badge>
            </div>
            <div>
              <Label className="text-sm font-medium">Current User</Label>
              <Badge variant={user ? "default" : "secondary"}>
                {user ? `Logged in: ${user.email}` : "Not logged in"}
              </Badge>
            </div>
          </div>

          {user && (
            <Card className="mb-6 bg-green-50 border-green-200">
              <CardContent className="pt-4">
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Current User Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3" />
                    <span>Email: {user.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    <span>Created: {new Date(user.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Confirmed: {user.email_confirmed_at ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3" />
                    <span>Role: {user.user_metadata?.role || "Not set"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button onClick={testSignup} disabled={loading} className="w-full">
              Test Signup
            </Button>
            <Button onClick={testLogin} disabled={loading} className="w-full">
              Test Login
            </Button>
            <Button onClick={testLogout} disabled={loading} className="w-full bg-transparent" variant="outline">
              Test Logout
            </Button>
            <Button onClick={testSurveyResponse} disabled={loading} className="w-full" variant="secondary">
              Test Survey Save
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Real-time results from authentication tests</CardDescription>
          </div>
          <Button onClick={clearResults} variant="outline" size="sm">
            Clear Results
          </Button>
        </CardHeader>
        <CardContent>
          {testResults.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No tests run yet. Click the buttons above to start testing.
            </p>
          ) : (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <Card
                  key={index}
                  className={`border-l-4 ${result.success ? "border-l-green-500 bg-green-50" : "border-l-red-500 bg-red-50"}`}
                >
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {result.success ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <div>
                          <h4 className="font-semibold">{result.test}</h4>
                          <p className="text-sm text-muted-foreground">{result.message}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {result.timestamp}
                      </Badge>
                    </div>
                    {result.details && (
                      <div className="mt-3 p-3 bg-gray-100 rounded text-xs">
                        <pre>{JSON.stringify(result.details, null, 2)}</pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Manual Test Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold">1. Test Signup Flow:</h4>
              <p>• Click "Test Signup" to create a new user with a random email</p>
              <p>• Check if the user is created successfully</p>
              <p>• Note if email confirmation is required</p>
            </div>
            <div>
              <h4 className="font-semibold">2. Test Login Flow:</h4>
              <p>• Click "Test Login" to try logging in with test@test.com / asdasdasd</p>
              <p>• Check for proper error handling if credentials are invalid</p>
            </div>
            <div>
              <h4 className="font-semibold">3. Test Survey Integration:</h4>
              <p>• Click "Test Survey Save" to save a test survey response</p>
              <p>• Verify the data is properly stored in the database</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
