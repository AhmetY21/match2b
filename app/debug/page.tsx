import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function DebugPage() {
  const envVars = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✅ Set" : "❌ Missing",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✅ Set" : "❌ Missing",
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ? "✅ Set" : "❌ Missing",
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Environment Variables Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(envVars).map(([key, status]) => (
              <div key={key} className="flex justify-between items-center">
                <span className="font-mono text-sm">{key}</span>
                <Badge variant={status.includes("✅") ? "default" : "destructive"}>{status}</Badge>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Supabase URL Preview:</h3>
            <p className="font-mono text-xs break-all">{process.env.NEXT_PUBLIC_SUPABASE_URL || "Not set"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
