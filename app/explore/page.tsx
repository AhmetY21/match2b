"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SolutionCard } from "@/components/solution-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ListFilter, Search, Loader2, AlertCircle, Filter, X } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/lib/auth-context"
import { createClient } from "@/lib/supabase/client"
import { Alert, AlertDescription } from "@/components/ui/alert"

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

export default function ExplorePage() {
  const { user, loading: authLoading } = useAuth()
  const [solutions, setSolutions] = useState<Solution[]>([])
  const [filteredSolutions, setFilteredSolutions] = useState<Solution[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter states
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedIndustry, setSelectedIndustry] = useState<string>("all")
  const [selectedCompanySizes, setSelectedCompanySizes] = useState<string[]>([])
  const [selectedBudgetRanges, setSelectedBudgetRanges] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<"newest" | "alphabetical">("newest")

  const supabase = createClient()

  // Only show submit button for authenticated providers
  const showSubmitButton = !authLoading && user?.user_metadata?.role === "provider"

  // Fetch solutions from database
  const fetchSolutions = async () => {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase.from("solutions").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching solutions:", error)
        setError("Failed to load solutions. Please try again.")
        return
      }

      console.log("Fetched solutions:", data?.length || 0)
      setSolutions(data || [])
      setFilteredSolutions(data || [])
    } catch (err) {
      console.error("Exception fetching solutions:", err)
      setError("An unexpected error occurred while loading solutions.")
    } finally {
      setLoading(false)
    }
  }

  // Apply filters
  const applyFilters = () => {
    let filtered = [...solutions]

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (solution) =>
          solution.solution_title.toLowerCase().includes(term) ||
          solution.company_name.toLowerCase().includes(term) ||
          solution.description.toLowerCase().includes(term) ||
          solution.industries.some((industry) => industry.toLowerCase().includes(term)),
      )
    }

    // Industry filter
    if (selectedIndustry !== "all") {
      filtered = filtered.filter((solution) =>
        solution.industries.some((industry) => industry.toLowerCase() === selectedIndustry.toLowerCase()),
      )
    }

    // Company size filter
    if (selectedCompanySizes.length > 0) {
      filtered = filtered.filter((solution) =>
        solution.company_sizes.some((size) => selectedCompanySizes.includes(size)),
      )
    }

    // Budget range filter
    if (selectedBudgetRanges.length > 0) {
      filtered = filtered.filter((solution) =>
        solution.budget_ranges.some((budget) => selectedBudgetRanges.includes(budget)),
      )
    }

    // Sort
    if (sortBy === "alphabetical") {
      filtered.sort((a, b) => a.solution_title.localeCompare(b.solution_title))
    } else {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }

    setFilteredSolutions(filtered)
  }

  // Handle company size filter change
  const handleCompanySizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setSelectedCompanySizes([...selectedCompanySizes, size])
    } else {
      setSelectedCompanySizes(selectedCompanySizes.filter((s) => s !== size))
    }
  }

  // Handle budget range filter change
  const handleBudgetRangeChange = (budget: string, checked: boolean) => {
    if (checked) {
      setSelectedBudgetRanges([...selectedBudgetRanges, budget])
    } else {
      setSelectedBudgetRanges(selectedBudgetRanges.filter((b) => b !== budget))
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("")
    setSelectedIndustry("all")
    setSelectedCompanySizes([])
    setSelectedBudgetRanges([])
    setSortBy("newest")
  }

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0
    if (selectedIndustry !== "all") count++
    if (selectedCompanySizes.length > 0) count++
    if (selectedBudgetRanges.length > 0) count++
    return count
  }

  // Fetch solutions on component mount
  useEffect(() => {
    fetchSolutions()
  }, [])

  // Apply filters when filter states change
  useEffect(() => {
    applyFilters()
  }, [solutions, searchTerm, selectedIndustry, selectedCompanySizes, selectedBudgetRanges, sortBy])

  const companySizeOptions = ["1-10", "11-50", "51-200", "201-1000", "1000+"]
  const budgetRangeOptions = ["$0-$10k", "$10k-$25k", "$25k-$50k", "$50k-$100k", "$100k+"]
  const industryOptions = [
    "Tech",
    "Finance",
    "Healthcare",
    "Retail",
    "Manufacturing",
    "SaaS",
    "Consulting",
    "Education",
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 md:px-6 py-8">
          <div className="max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Explore Solutions</h1>
            <p className="text-lg text-gray-600">
              Discover the perfect business solutions tailored to your needs. Filter by industry, company size, and
              budget to find exactly what you're looking for.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <Card className="sticky top-4">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Filters
                    {getActiveFilterCount() > 0 && (
                      <Badge variant="secondary" className="ml-2">
                        {getActiveFilterCount()}
                      </Badge>
                    )}
                  </CardTitle>
                  {getActiveFilterCount() > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Industry Filter */}
                <div className="space-y-3">
                  <Label htmlFor="industry" className="text-sm font-semibold text-gray-900">
                    Industry
                  </Label>
                  <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                    <SelectTrigger id="industry" className="w-full">
                      <SelectValue placeholder="All Industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      {industryOptions.map((industry) => (
                        <SelectItem key={industry} value={industry.toLowerCase()}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* Company Size Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-900">Company Size</Label>
                  <div className="space-y-3">
                    {companySizeOptions.map((size) => (
                      <div key={size} className="flex items-center space-x-3">
                        <Checkbox
                          id={`size-${size}`}
                          checked={selectedCompanySizes.includes(size)}
                          onCheckedChange={(checked) => handleCompanySizeChange(size, checked as boolean)}
                        />
                        <Label htmlFor={`size-${size}`} className="text-sm font-medium cursor-pointer">
                          {size} employees
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Budget Range Filter */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-900">Budget Range</Label>
                  <div className="space-y-3">
                    {budgetRangeOptions.map((budget) => (
                      <div key={budget} className="flex items-center space-x-3">
                        <Checkbox
                          id={`budget-${budget}`}
                          checked={selectedBudgetRanges.includes(budget)}
                          onCheckedChange={(checked) => handleBudgetRangeChange(budget, checked as boolean)}
                        />
                        <Label htmlFor={`budget-${budget}`} className="text-sm font-medium cursor-pointer">
                          {budget}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0">
            {/* Search and Sort Bar */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      placeholder="Search solutions, companies, or keywords..."
                      className="pl-10 h-12"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex items-center gap-2 h-12 px-4 bg-transparent">
                          <ListFilter className="h-4 w-4" />
                          Sort by
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSortBy("newest")}>Newest First</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortBy("alphabetical")}>
                          Alphabetical (A-Z)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    {showSubmitButton && (
                      <Button asChild className="h-12 px-6">
                        <Link href="/provider/submit">Submit Solution</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  {loading
                    ? "Loading solutions..."
                    : `Showing ${filteredSolutions.length} of ${solutions.length} solutions`}
                </p>
                {getActiveFilterCount() > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Active filters:</span>
                    <Badge variant="outline">{getActiveFilterCount()}</Badge>
                  </div>
                )}
              </div>
            </div>

            {/* Error State */}
            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  {error}
                  <Button variant="link" className="p-0 h-auto ml-2 text-red-600" onClick={fetchSolutions}>
                    Try again
                  </Button>
                </AlertDescription>
              </Alert>
            )}

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-600" />
                  <p className="text-gray-600">Loading solutions...</p>
                </div>
              </div>
            ) : filteredSolutions.length === 0 ? (
              /* Empty State */
              <Card className="text-center py-16">
                <CardContent>
                  <Search className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No solutions found</h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    {solutions.length === 0
                      ? "No solutions have been submitted yet. Be the first to share your solution!"
                      : "Try adjusting your filters or search terms to find what you're looking for."}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    {solutions.length === 0 && showSubmitButton && (
                      <Button asChild>
                        <Link href="/provider/submit">Submit the First Solution</Link>
                      </Button>
                    )}
                    {solutions.length > 0 && (
                      <Button variant="outline" onClick={clearFilters}>
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              /* Solutions Grid */
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredSolutions.map((solution) => (
                  <SolutionCard key={solution.id} solution={solution} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
