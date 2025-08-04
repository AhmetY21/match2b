"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle2, Mail, Building2, DollarSign, Users, Calendar } from "lucide-react"

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

interface SolutionDetailModalProps {
  solution: Solution | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SolutionDetailModal({ solution, open, onOpenChange }: SolutionDetailModalProps) {
  if (!solution) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl">{solution.solution_title}</DialogTitle>
              <DialogDescription className="text-lg font-medium text-muted-foreground">
                {solution.company_name}
              </DialogDescription>
            </div>
            <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-muted-foreground font-bold text-xl ml-4">
              {solution.company_name.charAt(0)}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Tags Section */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Industries & Budget
            </h3>
            <div className="flex flex-wrap gap-2">
              {solution.industries.map((industry) => (
                <Badge key={industry} variant="secondary">
                  {industry}
                </Badge>
              ))}
              {solution.budget_ranges.map((budget) => (
                <Badge key={budget} variant="outline" className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  {budget}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-3">Solution Description</h3>
            <p className="text-muted-foreground leading-relaxed">{solution.description}</p>
          </div>

          <Separator />

          {/* Company Details */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Company Size Compatibility
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {solution.company_sizes.map((size) => (
                <div key={size} className="flex items-center gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                  <span>Serves companies with {size} employees</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Contact Information
            </h3>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Get in touch with the solution provider:</p>
              <p className="font-medium">{solution.contact_email}</p>
            </div>
          </div>

          {/* Metadata */}
          <div className="text-xs text-muted-foreground flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            Listed on {formatDate(solution.created_at)}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1" asChild>
              <a href={`mailto:${solution.contact_email}?subject=Inquiry about ${solution.solution_title}`}>
                Contact Provider
              </a>
            </Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Save for Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
