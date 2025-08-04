"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"

export async function login(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return {
      message: "Email and password are required",
    }
  }

  const supabase = createClient()

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        message: "Invalid email or password",
      }
    }

    revalidatePath("/", "layout")
    redirect("/dashboard")
  } catch (err) {
    return {
      message: "An unexpected error occurred. Please try again.",
    }
  }
}
