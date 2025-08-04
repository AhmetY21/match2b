"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth-context"
import { Calendar, Search, MessageSquare, TrendingUp, RefreshCw, AlertCircle } from "lucide-react"
import Link from "next/link"

export function SeekerDashboard() {
  const { user } = useAuth()
  const [surveyResponses, setSurveyResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const fetchSurveyResponses = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      setError(null)
      console.log("Fetching survey responses for user:", user.id, "email:", user.email)

      const { data, error } = await supabase
        .from("survey_responses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching survey responses:", error)
        setError(`Failed to load survey history: ${error.message}`)
      } else {
        console.log("Fetched survey responses:", data?.length || 0, "responses")
        setSurveyResponses(data || [])
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      setError("An unexpected error occurred while loading your survey history")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchSurveyResponses()
  }

  useEffect(() => {
    fetchSurveyResponses()
  }, [user])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-teal-100 rounded-lg">
                <Search className="h-6 w-6 text-teal-600" />
              </div>
              <div>
                <h3 className="font-semibold">Take New Survey</h3>
                <p className="text-sm text-muted-foreground">Find new solutions</p>
              </div>
            </div>
            <Button asChild className="w-full mt-4">
              <Link href="/survey">Start Assessment</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Explore Solutions</h3>
                <p className="text-sm text-muted-foreground">Browse all options</p>
              </div>
            </div>
            <Button asChild variant="outline" className="w-full mt-4 bg-transparent">
              <Link href="/explore">Browse Solutions</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Recent Contacts</h3>
                <p className="text-sm text-muted-foreground">View interactions</p>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4 bg-transparent" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Survey History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Your Survey History
              </CardTitle>
              <CardDescription>Track your past assessments and results</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium">Error loading survey history</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
              <p className="text-muted-foreground mt-2">Loading your survey history...</p>
            </div>
          ) : surveyResponses.length === 0 ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No surveys completed yet</h3>
              <p className="text-muted-foreground mb-4">
                Take your first assessment to get personalized solution recommendations.
              </p>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Make sure you're logged in when completing surveys to save your history.
                </p>
                <Button asChild>
                  <Link href="/survey">Take Your First Survey</Link>
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {surveyResponses.map((response, index) => (
                <Card key={response.id} className="border-l-4 border-l-teal-500">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-2">Assessment #{surveyResponses.length - index}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm mb-3">
                          <div>
                            <span className="text-muted-foreground">Company Size:</span>
                            <Badge variant="secondary" className="ml-1">
                              {response.answers?.company_size || "N/A"}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Industry:</span>
                            <Badge variant="secondary" className="ml-1">
                              {response.answers?.industry || "N/A"}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Budget:</span>
                            <Badge variant="outline" className="ml-1">
                              {response.answers?.budget || "N/A"}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Urgent:</span>
                            <Badge
                              variant={response.answers?.urgent_need ? "destructive" : "secondary"}
                              className="ml-1"
                            >
                              {response.answers?.urgent_need ? "Yes" : "No"}
                            </Badge>
                          </div>
                        </div>
                        {response.answers?.problem_area && (
                          <p className="text-sm text-muted-foreground">
                            <strong>Problem:</strong> {response.answers.problem_area}
                          </p>
                        )}
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-sm text-muted-foreground mb-2">{formatDate(response.created_at)}</p>
                        <Button size="sm" variant="outline" asChild>
                          <Link href="/explore">View Matches</Link>
                        </Button>
                      </div>
                    </div>
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
