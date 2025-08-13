"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Brain, CheckCircle, XCircle, RotateCcw } from "lucide-react"
import { sdk } from "@farcaster/miniapp-sdk"

interface Question {
  id: number
  type: string
  question: string
  options: string[]
  correct: number
  explanation: string
  difficulty: "easy" | "medium" | "hard"
}

const questions: Question[] = [
  {
    id: 1,
    type: "Numerical Sequence",
    question: "What comes next in the sequence: 2, 6, 18, 54, ___?",
    options: ["108", "162", "216", "324"],
    correct: 1,
    explanation: "Each number is multiplied by 3: 2×3=6, 6×3=18, 18×3=54, 54×3=162",
    difficulty: "easy",
  },
  {
    id: 2,
    type: "Verbal Analogy",
    question: "Book is to Reading as Fork is to:",
    options: ["Eating", "Cooking", "Kitchen", "Spoon"],
    correct: 0,
    explanation: "A book is used for reading, just as a fork is used for eating.",
    difficulty: "easy",
  },
  {
    id: 3,
    type: "Pattern Recognition",
    question: "Which number doesn't belong: 4, 9, 16, 20, 25?",
    options: ["4", "9", "20", "25"],
    correct: 2,
    explanation: "4, 9, 16, and 25 are all perfect squares (2², 3², 4², 5²), but 20 is not.",
    difficulty: "easy",
  },
  {
    id: 4,
    type: "Logical Reasoning",
    question:
      "If 5 machines make 5 widgets in 5 minutes, how many minutes does it take 100 machines to make 100 widgets?",
    options: ["5", "20", "100", "500"],
    correct: 0,
    explanation: "Each machine makes 1 widget in 5 minutes, so 100 machines make 100 widgets in 5 minutes.",
    difficulty: "medium",
  },
  {
    id: 5,
    type: "Verbal Logic",
    question: "All roses are flowers. Some flowers fade quickly. Therefore:",
    options: ["All roses fade quickly", "Some roses may fade quickly", "No roses fade quickly", "Cannot be determined"],
    correct: 1,
    explanation:
      "Since roses are flowers and some flowers fade quickly, it's possible that some roses are among those that fade quickly.",
    difficulty: "medium",
  },
  {
    id: 6,
    type: "Mathematical Reasoning",
    question: "A car travels 60 miles in 1.5 hours. At this rate, how far will it travel in 4 hours?",
    options: ["120 miles", "160 miles", "180 miles", "240 miles"],
    correct: 1,
    explanation: "Speed = 60 ÷ 1.5 = 40 mph. Distance in 4 hours = 40 × 4 = 160 miles.",
    difficulty: "medium",
  },
  {
    id: 7,
    type: "Abstract Reasoning",
    question: "If MONDAY is coded as ONMYAD, how is FRIDAY coded?",
    options: ["IRFDYA", "RFIDYA", "IFRDAY", "RFIYAD"],
    correct: 0,
    explanation: "The pattern swaps pairs of letters: MO→OM, ND→DN, AY→YA. So FR→RF, ID→DI, AY→YA = IRFDYA.",
    difficulty: "medium",
  },
  {
    id: 8,
    type: "Numerical Pattern",
    question: "What is the next number in the sequence: 1, 4, 9, 16, 25, 36, ___?",
    options: ["42", "49", "56", "64"],
    correct: 1,
    explanation: "These are perfect squares: 1², 2², 3², 4², 5², 6², 7² = 49.",
    difficulty: "hard",
  },
  {
    id: 9,
    type: "Logical Deduction",
    question: "In a group of 100 people, 70 like coffee, 80 like tea. What is the minimum number who like both?",
    options: ["50", "60", "70", "80"],
    correct: 0,
    explanation: "Using set theory: |Coffee ∪ Tea| ≤ 100, so |Coffee ∩ Tea| ≥ 70 + 80 - 100 = 50.",
    difficulty: "hard",
  },
  {
    id: 10,
    type: "Complex Reasoning",
    question:
      "If it takes 8 hours to dig a hole 2 feet deep, how long will it take to dig a hole 6 feet deep, assuming the difficulty increases proportionally with depth?",
    options: ["24 hours", "36 hours", "48 hours", "72 hours"],
    correct: 3,
    explanation:
      "Difficulty increases proportionally: 2 feet = 8 hours, so rate decreases with depth. 6 feet = 8 × (1+2+3) = 8 × 9 = 72 hours.",
    difficulty: "hard",
  },
]

type QuizState = "start" | "quiz" | "results" | "review"

export default function IQQuizApp() {
  const [state, setState] = useState<QuizState>("start")
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes in seconds
  const [score, setScore] = useState(0)
  const [iqScore, setIqScore] = useState(0)
  const [isMiniApp, setIsMiniApp] = useState(false)

  // Timer effect
  useEffect(() => {
    if (state === "quiz" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleQuizComplete()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [state, timeLeft])

  // Initialize Farcaster Mini App SDK and hide splash when ready
  useEffect(() => {
    let active = true
    const initMiniApp = async () => {
      try {
        await sdk.actions.ready()
        if (active) setIsMiniApp(true)
      } catch {
        // Not in Farcaster or SDK not available; ignore
      }
    }
    initMiniApp()
    return () => {
      active = false
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const startQuiz = () => {
    setState("quiz")
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer(null)
    setTimeLeft(15 * 60)
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer !== null) {
      const newAnswers = [...answers]
      newAnswers[currentQuestion] = selectedAnswer
      setAnswers(newAnswers)

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        handleQuizComplete(newAnswers)
      }
    }
  }

  const handleQuizComplete = (finalAnswers = answers) => {
    const correctAnswers = finalAnswers.filter((answer, index) => answer === questions[index].correct).length
    setScore(correctAnswers)

    // Convert to IQ score (simplified conversion)
    const percentage = correctAnswers / questions.length
    const iq = Math.round(85 + percentage * 30) // Scale from 85-115 based on performance
    setIqScore(iq)

    setState("results")
  }

  const getScoreInterpretation = (iq: number) => {
    if (iq >= 130) return { level: "Very Superior", percentile: "98th", color: "bg-purple-500" }
    if (iq >= 120) return { level: "Superior", percentile: "91st", color: "bg-blue-500" }
    if (iq >= 110) return { level: "High Average", percentile: "75th", color: "bg-green-500" }
    if (iq >= 90) return { level: "Average", percentile: "50th", color: "bg-yellow-500" }
    if (iq >= 80) return { level: "Low Average", percentile: "25th", color: "bg-orange-500" }
    return { level: "Below Average", percentile: "10th", color: "bg-red-500" }
  }

  const resetQuiz = () => {
    setState("start")
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedAnswer(null)
    setTimeLeft(15 * 60)
    setScore(0)
    setIqScore(0)
  }

  if (state === "start") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center space-y-4 px-4 sm:px-6">
            <div className="flex justify-center">
              <Brain className="h-12 w-12 sm:h-16 sm:w-16 text-blue-600" />
            </div>
            <CardTitle className="text-2xl sm:text-4xl font-bold text-slate-800">IQ Quiz Contest</CardTitle>
            <CardDescription className="text-base sm:text-lg text-slate-600">
              Test your cognitive abilities with our comprehensive IQ assessment
            </CardDescription>
            {isMiniApp && (
              <div className="flex justify-center">
                <Badge variant="secondary">Farcaster Mini App</Badge>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-6 px-4 sm:px-6">
            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3">Instructions:</h3>
              <ul className="space-y-2 text-sm sm:text-base text-blue-800">
                <li>• Answer 10 questions covering various cognitive skills</li>
                <li>• You have 15 minutes to complete the quiz</li>
                <li>• Questions progress from easy to challenging</li>
                <li>• Choose the best answer for each question</li>
                <li>• Your IQ score will be calculated at the end</li>
              </ul>
            </div>
            <Button
              onClick={startQuiz}
              className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold bg-blue-600 hover:bg-blue-700"
            >
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (state === "quiz") {
    const question = questions[currentQuestion]
    const progress = ((currentQuestion + 1) / questions.length) * 100
    const isTimeWarning = timeLeft <= 120 // 2 minutes

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 space-y-3 sm:space-y-0">
              <div className="flex flex-wrap items-center gap-2 sm:space-x-4">
                <Badge variant="outline" className="text-xs sm:text-sm">
                  Question {currentQuestion + 1} of {questions.length}
                </Badge>
                <Badge variant="secondary" className="text-xs sm:text-sm">
                  {question.type}
                </Badge>
              </div>
              <div className={`flex items-center space-x-2 ${isTimeWarning ? "text-red-600" : "text-slate-600"}`}>
                <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="font-mono text-base sm:text-lg font-semibold">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question */}
          <Card className="mb-4 sm:mb-6">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl leading-relaxed">{question.question}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 px-4 sm:px-6">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full p-3 sm:p-4 text-left rounded-lg border-2 transition-all text-sm sm:text-base ${
                    selectedAnswer === index
                      ? "border-blue-500 bg-blue-50 text-blue-900"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 active:bg-slate-100"
                  }`}
                >
                  <span className="font-semibold mr-2 sm:mr-3">{String.fromCharCode(65 + index)}.</span>
                  {option}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Next Button */}
          <div className="flex justify-end px-2 sm:px-0">
            <Button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === null}
              className="px-6 sm:px-8 py-3 text-base sm:text-lg min-h-[44px]"
            >
              {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (state === "results") {
    const interpretation = getScoreInterpretation(iqScore)

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 sm:p-6">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center space-y-4 px-4 sm:px-6">
            <div className="flex justify-center">
              <div
                className={`h-16 w-16 sm:h-20 sm:w-20 rounded-full ${interpretation.color} flex items-center justify-center`}
              >
                <Brain className="h-8 w-8 sm:h-10 sm:w-10 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl sm:text-3xl font-bold">Your IQ Score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center px-4 sm:px-6">
            <div className="space-y-2">
              <div className="text-4xl sm:text-6xl font-bold text-slate-800">{iqScore}</div>
              <div className="text-lg sm:text-xl text-slate-600">
                {interpretation.level} ({interpretation.percentile} percentile)
              </div>
            </div>

            <div className="bg-slate-50 p-4 sm:p-6 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-semibold text-slate-700">Questions Correct</div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-800">
                    {score}/{questions.length}
                  </div>
                </div>
                <div>
                  <div className="font-semibold text-slate-700">Accuracy</div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-800">
                    {Math.round((score / questions.length) * 100)}%
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button onClick={() => setState("review")} variant="outline" className="w-full h-12 text-base">
                See Detailed Results
              </Button>
              <Button onClick={resetQuiz} className="w-full h-12 text-base">
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (state === "review") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-3 sm:p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-800">Detailed Review</h1>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Button onClick={() => setState("results")} variant="outline" className="h-10 text-sm">
                  Back to Results
                </Button>
                <Button onClick={resetQuiz} className="h-10 text-sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Retake Quiz
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            {questions.map((question, index) => {
              const userAnswer = answers[index]
              const isCorrect = userAnswer === question.correct

              return (
                <Card key={question.id} className="overflow-hidden">
                  <CardHeader className="pb-4 px-4 sm:px-6">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start space-y-3 sm:space-y-0">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            Question {index + 1}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {question.type}
                          </Badge>
                          <Badge
                            variant={
                              question.difficulty === "easy"
                                ? "default"
                                : question.difficulty === "medium"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="text-xs"
                          >
                            {question.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className="text-base sm:text-lg leading-relaxed">{question.question}</CardTitle>
                      </div>
                      <div className="flex items-center justify-end sm:justify-start space-x-2">
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 px-4 sm:px-6">
                    <div className="grid gap-2">
                      {question.options.map((option, optionIndex) => {
                        const isUserAnswer = userAnswer === optionIndex
                        const isCorrectAnswer = question.correct === optionIndex

                        return (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border-2 text-sm sm:text-base ${
                              isCorrectAnswer
                                ? "border-green-500 bg-green-50 text-green-900"
                                : isUserAnswer
                                  ? "border-red-500 bg-red-50 text-red-900"
                                  : "border-slate-200 bg-slate-50"
                            }`}
                          >
                            <span className="font-semibold mr-2 sm:mr-3">{String.fromCharCode(65 + optionIndex)}.</span>
                            {option}
                            {isCorrectAnswer && (
                              <span className="ml-2 text-green-600 font-semibold text-xs sm:text-sm">✓ Correct</span>
                            )}
                            {isUserAnswer && !isCorrectAnswer && (
                              <span className="ml-2 text-red-600 font-semibold text-xs sm:text-sm">✗ Your answer</span>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <div className="bg-blue-50 p-3 sm:p-4 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">Explanation:</h4>
                      <p className="text-blue-800 text-sm sm:text-base leading-relaxed">{question.explanation}</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="mt-6 sm:mt-8 bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold mb-4">Score Calculation</h3>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Your IQ score of <strong>{iqScore}</strong> is based on the number of correct answers ({score}/
              {questions.length}) converted to a standard IQ scale with a mean of 100 and standard deviation of 15. This
              assessment covers multiple cognitive domains including logical reasoning, pattern recognition,
              mathematical thinking, and verbal comprehension.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return null
}
