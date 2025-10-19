import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import signalrService from "../../services/signalrService"
import quizRoomService from "../../services/quizRoomService"

export default function QuizRoomLobby({ room, participants, isHost, onLeave }) {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(null)
   const [isDeleting, setIsDeleting] = useState(false)
   const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    
    const handleQuizStarting = (data) => {
    setCountdown(data.countdown);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

    const handleQuestionStarted = (question) => {
      navigate(`/quiz-rooms/${room.roomCode}/live`, { state: { question } })  
    }

    signalrService.on("QuizStarting", handleQuizStarting)
    signalrService.on("QuestionStarted", handleQuestionStarted)

    return () => {
      signalrService.off("QuizStarting", handleQuizStarting)
      signalrService.off("QuestionStarted", handleQuestionStarted)
    }
  }, [room.roomCode, navigate])

  const handleStartQuiz = async () => {
    try {
      await signalrService.startQuiz(room.id)
    } catch (error) {
      console.error("Error starting quiz:", error)
      alert("Error starting quiz")
    }
  }


   const handleDeleteRoom = async () => {
    setIsDeleting(true)
    try {
      await quizRoomService.deleteRoom(room.id)
      alert("Room deleted successfully")
      navigate("/quiz-rooms")
    } catch (error) {
      console.error("Error deleting room:", error)
      alert("Greška pri brisanju sobe")
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }
  
  const formatDate = (date) => {
    if (!date) return "N/A"
    return new Date(date).toLocaleString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="max-w-6xl mx-auto">

    {showDeleteConfirm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-md mx-4">
      <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Confirmation</h3>
      <p className="text-gray-600 mb-6">
        Are you sure you want to delete this room? This action cannot be undone.
      </p>
      <div className="flex gap-4">
        <button
          onClick={handleDeleteRoom}
          disabled={isDeleting}
          className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDeleting ? "Deleting..." : "Delete"}
        </button>
        <button
          onClick={() => setShowDeleteConfirm(false)}
          disabled={isDeleting}
          className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
       </div>
     </div>
    </div>
   )}



      {countdown !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="text-8xl font-bold text-white mb-4 animate-pulse">{countdown}</div>
            <p className="text-2xl text-white">Quiz starting...</p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{room.name}</h1>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-blue-600 mb-1">{room.roomCode}</div>
            <p className="text-sm text-gray-500">Room code</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center text-blue-600 mb-2">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span className="font-semibold">Participants</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {participants.length} / {room.maxParticipants}
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center text-green-600 mb-2">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-semibold">Questions</span>
            </div>
            <div className="text-2xl font-bold text-gray-900">{room.totalQuestions}</div>
          </div>

        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center text-gray-700 mb-2">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="font-semibold">Scheduled start time:</span>
          </div>
          <div className="text-lg text-gray-900">{formatDate(room.scheduledStartTime)}</div>
        </div>

        <div className="flex gap-4">
          {isHost && (
            <>
              <button
                onClick={handleStartQuiz}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Start quiz
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
              >
                Delete room
              </button>
            </>
          )}
          <button
            onClick={onLeave}
            className="bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition-colors"
          >
            Leave room
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Participants in the room</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {participants.map((participant) => (
            <div
              key={participant.userId}
              className={`flex items-center p-4 rounded-lg border-2 ${
                participant.isConnected ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50"
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-lg mr-4">
                {participant.username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{participant.username}</div>
                <div className="flex items-center text-sm">
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${participant.isConnected ? "bg-green-500" : "bg-gray-400"}`}
                  ></div>
                  <span className={participant.isConnected ? "text-green-600" : "text-gray-500"}>
                    {participant.isConnected ? "Online" : "Offline"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}