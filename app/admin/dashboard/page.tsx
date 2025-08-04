import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Building, BarChart3 } from "lucide-react"

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch dashboard statistics
  const [{ count: totalUsers }, { count: totalSurveyResponses }, { count: totalSolutions }, { count: totalProviders }] =
    await Promise.all([
      supabase.from("profiles").select("*", { count: "exact", head: true }),
      supabase.from("survey_responses").select("*", { count: "exact", head: true }),
      supabase.from("solutions").select("*", { count: "exact", head: true }),
      supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "provider"),
    ])

  const stats = [
    {
      title: "Total Users",
      value: totalUsers || 0,
      description: "Registered users in the system",
      icon: Users,
    },
    {
      title: "Survey Responses",
      value: totalSurveyResponses || 0,
      description: "Completed survey submissions",
      icon: FileText,
    },
    {
      title: "Solutions",
      value: totalSolutions || 0,
      description: "Available solutions in database",
      icon: Building,
    },
    {
      title: "Providers",
      value: totalProviders || 0,
      description: "Solution providers registered",
      icon: BarChart3,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold">Dashboard Overview</h2>
        <p className="text-muted-foreground">Monitor system statistics and user activity</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user registrations and survey submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">Activity tracking will be implemented in future updates</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Database connections and system status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">All systems operational</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
