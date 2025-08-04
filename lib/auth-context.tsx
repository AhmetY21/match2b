"use client"

import { createContext, useContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

type AuthContextType = {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  // Helper function to link existing survey responses
  const linkExistingSurveyResponses = async (userId: string) => {
    try {
      // Get survey data from session storage
      const surveyAnswers = sessionStorage.getItem("surveyAnswers")
      const surveySessionId = sessionStorage.getItem("surveySessionId")

      if (surveyAnswers && surveySessionId) {
        console.log("Linking existing survey response to user:", userId)

        // Check if there's already a survey response for this session
        const { data: existingResponse } = await supabase
          .from("survey_responses")
          .select("id, user_id")
          .eq("session_id", surveySessionId)
          .single()

        if (existingResponse && !existingResponse.user_id) {
          // Update the existing response to link it to the user
          const { error } = await supabase
            .from("survey_responses")
            .update({ user_id: userId })
            .eq("session_id", surveySessionId)

          if (error) {
            console.error("Error linking survey response:", error)
          } else {
            console.log("Successfully linked survey response to user")
            // Clear session storage after successful linking
            sessionStorage.removeItem("surveyAnswers")
            sessionStorage.removeItem("surveySessionId")
          }
        } else if (!existingResponse) {
          // Create a new survey response if none exists
          const { error } = await supabase.from("survey_responses").insert({
            session_id: surveySessionId,
            user_id: userId,
            answers: JSON.parse(surveyAnswers),
          })

          if (error) {
            console.error("Error creating linked survey response:", error)
          } else {
            console.log("Successfully created linked survey response")
            // Clear session storage after successful creation
            sessionStorage.removeItem("surveyAnswers")
            sessionStorage.removeItem("surveySessionId")
          }
        }
      }
    } catch (err) {
      console.error("Exception linking survey responses:", err)
    }
  }

  const refreshUser = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      console.log("Auth context refresh:", {
        hasUser: !!user,
        userId: user?.id,
        email: user?.email,
        error: error?.message,
      })

      if (error) {
        // Only log non-session errors
        if (!error.message.includes("session") && !error.message.includes("Auth session missing")) {
          console.error("Error refreshing user:", error)
        }
        setUser(null)
      } else {
        setUser(user)
      }
    } catch (err) {
      console.error("Exception refreshing user:", err)
      setUser(null)
    }
  }

  useEffect(() => {
    let mounted = true

    const getInitialUser = async () => {
      try {
        console.log("Auth context: Getting initial user...")

        const {
          data: { user },
          error,
        } = await supabase.auth.getUser()

        console.log("Initial user check:", {
          hasUser: !!user,
          userId: user?.id,
          email: user?.email,
          error: error?.message,
        })

        if (mounted) {
          if (error) {
            // Don't log session missing errors as they're expected for anonymous users
            if (!error.message.includes("session") && !error.message.includes("Auth session missing")) {
              console.error("Error getting initial user:", error)
            }
            setUser(null)
          } else {
            setUser(user)
          }
          setLoading(false)
        }
      } catch (err) {
        console.error("Exception getting initial user:", err)
        if (mounted) {
          setUser(null)
          setLoading(false)
        }
      }
    }

    getInitialUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", {
        event,
        hasSession: !!session,
        hasUser: !!session?.user,
        userId: session?.user?.id,
        email: session?.user?.email,
      })

      if (mounted) {
        if (event === "SIGNED_OUT" || !session) {
          setUser(null)
        } else if (event === "SIGNED_IN") {
          setUser(session.user)
          // Link existing survey responses when user signs in
          if (session.user) {
            await linkExistingSurveyResponses(session.user.id)
          }
        } else if (event === "TOKEN_REFRESHED") {
          setUser(session.user)
        }
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const signOut = async () => {
    try {
      console.log("Signing out user...")
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("Error signing out:", error)
      } else {
        console.log("Sign out successful")
      }
      setUser(null)
    } catch (err) {
      console.error("Exception signing out:", err)
      setUser(null)
    }
  }

  return <AuthContext.Provider value={{ user, loading, signOut, refreshUser }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
