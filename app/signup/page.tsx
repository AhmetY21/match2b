"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { signup } from "./actions"

function SignupButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="w-full" type="submit" aria-disabled={pending}>
      {pending ? "Creating Account..." : "Create Account"}
    </Button>
  )
}

export default function SignupPage() {
  const [state, formAction] = useActionState(signup, undefined)

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Enter your information to create your Match2B account.</CardDescription>
        </CardHeader>
        <form action={formAction} className="grid gap-4">
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input id="confirm-password" name="confirm-password" type="password" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">I am a:</Label>
              <select
                id="role"
                name="role"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                <option value="">Select role</option>
                <option value="seeker">Solution Seeker</option>
                <option value="provider">Solution Provider</option>
              </select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <SignupButton />
            {state?.message && (
              <p className={`mt-2 text-sm ${state.success ? "text-green-500" : "text-red-500"}`}>{state.message}</p>
            )}
            <div className="mt-4 text-center text-sm w-full">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
