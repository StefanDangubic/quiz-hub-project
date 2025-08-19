"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Clock, ChevronLeft, ChevronRight, Flag, AlertCircle } from "lucide-react"
import { quizService } from "../../services/quizService"

const QuizPlayer = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [quiz, setQuiz] = useState(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(Date.now())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Load quiz data
  useEffect(() => {
    loadQuiz()
  }, [id])

  // // Timer effect
  // useEffect(() => {
  //   if (quiz && quiz.timeLimit && timeLeft > 0) {
  //     const timer = setInterval(() => {
  //       setTimeLeft((prev) => {
  //         if (prev <= 1) {
  //           handleSubmit()
  //           return 0
  //         }
  //         return prev - 1
  //       })
  //     }, 1000)

  //     return () => clearInterval(timer)
  //   }
  // }, [quiz,timeLeft])

  // Timer effect - pravi se samo jedan interval
   useEffect(() => {
     if (quiz && quiz.timeLimit && timeLeft > 0) {
         const timer = setInterval(() => {
         setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0))
      }, 1000)

       return () => clearInterval(timer) // očisti interval kad se komponenta unmountuje
  }
}, [quiz]) // <<< samo quiz u dependencies

// Kad vreme istekne, pozovi handleSubmit JEDNOM
    useEffect(() => {
      if (timeLeft === 0) {
      handleSubmit()
    }
    }, [timeLeft])


  const loadQuiz = async () => {
    try {
      setLoading(true)
      const response = await quizService.getQuizWithQuestions(id)

      if (response.success) {
        setQuiz(response.data)
        if (response.data.timeLimit) {
          setTimeLeft(response.data.timeLimit * 60) // Convert minutes to seconds
        }
      } else {
        setError(response.message)
      }
    } catch (error) {
      setError("Failed to load quiz")
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId, answerId, value) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev }

      if (!newAnswers[questionId]) {
        newAnswers[questionId] = {}
      }

      const question = quiz.questions.find((q) => q.id === questionId)

      switch (question.questionType) {
        case 1: // SingleChoice
        case 3: // TrueFalse
          newAnswers[questionId] = { answerId }
          break
        case 2: // MultipleChoice
          if (!newAnswers[questionId].answerIds) {
            newAnswers[questionId].answerIds = []
          }
          if (value) {
            if (!newAnswers[questionId].answerIds.includes(answerId)) {
                 newAnswers[questionId].answerIds.push(answerId)
              }
          } else {
            newAnswers[questionId].answerIds = newAnswers[questionId].answerIds.filter((id) => id !== answerId)
          }
          break
        case 4: // FillInTheBlank
          newAnswers[questionId] = { userInput: value }
          break
      }

      return newAnswers
    })
  }

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)

    // Format answers for submission
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId: Number.parseInt(questionId),
      ...answer,
    }))

    try {
      const response = await quizService.submitQuiz(id, formattedAnswers, timeSpent)

      if (response.success) {
        // navigate(`/quiz-result/${response.data.attemptId}`)
        navigate(`/quiz-result/${response.data.attemptId}`, {
          state: { result: response.data },
        })
      } else {
        setError(response.message)
        setIsSubmitting(false)
      }
    } catch (error) {
      setError("Failed to submit quiz")
      setIsSubmitting(false)
    }
  }, [answers, id, navigate, startTime, isSubmitting])

   

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getQuestionTypeText = (type) => {
    switch (type) {
      case 1:
        return "Single Choice"
      case 2:
        return "Multiple Choice"
      case 3:
        return "True/False"
      case 4:
        return "Fill in the Blank"
      default:
        return "Unknown"
    }
  }

  const isAnswered = (questionId) => {
    const answer = answers[questionId]
    if (!answer) return false

    const question = quiz.questions.find((q) => q.id === questionId)
    switch (question.questionType) {
      case 1:
      case 3:
        return !!answer.answerId
      case 2:
        return answer.answerIds && answer.answerIds.length > 0
      case 4:
        return !!answer.userInput?.trim()
      default:
        return false
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 h-8 w-8"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl border border-red-200 shadow-sm p-8 max-w-md w-full mx-4">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-lg font-semibold text-red-900">Error</h2>
          </div>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={() => navigate("/quizzes")}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Quizzes
          </button>
        </div>
      </div>
    )
  }

  if (!quiz) return null

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100
  const answeredCount = quiz.questions.filter((q) => isAnswered(q.id)).length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">{quiz.title}</h1>
              <p className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {quiz.questions.length}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {quiz.timeLimit && (
                <div className="flex items-center text-sm">
                  <Clock className="h-4 w-4 mr-1 text-gray-500" />
                  <span className={timeLeft < 300 ? "text-red-600 font-medium" : "text-gray-700"}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
              >
                <Flag className="h-4 w-4 mr-2" />
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress</span>
              <span>
                {answeredCount}/{quiz.questions.length} answered
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          {/* Question Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {getQuestionTypeText(currentQuestion.questionType)}
              </span>
              <span className="text-sm text-gray-500">
                {currentQuestion.points} {currentQuestion.points === 1 ? "point" : "points"}
              </span>
            </div>

            <h2 className="text-xl font-medium text-gray-900 mb-4">{currentQuestion.questionText}</h2>

            {currentQuestion.imageUrl && (
              <img
                src={currentQuestion.imageUrl || "/placeholder.svg"}
                alt="Question"
                className="max-w-full h-auto rounded-lg mb-6"
              />
            )}
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.questionType === 4 ? (
              // Fill in the Blank
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Answer:</label>
                <input
                  type="text"
                  value={answers[currentQuestion.id]?.userInput || ""}
                  onChange={(e) => handleAnswerChange(currentQuestion.id, null, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Type your answer here..."
                />
              </div>
            ) : (
              // Multiple Choice Options
              currentQuestion.answers.map((answer) => (
                <label
                  key={answer.id}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type={currentQuestion.questionType === 2 ? "checkbox" : "radio"}
                    name={`question-${currentQuestion.id}`}
                    value={answer.id}
                    checked={
                      currentQuestion.questionType === 2
                        ? answers[currentQuestion.id]?.answerIds?.includes(answer.id) || false
                        : answers[currentQuestion.id]?.answerId === answer.id
                    }
                    onChange={(e) => {
                      if (currentQuestion.questionType === 2) {
                        handleAnswerChange(currentQuestion.id, answer.id, e.target.checked)
                      } else {
                        handleAnswerChange(currentQuestion.id, answer.id)
                      }
                    }}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <span className="ml-3 text-gray-900">{answer.answerText}</span>
                </label>
              ))
            )}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </button>

          <div className="flex space-x-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? "bg-blue-600 text-white"
                    : isAnswered(quiz.questions[index].id)
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : "bg-gray-100 text-gray-600 border border-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.min(quiz.questions.length - 1, prev + 1))}
            disabled={currentQuestionIndex === quiz.questions.length - 1}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizPlayer
