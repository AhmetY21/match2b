"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/lib/auth-context"
import {
  Plus,
  Package,
  Eye,
  MessageSquare,
  TrendingUp,
  Calendar,
  Mail,
  Building2,
  DollarSign,
  Users,
  BarChart3,
  RefreshCw,
  Edit,
  Trash2,
} from "lucide-react"
import Link from "next/link"

interface Solution {
  id: string
  company_name: string
  solution_title: string
  industries: string[]
  company_sizes: string[]
  budget_ranges: string[]
  description: string
  contact_email: string
  created_at: string
}

interface DashboardStats {
  totalSolutions: number
  totalViews: number
  totalInquiries: number
  totalMatches: number
  recentActivity: any[]
}

export function ProviderDashboard() {
  const { user } = useAuth()
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    totalSolutions: 0,
    totalViews: 0,
    totalInquiries: 0,
    totalMatches: 0,
    recentActivity: [],
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const supabase = createClient()

  const fetchProviderData = async () => {
    if (!user) {
      setLoading(false)
      return
    }

    try {
      console.log("Fetching provider data for:", user.email)

      // Fetch solutions
      const { data: solutionsData, error: solutionsError } = await supabase
        .from("solutions")
        .select("*")
        .eq("contact_email", user.email)
        .order("created_at", { ascending: false })

      if (solutionsError) {
        console.error("Error fetching solutions:", solutionsError)
      } else {
        setSolutions(solutionsData || [])

        // Calculate stats
        const totalSolutions = solutionsData?.length || 0
        // For now, we'll use dummy data for views, inquiries, and matches
        // In a real app, you'd have separate tables for tracking these metrics
        setStats({
          totalSolutions,
          totalViews: totalSolutions * Math.floor(Math.random() * 50) + 10,
          totalInquiries: totalSolutions * Math.floor(Math.random() * 10) + 2,
          totalMatches: totalSolutions * Math.floor(Math.random() * 15) + 5,
          recentActivity: generateRecentActivity(solutionsData || []),
        })
      }
    } catch (err) {
      console.error("Unexpected error:", err)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const generateRecentActivity = (solutions: Solution[]) => {
    const activities = []
    const activityTypes = ["view", "inquiry", "match"]

    for (let i = 0; i < Math.min(5, solutions.length * 2); i++) {
      const solution = solutions[Math.floor(Math.random() * solutions.length)]
      const type = activityTypes[Math.floor(Math.random() * activityTypes.length)]
      const daysAgo = Math.floor(Math.random() * 7) + 1

      activities.push({
        id: `activity-${i}`,
        type,
        solution_title: solution?.solution_title || "Unknown Solution",
        company_name: `Company ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
        timestamp: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
      })
    }

    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchProviderData()
  }

  useEffect(() => {
    fetchProviderData()
  }, [user])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "view":
        return <Eye className="h-4 w-4 text-blue-500" />
      case "inquiry":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case "match":
        return <TrendingUp className="h-4 w-4 text-purple-500" />
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />
    }
  }

  const getActivityText = (activity: any) => {
    switch (activity.type) {
      case "view":
        return `${activity.company_name} viewed your solution "${activity.solution_title}"`
      case "inquiry":
        return `${activity.company_name} sent an inquiry about "${activity.solution_title}"`
      case "match":
        return `New match found for "${activity.solution_title}" with ${activity.company_name}`
      default:
        return `Activity on "${activity.solution_title}"`
    }
  }

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto"></div>
        <p className="text-muted-foreground mt-2">Loading your dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-teal-600 rounded-lg">
                <Package className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-teal-800">{stats.totalSolutions}</h3>
                <p className="text-sm text-teal-600">Active Solutions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-blue-800">{stats.totalViews}</h3>
                <p className="text-sm text-blue-600">Total Views</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-green-600 rounded-lg">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-800">{stats.totalInquiries}</h3>
                <p className="text-sm text-green-600">Inquiries</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-purple-600 rounded-lg">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-purple-800">{stats.totalMatches}</h3>
                <p className="text-sm text-purple-600">Matches</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="solutions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="solutions">My Solutions</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="solutions" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Your Solutions
                </CardTitle>
                <CardDescription>Manage and track your solution listings</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
                  <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
                <Button asChild>
                  <Link href="/provider/submit">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Solution
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {solutions.length === 0 ? (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No solutions listed yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start by adding your first solution to connect with potential clients.
                  </p>
                  <Button asChild>
                    <Link href="/provider/submit">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Solution
                    </Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {solutions.map((solution) => (
                    <Card key={solution.id} className="border-l-4 border-l-teal-500">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-start gap-4">
                              <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 font-bold">
                                {solution.company_name.charAt(0)}
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-lg mb-1">{solution.solution_title}</h4>
                                <p className="text-muted-foreground mb-3 line-clamp-2">{solution.description}</p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                  <div className="flex items-center gap-2">
                                    <Building2 className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-sm font-medium">Industries</p>
                                      <div className="flex flex-wrap gap-1">
                                        {solution.industries?.slice(0, 2).map((industry) => (
                                          <Badge key={industry} variant="secondary" className="text-xs">
                                            {industry}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-sm font-medium">Company Sizes</p>
                                      <p className="text-xs text-muted-foreground">
                                        {solution.company_sizes?.slice(0, 2).join(", ")}
                                        {solution.company_sizes?.length > 2 &&
                                          ` +${solution.company_sizes.length - 2} more`}
                                      </p>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <div>
                                      <p className="text-sm font-medium">Budget Ranges</p>
                                      <div className="flex flex-wrap gap-1">
                                        {solution.budget_ranges?.slice(0, 1).map((budget) => (
                                          <Badge key={budget} variant="outline" className="text-xs">
                                            {budget}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {solution.contact_email}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    Listed {formatDate(solution.created_at)}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 ml-4">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
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
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Recent Activity
              </CardTitle>
              <CardDescription>Track interactions with your solutions</CardDescription>
            </CardHeader>
            <CardContent>
              {stats.recentActivity.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No recent activity</h3>
                  <p className="text-muted-foreground">
                    Activity will appear here as companies interact with your solutions.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      {getActivityIcon(activity.type)}
                      <div className="flex-1">
                        <p className="text-sm">{getActivityText(activity)}</p>
                        <p className="text-xs text-muted-foreground mt-1">{formatDate(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Performance Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Average Views per Solution</span>
                    <span className="font-semibold">
                      {stats.totalSolutions > 0 ? Math.round(stats.totalViews / stats.totalSolutions) : 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Inquiry Rate</span>
                    <span className="font-semibold">
                      {stats.totalViews > 0 ? Math.round((stats.totalInquiries / stats.totalViews) * 100) : 0}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Match Rate</span>
                    <span className="font-semibold">
                      {stats.totalSolutions > 0 ? Math.round((stats.totalMatches / stats.totalSolutions) * 100) : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button asChild className="w-full justify-start">
                    <Link href="/provider/submit">
                      <Plus className="h-4 w-4 mr-2" />
                      Add New Solution
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                    <Link href="/explore">
                      <Eye className="h-4 w-4 mr-2" />
                      View All Solutions
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start bg-transparent" disabled>
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message Center (Coming Soon)
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
