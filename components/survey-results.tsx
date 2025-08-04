"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Building2, DollarSign, Users, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

type Solution = {
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

interface SurveyResultsProps {
  answers: any
  isLoggedIn: boolean
}

export function SurveyResults({ answers, isLoggedIn }: SurveyResultsProps) {
  const [matches, setMatches] = useState<Solution[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  const fetchMatches = async () => {
    try {
      setLoading(true)

      // Fetch all solutions
      const { data: solutions, error } = await supabase
        .from("solutions")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching solutions:", error)
        return
      }

      if (!solutions || solutions.length === 0) {
        setMatches([])
        return
      }

      // Filter and score solutions based on survey answers
      const scoredSolutions = solutions
        .map((solution) => {
          let score = 0
          let maxScore = 0

          // Industry match (40% weight)
          maxScore += 40
          if (
            answers.industry &&
            solution.industries.some((industry) => industry.toLowerCase() === answers.industry.toLowerCase())
          ) {
            score += 40
          }

          // Company size match (30% weight)
          maxScore += 30
          if (answers.company_size && solution.company_sizes.includes(answers.company_size)) {
            score += 30
          }

          // Budget match (30% weight)
          maxScore += 30
          if (answers.budget && solution.budget_ranges.includes(answers.budget)) {
            score += 30
          }

          const matchPercentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0

          return {
            ...solution,
            match_score: matchPercentage,
          }
        })
        .filter((solution) => solution.match_score > 0) // Only show solutions with some match
        .sort((a, b) => b.match_score - a.match_score) // Sort by match score
        .slice(0, 6) // Take top 6 matches

      setMatches(scoredSolutions)
    } catch (err) {
      console.error("Exception fetching matches:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMatches()
  }, [answers])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h1 className="text-3xl font-bold">Perfect! We Found Your Matches</h1>
        <p className="text-muted-foreground text-lg">
          Based on your responses, here are the top solutions tailored for your business needs.
        </p>
        {!isLoggedIn && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-2xl mx-auto">
            <p className="text-blue-800 text-sm">
              <strong>💡 Tip:</strong> Sign up to save your survey results and track your solution search history!
            </p>
          </div>
        )}
      </div>

      {/* Survey Summary */}
      <Card className="bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
        <CardContent className="p-6">
          <h3 className="font-semibold mb-4 text-teal-800">Your Requirements Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-teal-600" />
              <p className="text-sm font-medium">{answers.company_size || "Not specified"}</p>
              <p className="text-xs text-muted-foreground">Company Size</p>
            </div>
            <div className="text-center">
              <Building2 className="h-6 w-6 mx-auto mb-2 text-teal-600" />
              <p className="text-sm font-medium">{answers.industry || "Not specified"}</p>
              <p className="text-xs text-muted-foreground">Industry</p>
            </div>
            <div className="text-center">
              <DollarSign className="h-6 w-6 mx-auto mb-2 text-teal-600" />
              <p className="text-sm font-medium">{answers.budget || "Not specified"}</p>
              <p className="text-xs text-muted-foreground">Budget</p>
            </div>
            <div className="text-center">
              <CheckCircle2 className="h-6 w-6 mx-auto mb-2 text-teal-600" />
              <p className="text-sm font-medium">{answers.urgent_need ? "Yes" : "No"}</p>
              <p className="text-xs text-muted-foreground">Urgent Need</p>
            </div>
          </div>
          {answers.problem_area && (
            <div className="mt-4 p-3 bg-white rounded-lg">
              <p className="text-sm">
                <strong>Problem Area:</strong> {answers.problem_area}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Top Matches */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Your Top Matches</h2>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Finding your perfect matches...</p>
            </div>
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="font-semibold mb-2">No matches found yet</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find solutions that match your specific criteria. Try exploring all available solutions.
            </p>
            <Button asChild variant="outline" className="bg-transparent">
              <Link href="/explore">Browse All Solutions</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matches.map((solution, index) => (
              <Card
                key={solution.id}
                className="relative hover:shadow-lg transition-all duration-200 border-2 hover:border-teal-200"
              >
                {/* Match Score Badge */}
                <div className="absolute -top-3 -right-3 bg-teal-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-sm">
                  {solution.match_score}%
                </div>

                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">{solution.solution_title}</CardTitle>
                      <CardDescription className="font-medium text-teal-700">{solution.company_name}</CardDescription>
                    </div>
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 font-bold ml-3">
                      {solution.company_name.charAt(0)}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {solution.industries.slice(0, 2).map((industry) => (
                      <Badge key={industry} variant="secondary" className="text-xs">
                        {industry}
                      </Badge>
                    ))}
                    <Badge variant="outline" className="text-xs">
                      {solution.budget_ranges[0]}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="py-3">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{solution.description}</p>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <span>Perfect for {solution.company_sizes.join(", ")} companies</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <span>Fits your budget range</span>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-3">
                  <Button className="w-full" size="sm" asChild>
                    <a href={`mailto:${solution.contact_email}?subject=Inquiry about ${solution.solution_title}`}>
                      Contact Provider
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
        {isLoggedIn ? (
          <>
            <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700">
              <Link href="/dashboard">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent">
              <Link href="/explore">Browse All Solutions</Link>
            </Button>
          </>
        ) : (
          <>
            <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700">
              <Link href="/auth">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                Save Results - Sign Up
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-transparent">
              <Link href="/explore">Browse All Solutions</Link>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
