"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

export default function TestDbPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const testConnection = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("solutions").select("count").limit(1)
      setResult({ success: !error, data, error: error?.message })
    } catch (err) {
      setResult({ success: false, error: `Connection failed: ${err}` })
    }
    setLoading(false)
  }

  const testSurveyInsert = async () => {
    setLoading(true)
    try {
      const testData = {
        session_id: `test-${Date.now()}`,
        user_id: null,
        answers: { test: "data", company_size: "11-50" },
      }

      const { data, error } = await supabase.from("survey_responses").insert(testData).select().single()

      setResult({
        success: !error,
        data,
        error: error?.message,
        details: error,
      })
    } catch (err) {
      setResult({ success: false, error: `Insert failed: ${err}` })
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Database Connection Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <Button onClick={testConnection} disabled={loading}>
              Test Connection
            </Button>
            <Button onClick={testSurveyInsert} disabled={loading} variant="outline">
              Test Survey Insert
            </Button>
          </div>

          {result && (
            <div className="p-4 bg-gray-100 rounded">
              <h3 className="font-semibold mb-2">Result:</h3>
              <pre className="text-xs overflow-auto">{JSON.stringify(result, null, 2)}</pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
