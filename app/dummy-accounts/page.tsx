import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Lock, UserCheck, Database, AlertCircle, Search } from "lucide-react"
import Link from "next/link"

export default function DummyAccountsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Test Accounts & Setup</h1>
        <p className="text-muted-foreground">Use these pre-configured accounts to test all platform features</p>
      </div>

      {/* Important Notice */}
      <Card className="mb-6 border-orange-200 bg-orange-50">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-orange-800 mb-2">Setup Required</h3>
              <p className="text-orange-700 text-sm mb-3">
                These accounts need to be created manually through the signup process. The database has been prepared
                with sample data.
              </p>
              <ol className="text-orange-700 text-sm space-y-1 list-decimal list-inside">
                <li>
                  Go to the{" "}
                  <Link href="/auth" className="underline font-medium">
                    Auth page
                  </Link>
                </li>
                <li>Create each account using the credentials below</li>
                <li>The sample data will automatically be associated with the accounts</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Solution Provider Account */}
        <Card className="border-teal-200 bg-teal-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-600 rounded-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-teal-800">Solution Provider</CardTitle>
                <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                  Provider Role
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
                <Mail className="h-4 w-4 text-teal-600" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="font-mono text-sm">provider@test.com</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
                <Lock className="h-4 w-4 text-teal-600" />
                <div>
                  <p className="text-sm font-medium">Password</p>
                  <p className="font-mono text-sm">provider123</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-teal-200">
              <h4 className="font-semibold text-teal-800 mb-2">Features Available:</h4>
              <ul className="text-sm text-teal-700 space-y-1">
                <li>• Submit and manage solutions</li>
                <li>• View provider dashboard with analytics</li>
                <li>• Track solution performance</li>
                <li>• Manage customer inquiries</li>
              </ul>
            </div>

            <div className="pt-3 border-t border-teal-200">
              <h4 className="font-semibold text-teal-800 mb-2">Pre-loaded Data:</h4>
              <ul className="text-sm text-teal-700 space-y-1">
                <li>• 3 sample solutions</li>
                <li>• Analytics data (views, inquiries)</li>
                <li>• Recent activity history</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Solution Seeker Account */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-blue-800">Solution Seeker</CardTitle>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Seeker Role
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
                <Mail className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="font-mono text-sm">seeker@test.com</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white rounded-lg">
                <Lock className="h-4 w-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium">Password</p>
                  <p className="font-mono text-sm">seeker123</p>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Features Available:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Take solution assessment surveys</li>
                <li>• View personalized matches</li>
                <li>• Browse solution directory</li>
                <li>• Track survey history</li>
              </ul>
            </div>

            <div className="pt-3 border-t border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Pre-loaded Data:</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 2 completed survey responses</li>
                <li>• Survey history with results</li>
                <li>• Personalized recommendations</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Get started with testing the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button asChild className="h-auto p-4 flex flex-col items-start">
              <Link href="/auth">
                <User className="h-5 w-5 mb-2" />
                <span className="font-semibold">Create Test Accounts</span>
                <span className="text-xs opacity-80">Sign up with the credentials above</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-start bg-transparent">
              <Link href="/test-auth">
                <Database className="h-5 w-5 mb-2" />
                <span className="font-semibold">Test Authentication</span>
                <span className="text-xs opacity-80">Verify login and database connections</span>
              </Link>
            </Button>

            <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-start bg-transparent">
              <Link href="/survey">
                <Search className="h-5 w-5 mb-2" />
                <span className="font-semibold">Try Survey Flow</span>
                <span className="text-xs opacity-80">Test the complete user journey</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Database Setup Status */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Setup Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Solutions table with sample data</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Survey responses table ready</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <span className="text-sm">User accounts need manual creation</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
