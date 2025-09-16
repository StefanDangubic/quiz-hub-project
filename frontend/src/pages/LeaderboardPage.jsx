import GlobalLeaderboard from "../components/leaderboard/GlobalLeaderboard"

const LeaderboardPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Global Leaderboard</h1>
            <p className="mt-2 text-2xl text-gray-600">Top scores for individual quizzes</p>
          </div>
          
            <GlobalLeaderboard /> 
          
        </div>
      </main>
    </div>
  )
}

export default LeaderboardPage
