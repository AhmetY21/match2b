import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/lib/auth-context"
import { Header } from "@/components/header"
import { ErrorBoundary } from "@/components/error-boundary"
import type { ReactNode } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Match2B - Business Solution Matching Platform",
  description: "Connect businesses with the right solutions through intelligent matching",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <AuthProvider>
            <Header />
            <main>{children}</main>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
