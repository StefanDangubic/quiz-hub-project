
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchGlobalLeaderboard,
  fetchUserPosition,
  fetchQuizzesForFilter,
  setFilters,
  resetLeaderboard,
} from "../../store/slices/leaderboardSlice"

const GlobalLeaderboard = () => {
  const dispatch = useDispatch()
  const {
    globalLeaderboard,
    userPosition,
    availableQuizzes,
    loading,
    error,
    filters,
    totalCount,
    currentPage,
    totalPages,
  } = useSelector((state) => state.leaderboard)

  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    // Load available quizzes for filter
    dispatch(fetchQuizzesForFilter())
  }, [dispatch])

  useEffect(() => {
    if (filters.quizId) {
      dispatch(
        fetchGlobalLeaderboard({
          ...filters,
     //     page: currentPage,
    //      pageSize: 50,
        }),
      )

      // Load user position if user is logged in
      if (user) {
        dispatch(
          fetchUserPosition({
            params: filters,
          }),
        )
      }
    }
  }, [dispatch, filters, currentPage, user])

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilters({ [filterType]: value }))
    dispatch(resetLeaderboard())
  }

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getRankIcon = (position) => {
    switch (position) {
      case 1:
        return "🥇"
      case 2:
        return "🥈"
      case 3:
        return "🥉"
      default:
        return `#${position}`
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-700 mb-6">Top Performers</h1>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Quiz *</label>
              <select
                value={filters.quizId || ""}
                onChange={(e) => handleFilterChange("quizId", e.target.value || null)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a quiz</option>
                {availableQuizzes.map((quiz) => (
                  <option key={quiz.id} value={quiz.id}>
                    {quiz.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-medium text-gray-700 mb-1">Time period</label>
              <select
                value={filters.timePeriod}
                onChange={(e) => handleFilterChange("timePeriod", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All results</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>

          {/* User Position Card */}
          {userPosition && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Your Position</h3>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-blue-600">{getRankIcon(userPosition)}</span>
                  <div>
                    <p className="font-medium text-gray-900">{user?.username}</p>
                    {/* <p className="text-sm text-gray-600">{userPosition.totalScore} points</p> */}
                  </div>
                </div>
                {/* <div className="text-right">
                  <p className="text-sm text-gray-600">
                    Position: {userPosition.position} of {totalCount}
                  </p>
                </div> */}
              </div>
            </div>
          )}
        </div>

        {!filters.quizId ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 text-lg">Please select a quiz to see the leaderboard.</p>
          </div>
        ) : (
          /* Leaderboard Table */
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Points
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {globalLeaderboard.map((entry, index) => (
                  <tr
                    key={entry.useId}
                    className={`hover:bg-gray-50 ${user && entry.userId === user.id ? "bg-blue-50" : ""}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-semibold">{getRankIcon(index + 1)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {entry.username?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-900">{entry.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-lg font-bold text-green-600">{entry.score}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{formatTime(entry.timeSpent)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-600">{formatDate(entry.completedAt)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {globalLeaderboard.length} of {totalCount} results
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() =>
                  dispatch(
                    fetchGlobalLeaderboard({
                      ...filters,
                      page: currentPage - 1,
                      pageSize: 50,
                    }),
                  )
                }
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 text-sm">
                {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  dispatch(
                    fetchGlobalLeaderboard({
                      ...filters,
                      page: currentPage + 1,
                      pageSize: 50,
                    }),
                  )
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border-l-4 border-red-400">
            <p className="text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default GlobalLeaderboard
