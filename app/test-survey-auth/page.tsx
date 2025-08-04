"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth-context"
import { saveSurveyResponse } from "@/app/survey/actions"
import { CheckCircle2, XCircle, AlertCircle, User, Database, TestTube } from "lucide-react"

export default function TestSurveyAuthPage() {
  const { user, loading } = useAuth()
  const [testResults, setTestResults] = useState<any[]>([])
  const [testing, setTesting] = useState(false)
  const supabase = createClient()

  const addResult = (test: string, success: boolean, message: string, details?: any) => {
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

  const testClientAuth = async () => {
    setTesting(true)
    try {
      const {
        data: { user: clientUser },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        addResult("Client Auth Test", false, `Auth error: ${error.message}`, { error })
      } else if (clientUser) {
        addResult("Client Auth Test", true, `User authenticated: ${clientUser.email}`, {
          userId: clientUser.id,
          email: clientUser.email,
          role: clientUser.user_metadata?.role,
        })
      } else {
        addResult("Client Auth Test", false, "No user found", {})
      }
    } catch (err) {
      addResult("Client Auth Test", false, `Exception: ${err}`, { err })
    }
    setTesting(false)
  }

  const testSurveySubmission = async () => {
    setTesting(true)
    const testAnswers = {
      company_size: "11-50",
      industry: "Tech",
      problem_area: "Test problem from authenticated user",
      urgent_need: true,
      budget: "$10k-$25k",
    }

    try {
      const sessionId = `test-auth-${Date.now()}`
      const result = await saveSurveyResponse(testAnswers, sessionId)

      if (result.success) {
        addResult("Survey Submission Test", true, "Survey saved successfully", {
          surveyId: result.data?.id,
          userId: result.data?.user_id,
          sessionId,
          answers: testAnswers,
        })
      } else {
        addResult("Survey Submission Test", false, result.error || "Unknown error", {
          sessionId,
          answers: testAnswers,
        })
      }
    } catch (err) {
      addResult("Survey Submission Test", false, `Exception: ${err}`, { err })
    }
    setTesting(false)
  }

  const testDirectDbInsert = async () => {
    setTesting(true)
    const testAnswers = {
      company_size: "51-200",
      industry: "Finance",
      problem_area: "Direct DB insert test",
      urgent_need: false,
      budget: "$25k-$50k",
    }

    try {
      const { data, error } = await supabase
        .from("survey_responses")
        .insert({
          session_id: `direct-test-${Date.now()}`,
          user_id: user?.id || null,
          answers: testAnswers,
        })
        .select()
        .single()

      if (error) {
        addResult("Direct DB Insert Test", false, `DB error: ${error.message}`, { error, testAnswers })
      } else {
        addResult("Direct DB Insert Test", true, "Direct insert successful", {
          surveyId: data.id,
          userId: data.user_id,
          answers: data.answers,
        })
      }
    } catch (err) {
      addResult("Direct DB Insert Test", false, `Exception: ${err}`, { err })
    }
    setTesting(false)
  }

  const testFetchSurveys = async () => {
    setTesting(true)
    if (!user) {
      addResult("Fetch Surveys Test", false, "No user logged in", {})
      setTesting(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from("survey_responses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        addResult("Fetch Surveys Test", false, `Fetch error: ${error.message}`, { error })
      } else {
        addResult("Fetch Surveys Test", true, `Found ${data.length} survey responses`, {
          count: data.length,
          surveys: data.map((s) => ({
            id: s.id,
            sessionId: s.session_id,
            userId: s.user_id,
            createdAt: s.created_at,
            hasAnswers: !!s.answers,
          })),
        })
      }
    } catch (err) {
      addResult("Fetch Surveys Test", false, `Exception: ${err}`, { err })
    }
    setTesting(false)
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Survey Authentication Test</h1>
        <p className="text-muted-foreground">Test survey saving with authenticated users</p>
      </div>

      {/* Current User Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Current Authentication Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal-600"></div>
              <span>Checking authentication...</span>
            </div>
          ) : user ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span className="font-medium">Logged in as: {user.email}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">User ID:</span>
                  <p className="font-mono text-xs break-all">{user.id}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Role:</span>
                  <Badge variant="secondary">{user.user_metadata?.role || "Not set"}</Badge>
                </div>
                <div>
                  <span className="text-muted-foreground">Email Confirmed:</span>
                  <Badge variant={user.email_confirmed_at ? "default" : "destructive"}>
                    {user.email_confirmed_at ? "Yes" : "No"}
                  </Badge>
                </div>
              </div>
            </div>
          ) : (
            <Alert className="border-orange-200 bg-orange-50">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                No user logged in. Please log in first to test survey saving.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Test Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            Test Actions
          </CardTitle>
          <CardDescription>Run these tests to diagnose authentication and survey saving issues</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button onClick={testClientAuth} disabled={testing} variant="outline" className="bg-transparent">
              Test Client Auth
            </Button>
            <Button onClick={testSurveySubmission} disabled={testing || !user}>
              Test Survey Action
            </Button>
            <Button
              onClick={testDirectDbInsert}
              disabled={testing || !user}
              variant="outline"
              className="bg-transparent"
            >
              Test Direct Insert
            </Button>
            <Button onClick={testFetchSurveys} disabled={testing || !user} variant="outline" className="bg-transparent">
              Test Fetch Surveys
            </Button>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <p className="text-sm text-muted-foreground">
              {user ? "All tests available" : "Please log in to enable survey tests"}
            </p>
            <Button onClick={clearResults} variant="ghost" size="sm">
              Clear Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Test Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Test Results
          </CardTitle>
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
                  className={`border-l-4 ${
                    result.success ? "border-l-green-500 bg-green-50" : "border-l-red-500 bg-red-50"
                  }`}
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
                        <pre className="whitespace-pre-wrap overflow-auto">
                          {JSON.stringify(result.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
