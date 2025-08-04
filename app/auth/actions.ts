"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirm-password") as string
  const role = formData.get("role") as string

  // Validation
  if (!email || !password || !role) {
    return { message: "Please fill in all fields", success: false }
  }

  if (password !== confirmPassword) {
    return { message: "Passwords don't match", success: false }
  }

  if (password.length < 6) {
    return { message: "Password must be at least 6 characters", success: false }
  }

  if (role === "admin") {
    return { message: "Invalid role specified", success: false }
  }

  try {
    const supabase = await createClient()

    console.log("Attempting signup for:", email.trim().toLowerCase())

    // Create user account
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: email.trim().toLowerCase(),
      password,
      options: {
        data: { role },
        emailRedirectTo: undefined,
      },
    })

    if (signUpError) {
      console.error("Signup error:", signUpError)
      return {
        message: signUpError.message.includes("already registered")
          ? "This email is already registered. Try signing in instead."
          : "Account creation failed. Please try again.",
        success: false,
      }
    }

    console.log("Signup successful, attempting auto sign-in...")

    // Auto sign-in after successful signup
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (signInError) {
      console.error("Auto sign-in error:", signInError)
      return {
        message: "Account created successfully! Please sign in.",
        success: true,
      }
    }

    if (signInData.user) {
      console.log("Auto sign-in successful for:", signInData.user.email)

      // Link any existing survey responses from session storage
      await linkExistingSurveyResponses(supabase, signInData.user.id)

      revalidatePath("/", "layout")

      // Redirect to dashboard after successful signup and auto sign-in
      redirect("/dashboard")
    }

    return { message: "Account created successfully!", success: true }
  } catch (err: any) {
    // Check if this is a Next.js redirect (which is expected)
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err
    }

    console.error("Signup exception:", err)
    return { message: "Something went wrong. Please try again.", success: false }
  }
}

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return {
      message: "Please enter both email and password",
    }
  }

  try {
    const supabase = await createClient()

    console.log("Attempting login for:", email.trim().toLowerCase())

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    })

    if (error) {
      console.error("Login error:", error)
      return {
        message: error.message.includes("Invalid login credentials")
          ? "Invalid email or password"
          : "Login failed. Please try again.",
      }
    }

    if (data.user) {
      console.log("Login successful for:", data.user.email)

      // Link any existing survey responses from session storage
      await linkExistingSurveyResponses(supabase, data.user.id)

      revalidatePath("/", "layout")

      // Check if user is admin and redirect accordingly
      const userRole = data.user.user_metadata?.role
      if (userRole === "admin") {
        redirect("/admin/dashboard")
      } else {
        redirect("/dashboard")
      }
    } else {
      return { message: "Authentication failed. Please try again." }
    }
  } catch (err: any) {
    // Check if this is a Next.js redirect (which is expected)
    if (err?.digest?.startsWith("NEXT_REDIRECT")) {
      throw err
    }

    console.error("Login exception:", err)
    return { message: "Something went wrong. Please try again." }
  }
}

// Helper function to link existing survey responses to newly authenticated user
async function linkExistingSurveyResponses(supabase: any, userId: string) {
  try {
    // This will be called from the client side after successful auth
    // We'll handle this in the client-side auth context instead
    console.log("Survey linking will be handled client-side for user:", userId)
  } catch (err) {
    console.error("Error linking survey responses:", err)
  }
}
