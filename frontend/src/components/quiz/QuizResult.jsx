"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Trophy, Clock, CheckCircle, XCircle, RotateCcw, Home } from "lucide-react"
import { quizService } from "../../services/quizService"

const QuizResult = () => {
  const { attemptId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const [result, setResult] = useState(location.state?.result || null)
  const [loading, setLoading] = useState(!result)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!result && attemptId) {
      loadResult()
    }
  }, [attemptId, result])

  const loadResult = async () => {
    try {
      setLoading(true)
      const response = await quizService.getQuizResult(attemptId)

      if (response.success) {
        setResult(response.data)
      } else {
        setError(response.message)
      }
    } catch (error) {
      setError("Failed to load quiz result")
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return "text-green-600"
    if (percentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBgColor = (percentage) => {
    if (percentage >= 80) return "bg-green-100"
    if (percentage >= 60) return "bg-yellow-100"
    return "bg-red-100"
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
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-900 mb-2">Error</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!result) return null

  const correctAnswers = result.questions.filter((q) => q.isCorrect).length
  const totalQuestions = result.questions.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="text-center">
            <div
              className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${getScoreBgColor(result.percentage)} mb-4`}
            >
              <Trophy className={`h-8 w-8 ${getScoreColor(result.percentage)}`} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz Completed!</h1>
            <p className="text-gray-600">{result.quizTitle}</p>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <div className={`text-3xl font-bold ${getScoreColor(result.percentage)} mb-2`}>
              {result.percentage.toFixed(1)}%
            </div>
            <div className="text-sm text-gray-500">Final Score</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {result.score}/{result.maxScore}
            </div>
            <div className="text-sm text-gray-500">Points Earned</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">
              {correctAnswers}/{totalQuestions}
            </div>
            <div className="text-sm text-gray-500">Correct Answers</div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 text-center">
            <div className="flex items-center justify-center text-3xl font-bold text-gray-900 mb-2">
              <Clock className="h-6 w-6 mr-2" />
              {formatTime(result.timeSpent)}
            </div>
            <div className="text-sm text-gray-500">Time Taken</div>
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Question Review</h2>

          <div className="space-y-6">
            {result.questions.map((question, index) => (
              <div key={question.questionId} className="border-b border-gray-200 pb-6 last:border-b-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <span className="text-sm font-medium text-gray-500 mr-2">Question {index + 1}</span>
                      {question.isCorrect ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                    <p className="text-gray-900 font-medium mb-2">{question.questionText}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {question.points} {question.points === 1 ? "point" : "points"}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Your Answer:</span>
                    <p className={`mt-1 ${question.isCorrect ? "text-green-700" : "text-red-700"}`}>
                      {question.userAnswer}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Correct Answer:</span>
                    <p className="mt-1 text-green-700">{question.correctAnswer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/quizzes")}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 shadow-sm text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <RotateCcw className="h-5 w-5 mr-2" />
            Take Another Quiz
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Home className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuizResult
