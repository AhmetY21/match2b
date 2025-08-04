import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Brain, Lightbulb, Users, ArrowRight, CheckCircle2, Star } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-56px)] bg-white">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-teal-50 via-white to-blue-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center rounded-full bg-teal-100 px-4 py-2 text-sm font-medium text-teal-700 ring-1 ring-teal-200">
                <Star className="h-4 w-4 mr-2" />
                IDENTIFY • SEARCH • CONNECT
              </div>

              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl text-gray-900">
                Find Your Perfect{" "}
                <span className="bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent">
                  Business Solution
                </span>
              </h1>

              <p className="mx-auto max-w-2xl text-lg text-gray-600 md:text-xl leading-relaxed">
                Connect businesses with problems to businesses with solutions. Whether you're seeking solutions or
                providing them, Match2B connects you with the right partners.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button asChild size="lg" className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 text-lg">
                  <Link href="/survey" className="flex items-center">
                    Start Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="px-8 py-3 text-lg border-gray-300 hover:bg-gray-50 bg-transparent"
                >
                  <Link href="/explore">Explore Solutions</Link>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex items-center gap-8 pt-8 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  <span>Trusted by 100+ companies</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  <span>AI-powered matching</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-teal-600" />
                  <span>Free to use</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Intelligent Solutions Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-12 max-w-6xl mx-auto">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
                  Intelligent Solutions
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-gray-900">
                  AI-Powered Business Matching
                </h2>
                <p className="max-w-3xl text-lg text-gray-600 leading-relaxed">
                  Our advanced AI algorithms analyze your infrastructure needs and business requirements to connect you
                  with the perfect technical solutions.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-3 w-full">
                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Brain className="h-8 w-8 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">Smart Analysis</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Advanced AI algorithms analyze your infrastructure needs and business requirements to understand
                      exactly what you're looking for.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Lightbulb className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">Solution Matching</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Compare and evaluate solutions from leading providers, all tailored specifically to your unique
                      business needs and constraints.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-gray-900">Expert Guidance</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Receive detailed recommendations and implementation strategies from industry experts and solution
                      providers.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-br from-gray-50 to-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-12 max-w-6xl mx-auto">
              <div className="space-y-4">
                <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
                  How It Works
                </div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl text-gray-900">
                  Three Steps to Success
                </h2>
                <p className="max-w-3xl text-lg text-gray-600 leading-relaxed">
                  Our streamlined process makes it easy to find and implement the perfect technical infrastructure
                  solutions for your business.
                </p>
              </div>

              <div className="grid gap-12 md:grid-cols-3 w-full">
                <div className="flex flex-col items-center space-y-6 text-center">
                  <div className="relative">
                    <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 text-white text-2xl font-bold shadow-lg">
                      1
                    </div>
                    <div className="absolute -top-2 -right-2 h-6 w-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Star className="h-3 w-3 text-yellow-800" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900">Complete Assessment</h3>
                    <p className="text-gray-600 leading-relaxed max-w-sm">
                      Answer our intelligent questionnaire about your current infrastructure, goals, and specific
                      requirements.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-6 text-center">
                  <div className="relative">
                    <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white text-2xl font-bold shadow-lg">
                      2
                    </div>
                    <div className="absolute -top-2 -right-2 h-6 w-6 bg-green-400 rounded-full flex items-center justify-center">
                      <CheckCircle2 className="h-3 w-3 text-green-800" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900">Review Analysis</h3>
                    <p className="text-gray-600 leading-relaxed max-w-sm">
                      Get detailed insights, comparisons, and personalized recommendations for potential solutions.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-center space-y-6 text-center">
                  <div className="relative">
                    <div className="flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white text-2xl font-bold shadow-lg">
                      3
                    </div>
                    <div className="absolute -top-2 -right-2 h-6 w-6 bg-blue-400 rounded-full flex items-center justify-center">
                      <ArrowRight className="h-3 w-3 text-blue-800" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-xl font-bold text-gray-900">Implementation</h3>
                    <p className="text-gray-600 leading-relaxed max-w-sm">
                      Connect directly with solution providers and start transforming your business infrastructure.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 bg-gradient-to-r from-teal-600 to-blue-600">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-8 max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-white">
                Ready to Find Your Perfect Solution?
              </h2>
              <p className="text-xl text-teal-100 leading-relaxed">
                Join hundreds of businesses that have already transformed their operations with the right technical
                solutions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                >
                  <Link href="/survey" className="flex items-center">
                    Start Your Assessment
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-teal-600 px-8 py-3 text-lg bg-transparent"
                >
                  <Link href="/explore">Browse Solutions</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
