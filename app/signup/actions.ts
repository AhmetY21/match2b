"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function signup(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirm-password") as string
  const role = formData.get("role") as string

  if (!email || !password || !role) {
    return {
      message: "All fields are required",
      success: false,
    }
  }

  if (password !== confirmPassword) {
    return {
      message: "Passwords do not match",
      success: false,
    }
  }

  if (password.length < 6) {
    return {
      message: "Password must be at least 6 characters long",
      success: false,
    }
  }

  const supabase = createClient()

  try {
    // Sign up without email confirmation
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: role,
        },
        emailRedirectTo: undefined, // Disable email confirmation
      },
    })

    if (error) {
      return {
        message: error.message,
        success: false,
      }
    }

    // Immediately sign in the user
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      return {
        message: "Account created but login failed. Please try logging in.",
        success: false,
      }
    }

    revalidatePath("/", "layout")
    redirect("/dashboard")
  } catch (err) {
    return {
      message: "An unexpected error occurred. Please try again.",
      success: false,
    }
  }
}
