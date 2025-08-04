"use server"

import { createClient } from "@/lib/supabase/server"

export async function saveSurveyResponse(answers: any, sessionId?: string) {
  try {
    console.log("=== Survey Response Save Debug ===")

    const supabase = await createClient()

    // Get current user with detailed logging
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    console.log("Server auth check result:", {
      hasUser: !!user,
      userId: user?.id,
      userEmail: user?.email,
      userRole: user?.user_metadata?.role,
      error: userError?.message,
    })

    if (userError) {
      console.log("Server auth error details:", userError)
    }

    // Prepare the data to insert
    const insertData = {
      session_id: sessionId || `session-${Date.now()}`,
      user_id: user?.id || null,
      answers: answers,
    }

    console.log("Preparing to save survey response:", {
      sessionId: insertData.session_id,
      userId: insertData.user_id,
      hasAnswers: !!insertData.answers,
      answersKeys: Object.keys(answers),
      userAuthenticated: !!user,
    })

    // Insert the survey response
    const { data, error } = await supabase.from("survey_responses").insert(insertData).select().single()

    if (error) {
      console.error("Database insert error:", error)
      return {
        success: false,
        error: `Failed to save survey: ${error.message}`,
      }
    }

    console.log("Survey response saved successfully:", {
      id: data.id,
      userId: data.user_id,
      sessionId: data.session_id,
      hasAnswers: !!data.answers,
      createdAt: data.created_at,
    })

    console.log("=== End Survey Response Save Debug ===")

    return {
      success: true,
      data: data,
    }
  } catch (err) {
    console.error("Unexpected error in saveSurveyResponse:", err)
    return {
      success: false,
      error: `Unexpected error: ${err instanceof Error ? err.message : "Unknown error"}`,
    }
  }
}
