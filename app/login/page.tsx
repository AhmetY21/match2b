"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { login } from "./actions"

function LoginButton() {
  const { pending } = useFormStatus()
  return (
    <Button className="w-full" type="submit" aria-disabled={pending}>
      {pending ? "Signing In..." : "Sign In"}
    </Button>
  )
}

export default function LoginPage() {
  const [errorMessage, formAction] = useActionState(login, undefined)

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-56px)] bg-gray-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account.</CardDescription>
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
          </CardContent>
          <CardFooter className="flex flex-col items-start">
            <LoginButton />
            {errorMessage && <p className="mt-2 text-sm text-red-500">{errorMessage.message}</p>}
            <div className="mt-4 text-center text-sm w-full">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="underline">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
