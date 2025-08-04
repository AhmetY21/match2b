"use server"

import { createClient } from "@/lib/supabase/server"

export async function submitSolution(prevState: any, formData: FormData) {
  const companyName = formData.get("company-name") as string
  const solutionName = formData.get("solution-name") as string
  const industry = formData.get("industry") as string
  const description = formData.get("description") as string
  const contactEmail = formData.get("contact-email") as string

  // Get selected company sizes and budget ranges
  const companySizes = formData.getAll("company-sizes") as string[]
  const budgetRanges = formData.getAll("budget-ranges") as string[]

  // Validation
  if (!companyName || !solutionName || !industry || !description || !contactEmail) {
    return {
      message: "All required fields must be filled out",
      success: false,
    }
  }

  if (companySizes.length === 0) {
    return {
      message: "Please select at least one company size you serve",
      success: false,
    }
  }

  if (budgetRanges.length === 0) {
    return {
      message: "Please select at least one budget range",
      success: false,
    }
  }

  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("solutions")
      .insert({
        company_name: companyName,
        solution_title: solutionName,
        industries: [industry], // Store as array for consistency
        company_sizes: companySizes,
        budget_ranges: budgetRanges,
        description: description,
        contact_email: contactEmail,
      })
      .select()
      .single()

    if (error) {
      console.error("Error submitting solution:", error)
      return {
        message: "Failed to submit solution. Please try again.",
        success: false,
      }
    }

    console.log("Solution submitted successfully:", data)
    return {
      message: "Solution submitted successfully!",
      success: true,
    }
  } catch (err) {
    console.error("Unexpected error:", err)
    return {
      message: "An unexpected error occurred. Please try again.",
      success: false,
    }
  }
}
