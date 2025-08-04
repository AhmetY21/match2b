"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2 } from "lucide-react"
import { SolutionDetailModal } from "./solution-detail-modal"

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

interface SolutionCardProps {
  solution: Solution
}

export function SolutionCard({ solution }: SolutionCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const truncateDescription = (text: string, maxWords = 15) => {
    const words = text.split(" ")
    if (words.length <= maxWords) return text
    return words.slice(0, maxWords).join(" ") + "..."
  }

  return (
    <>
      <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-lg">{solution.solution_title}</CardTitle>
              <CardDescription className="font-medium">{solution.company_name}</CardDescription>
            </div>
            {/* Company Logo Placeholder */}
            <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-muted-foreground font-bold">
              {solution.company_name.charAt(0)}
            </div>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {solution.industries.slice(0, 2).map((industry) => (
              <Badge key={industry} variant="secondary">
                {industry}
              </Badge>
            ))}
            {solution.budget_ranges.slice(0, 1).map((budget) => (
              <Badge key={budget} variant="outline">
                {budget}
              </Badge>
            ))}
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm text-muted-foreground mb-4">{truncateDescription(solution.description)}</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>Serves: {solution.company_sizes.slice(0, 2).join(", ")}</span>
              {solution.company_sizes.length > 2 && (
                <span className="text-muted-foreground">+{solution.company_sizes.length - 2} more</span>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => setIsModalOpen(true)}>
            View Details
          </Button>
        </CardFooter>
      </Card>

      <SolutionDetailModal solution={solution} open={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}
