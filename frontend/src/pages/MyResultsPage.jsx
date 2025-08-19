"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { Link } from "react-router-dom"
import { LogOut, Trophy, Clock, Target, TrendingUp, Eye } from "lucide-react"
import { quizService } from "../services/quizService"

const MyResultsPage = () => {
  const { user, logout } = useAuth()
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setLoading(true)
      const response = await quizService.getUserHistory()
      if (response.success) {
        setHistory(response.data)
      } else {
        setError(response.message)
      }
    } catch (error) {
      console.error("Failed to load history:", error)
      setError("Failed to load quiz history")
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return "text-green-600 bg-green-100"
    if (percentage >= 70) return "text-blue-600 bg-blue-100"
    if (percentage >= 50) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
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
            <h2 className="text-lg font-semibold text-red-900 mb-2">Error</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Results</h1>
            <p className="mt-2 text-gray-600">History of all quizzes you have taken</p>
          </div>

          {/* Results List */}
          {history.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Quiz History</h2>
              </div>

              <div className="divide-y divide-gray-200">
                {history.map((attempt) => (
                  <div key={attempt.attemptId} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-medium text-gray-900">{attempt.quizTitle}</h3>
                          {attempt.isPersonalBest && (
                            <Trophy className="h-5 w-5 text-yellow-500" title="Personal Best" />
                          )}
                        </div>

                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Target className="h-4 w-4 mr-1" />
                            <span>Category: {attempt.categoryName}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            <span>Time: {formatTime(attempt.timeSpent)}</span>
                          </div>
                          <div>
                            <span>Date: {formatDate(attempt.completedAt)}</span>
                          </div>
                          <div>
                            <span>Attempt #{attempt.attemptNumber}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                              attempt.percentage,
                            )}`}
                          >
                            {attempt.percentage.toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            {attempt.score}/{attempt.maxScore} points
                          </div>
                        </div>

                        <Link
                          to={`/quiz-result/${attempt.attemptId}`}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results yet</h3>
              <p className="text-gray-500 mb-6">Take your first quiz to see results here!</p>
              <Link
                to="/quizzes"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Browse Quizzes
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default MyResultsPage
