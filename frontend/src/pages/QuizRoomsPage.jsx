
import { useState } from "react"
import { useSelector } from "react-redux"
import QuizRoomList from "../components/quizRoom/QuizRoomList"
import CreateQuizRoom from "../components/admin/CreateQuizRoom"

export default function QuizRoomsPage() {
  const { user } = useSelector((state) => state.auth)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const isAdmin = user?.role === "Admin"

  const handleRoomCreated = () => {
    setShowCreateForm(false)
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Live Competitions</h1>
            
          </div>

          {isAdmin && !showCreateForm && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Room
            </button>
          )}
        </div>

        {showCreateForm ? (
          <CreateQuizRoom onRoomCreated={handleRoomCreated} onCancel={() => setShowCreateForm(false)} />
        ) : (
           <QuizRoomList/>
          
        )}
      </div>
    </div>
  )
}