"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Loader2 } from "lucide-react"
import { saveSurveyResponse } from "./actions"
import { useAuth } from "@/lib/auth-context"
import { SurveyResults } from "@/components/survey-results"
import { createClient } from "@/lib/supabase/client"

interface SurveyQuestion {
  id: string
  question_id: string
  question_text: string
  question_type: string
  options: string[] | null
  order_index: number
  is_required: boolean
}

export default function SurveyPage() {
  const [questions, setQuestions] = useState<SurveyQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: any }>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const supabase = createClient()

  // Fetch questions from database
  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from("survey_questions")
        .select("*")
        .eq("survey_type", "default")
        .eq("is_active", true)
        .order("order_index")

      if (error) {
        console.error("Error fetching questions:", error)
        if (error.message.includes('relation "public.survey_questions" does not exist')) {
          setSubmitError("Survey questions table not found. Please ensure the database setup script has been run.")
        } else {
          setSubmitError("Failed to load survey questions. Please try again.")
        }
        return
      }

      setQuestions(data || [])
    } catch (err) {
      console.error("Exception fetching questions:", err)
      setSubmitError("An unexpected error occurred while loading the survey.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuestions()
  }, [])

  useEffect(() => {
    // Reset state when questions change
    if (questions.length > 0) {
      setCurrentQuestionIndex(0)
      setAnswers({})
      setIsCompleted(false)
      setSubmitError(null)
    }
  }, [questions])

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  const handleNext = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Submit the survey
      setIsSubmitting(true)
      setSubmitError(null)

      try {
        const sessionId = `survey-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const result = await saveSurveyResponse(answers, sessionId)

        if (result.success) {
          // Store in session storage
          if (typeof window !== "undefined") {
            sessionStorage.setItem("surveyAnswers", JSON.stringify(answers))
            sessionStorage.setItem("surveySessionId", sessionId)
          }
          setIsCompleted(true)
        } else {
          setSubmitError(result.error || "Failed to save survey response")
        }
      } catch (err) {
        console.error("Error submitting survey:", err)
        setSubmitError("An unexpected error occurred while saving your survey")
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading survey questions...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="font-semibold mb-2">Survey Unavailable</h3>
            <p className="text-muted-foreground mb-4">
              No survey questions are currently available. Please try again later.
            </p>
            <Button onClick={fetchQuestions}>Retry</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progressValue = ((currentQuestionIndex + 1) / questions.length) * 100
  const canProceed = currentQuestion.is_required
    ? answers[currentQuestion.question_id] !== undefined && answers[currentQuestion.question_id] !== ""
    : true

  if (isCompleted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <SurveyResults answers={answers} isLoggedIn={!!user} />
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <Progress value={progressValue} className="mb-4" />
          <CardTitle>
            Question {currentQuestionIndex + 1}/{questions.length}
          </CardTitle>
          <CardDescription>{currentQuestion.question_text}</CardDescription>
        </CardHeader>
        <CardContent className="min-h-[150px]">
          {submitError && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{submitError}</AlertDescription>
            </Alert>
          )}

          {currentQuestion.question_type === "radio" && currentQuestion.options && (
            <RadioGroup
              value={answers[currentQuestion.question_id] || ""}
              onValueChange={(value) => handleAnswerChange(currentQuestion.question_id, value)}
            >
              {currentQuestion.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={option} />
                  <Label htmlFor={option}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQuestion.question_type === "text" && (
            <div className="space-y-2">
              <Input
                value={answers[currentQuestion.question_id] || ""}
                onChange={(e) => handleAnswerChange(currentQuestion.question_id, e.target.value)}
                placeholder="Enter your answer..."
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground">
                {(answers[currentQuestion.question_id] || "").length}/500 characters
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleBack} disabled={currentQuestionIndex === 0}>
            Back
          </Button>
          <Button onClick={handleNext} disabled={!canProceed || isSubmitting}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : currentQuestionIndex === questions.length - 1 ? (
              "Complete Survey"
            ) : (
              "Next"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
