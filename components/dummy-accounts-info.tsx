import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { User, Mail, Lock, UserCheck } from "lucide-react"
import Link from "next/link"

export function DummyAccountsInfo() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Test Accounts Available
          </CardTitle>
          <CardDescription>Use these pre-configured accounts to test the platform functionality</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Solution Provider Account */}
          <div className="border rounded-lg p-4 bg-teal-50 border-teal-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-teal-600 rounded-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-teal-800">Solution Provider Account</h3>
                <Badge variant="secondary" className="bg-teal-100 text-teal-700">
                  Provider
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-teal-600" />
                <span className="font-mono">provider@test.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-teal-600" />
                <span className="font-mono">provider123</span>
              </div>
            </div>
            <div className="mt-3 text-sm text-teal-700">
              <p>
                <strong>Features:</strong> Submit solutions, view provider dashboard, manage listings
              </p>
              <p>
                <strong>Pre-loaded:</strong> 3 sample solutions with analytics data
              </p>
            </div>
          </div>

          {/* Solution Seeker Account */}
          <div className="border rounded-lg p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-800">Solution Seeker Account</h3>
                <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                  Seeker
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="font-mono">seeker@test.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-blue-600" />
                <span className="font-mono">seeker123</span>
              </div>
            </div>
            <div className="mt-3 text-sm text-blue-700">
              <p>
                <strong>Features:</strong> Take surveys, view matches, browse solutions
              </p>
              <p>
                <strong>Pre-loaded:</strong> 2 completed survey responses with history
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button asChild>
              <Link href="/auth">Try Test Accounts</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
