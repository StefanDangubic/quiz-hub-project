
export default function LiveLeaderboard({ leaderboard, title = "Live Leaderboard" }) {
  const getMedalColor = (rank) => {
    switch (rank) {
      case 1:
        return "text-yellow-500"
      case 2:
        return "text-gray-400"
      case 3:
        return "text-orange-600"
      default:
        return "text-gray-600"
    }
  }

  const getMedalIcon = (rank) => {
    if (rank <= 3) {
      return (
        <svg className={`w-6 h-6 ${getMedalColor(rank)}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )
    }
    return <span className="text-gray-600 font-bold">{rank}</span>
  }

 
  const formatTime = (timeMs) => {
  const totalSeconds = Math.floor(timeMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`
}

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <svg className="w-7 h-7 mr-2 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
        {title}
      </h2>

      <div className="space-y-3">
        {leaderboard.map((entry) => (
          <div
            key={entry.userId}
            className={`flex items-center p-4 rounded-lg border-2 transition-all ${
              entry.rank <= 3 ? "border-yellow-300 bg-yellow-50" : "border-gray-200 bg-gray-50"
            }`}
          >
            <div className="w-10 flex items-center justify-center mr-4">{getMedalIcon(entry.rank)}</div>

            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg mr-4">
              {entry.username.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="font-semibold text-gray-900">{entry.username}</div>
              <div className="text-sm text-gray-600">
                {entry.correctAnswers} / {entry.totalAnswers} correct
                {entry.totalTimeMs > 0 && (
                  <span className="ml-2">
                    • <span className="font-medium">{formatTime(entry.totalTimeMs)}</span>
                  </span>
                )}
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{entry.score}</div>
              <div className="text-xs text-gray-500">points</div>
            </div>
          </div>
        ))}
      </div>

      {leaderboard.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No results yet</p>
        </div>
      )}
    </div>
  )
}
