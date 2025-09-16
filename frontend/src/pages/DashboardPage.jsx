import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { Link } from "react-router-dom"
import { BookOpen, Trophy, Clock } from "lucide-react"
import { leaderboardService } from "../services/leaderboardService"

const DashboardPage = () => {
  const { user} = useAuth()
  const [userStats, setUserStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUserStats()
  }, [user])

  const loadUserStats = async () => {
    if (!user) return

    try {
      const response = await leaderboardService.getUserStats(user.id)
      if (response.success) {
        setUserStats(response.data)
      }
    } catch (error) {
      console.error("Failed to load user stats:", error)
    } finally {
      setLoading(false)
    }
  }

 

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Welcome back, {user?.getDisplayName()}!</h2>
            <p className="mt-1 text-gray-600">Ready to test your knowledge?</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Quizzes Taken</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {loading ? "..." : userStats?.totalQuizzesTaken || 0}
                  </p>
                </div>
              </div>
            </div>

           <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Recent Activity</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {loading ? "..." : userStats?.recentQuizzes?.length || 0}
                  </p>
                  <p className="text-xs text-gray-400">Last 5 quizzes</p>
                </div>
              </div>
            </div> 
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/quizzes"
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center">
                    <BookOpen className="h-5 w-5 text-blue-600 mr-3" />
                    <span className="font-medium text-gray-900">Browse Quizzes</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>
                <Link
                  to="/leaderboard"
                  className="flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Trophy className="h-5 w-5 text-purple-600 mr-3" />
                    <span className="font-medium text-gray-900">View Leaderboard</span>
                  </div>
                  <span className="text-gray-400">→</span>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Quiz Results</h3>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 h-6 w-6"></div>
                </div>
              ) : userStats?.recentQuizzes?.length > 0 ? (
                <div className="space-y-3">
                  {userStats.recentQuizzes.map((quiz) => (
                    <div key={`${quiz.quizId}-${quiz.completedAt}`} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{quiz.quizTitle}</p>
                        <p className="text-sm text-gray-500">{new Date(quiz.completedAt).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{quiz.percentage.toFixed(1)}%</p>
                        <p className="text-sm text-gray-500">
                          {quiz.score}/{quiz.maxScore}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Take your first quiz to see results</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
