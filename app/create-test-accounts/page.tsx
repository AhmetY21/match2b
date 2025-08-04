"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

type AccountStatus = "idle" | "creating" | "success" | "error"

interface TestAccount {
  email: string
  password: string
  role: string
  description: string
}

const testAccounts: TestAccount[] = [
  {
    email: "provider@test.com",
    password: "test123",
    role: "provider",
    description: "Solution Provider Account",
  },
  {
    email: "seeker@test.com",
    password: "test123",
    role: "seeker",
    description: "Solution Seeker Account",
  },
  {
    email: "admin@test.com",
    password: "test123",
    role: "admin",
    description: "Admin Account",
  },
]

export default function CreateTestAccountsPage() {
  const [accountStatuses, setAccountStatuses] = useState<Record<string, AccountStatus>>(
    testAccounts.reduce((acc, account) => ({ ...acc, [account.email]: "idle" }), {}),
  )
  const [messages, setMessages] = useState<Record<string, string>>({})

  const createAccount = async (account: TestAccount) => {
    const supabase = createClient()

    setAccountStatuses((prev) => ({ ...prev, [account.email]: "creating" }))
    setMessages((prev) => ({ ...prev, [account.email]: "" }))

    try {
      // First check if account already exists
      const { data: existingUser } = await supabase.auth.signInWithPassword({
        email: account.email,
        password: account.password,
      })

      if (existingUser.user) {
        setAccountStatuses((prev) => ({ ...prev, [account.email]: "success" }))
        setMessages((prev) => ({ ...prev, [account.email]: "Account already exists and is accessible" }))
        await supabase.auth.signOut()
        return
      }
    } catch (error) {
      // Account doesn't exist, continue with creation
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: account.email,
        password: account.password,
        options: {
          data: { role: account.role },
          emailRedirectTo: undefined,
        },
      })

      if (error) {
        if (error.message.includes("already registered")) {
          setAccountStatuses((prev) => ({ ...prev, [account.email]: "success" }))
          setMessages((prev) => ({ ...prev, [account.email]: "Account already exists" }))
        } else {
          setAccountStatuses((prev) => ({ ...prev, [account.email]: "error" }))
          setMessages((prev) => ({ ...prev, [account.email]: error.message }))
        }
      } else {
        setAccountStatuses((prev) => ({ ...prev, [account.email]: "success" }))
        setMessages((prev) => ({ ...prev, [account.email]: "Account created successfully" }))
      }
    } catch (err) {
      setAccountStatuses((prev) => ({ ...prev, [account.email]: "error" }))
      setMessages((prev) => ({ ...prev, [account.email]: "Failed to create account" }))
    }
  }

  const createAllAccounts = async () => {
    for (const account of testAccounts) {
      await createAccount(account)
      // Small delay between account creations
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  const getStatusIcon = (status: AccountStatus) => {
    switch (status) {
      case "creating":
        return <Loader2 className="h-4 w-4 animate-spin" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Create Test Accounts</h1>
          <p className="text-muted-foreground">Create test accounts for development and testing purposes.</p>
        </div>

        <div className="mb-6">
          <Button
            onClick={createAllAccounts}
            disabled={Object.values(accountStatuses).some((status) => status === "creating")}
            className="w-full sm:w-auto"
          >
            {Object.values(accountStatuses).some((status) => status === "creating") ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Accounts...
              </>
            ) : (
              "Create All Test Accounts"
            )}
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testAccounts.map((account) => (
            <Card key={account.email}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {account.description}
                  {getStatusIcon(accountStatuses[account.email])}
                </CardTitle>
                <CardDescription>Role: {account.role}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div>
                    <strong>Email:</strong> {account.email}
                  </div>
                  <div>
                    <strong>Password:</strong> {account.password}
                  </div>
                  {messages[account.email] && (
                    <div
                      className={`text-sm ${
                        accountStatuses[account.email] === "error" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      {messages[account.email]}
                    </div>
                  )}
                </div>
                <Button
                  onClick={() => createAccount(account)}
                  disabled={accountStatuses[account.email] === "creating"}
                  variant="outline"
                  size="sm"
                  className="w-full mt-4"
                >
                  {accountStatuses[account.email] === "creating" ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-2">Usage Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Click "Create All Test Accounts" to create all accounts at once</li>
            <li>Or create individual accounts using the buttons on each card</li>
            <li>Use these credentials to test different user roles in the application</li>
            <li>Admin users will be redirected to /admin/dashboard after login</li>
            <li>Provider and seeker users will be redirected to /dashboard after login</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
