"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { submitSolution } from "./actions"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Submitting Solution..." : "Submit Solution"}
    </Button>
  )
}

export default function ProviderSubmitPage() {
  const [state, formAction] = useActionState(submitSolution, undefined)

  return (
    <div className="container mx-auto max-w-3xl px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Solution Provider Portal</h1>
        <p className="text-muted-foreground">
          Share your business solution with companies looking for exactly what you offer.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit Your Solution</CardTitle>
          <CardDescription>
            Fill out the details below to list your solution and connect with potential clients.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {state?.success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your solution has been submitted successfully! It will appear in the solutions directory.
              </AlertDescription>
            </Alert>
          )}

          {state?.message && !state?.success && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{state.message}</AlertDescription>
            </Alert>
          )}

          <form action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name *</Label>
                <Input id="company-name" name="company-name" placeholder="e.g., Acme Solutions Inc." required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="solution-name">Solution Name *</Label>
                <Input
                  id="solution-name"
                  name="solution-name"
                  placeholder="e.g., AI-Powered Analytics Platform"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Primary Industry *</Label>
              <Select name="industry" required>
                <SelectTrigger id="industry">
                  <SelectValue placeholder="Select the industry you serve" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Technology</SelectItem>
                  <SelectItem value="finance">Finance & Banking</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="retail">Retail & E-commerce</SelectItem>
                  <SelectItem value="manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="saas">Software as a Service</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Company Sizes You Serve * (select all that apply)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {["1-10", "11-50", "51-200", "201-1000", "1000+"].map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <Checkbox id={`size-${size}`} name="company-sizes" value={size} />
                    <Label htmlFor={`size-${size}`} className="font-normal">
                      {size} employees
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Budget Ranges * (select all that apply)</Label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {["$0-$10k", "$10k-$25k", "$25k-$50k", "$50k-$100k", "$100k+"].map((range) => (
                  <div key={range} className="flex items-center space-x-2">
                    <Checkbox id={`budget-${range}`} name="budget-ranges" value={range} />
                    <Label htmlFor={`budget-${range}`} className="font-normal">
                      {range}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Solution Description *</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your solution, its key features, benefits, and how it solves business problems..."
                rows={5}
                required
              />
              <p className="text-sm text-muted-foreground">
                Provide a detailed description to help potential clients understand your solution.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-email">Contact Email *</Label>
              <Input id="contact-email" name="contact-email" type="email" placeholder="e.g., sales@acme.com" required />
              <p className="text-sm text-muted-foreground">
                This email will be visible to potential clients who want to contact you.
              </p>
            </div>

            <div className="pt-4">
              <SubmitButton />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
