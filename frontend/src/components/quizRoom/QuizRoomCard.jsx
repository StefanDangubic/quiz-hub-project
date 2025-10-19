import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

export default function QuizRoomCard({ room }) {
  const navigate = useNavigate()
 //  const { user } = useSelector((state) => state.auth)
 //const [isRoomCreator, setIsRoomCreator] = useState(false)
  // Local logic
 // const isFull = (room?.currentParticipants ?? 0) >= (room?.maxParticipants ?? 0)
//  const canJoin = !isFull && (room?.status === 0)



//   if (room?.createdBy && user?.id === room.createdBy) {
//   setIsRoomCreator(true)
//   }     
//  const canJoin = (isRoomCreator || !isFull) && room?.status === 0
  const canJoin =  room?.status === 0

  const getStatusColor = () => {
    switch (room.status) {
      case 0:
        return "bg-blue-100 text-blue-800"
      case 1:
        return "bg-green-100 text-green-800"
      case 2:
        return "bg-gray-100 text-gray-800"
      case 3:
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = () => {
  switch (room.status) {
    case 0:
      return "Waiting"
    case 1:
      return "Starting"
    case 2:
      return "In Progress"
    case 3:
      return "Completed"
    case 4:
      return "Cancelled"
    default:
      return "Unknown"
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

  const handleJoin = () => {
    navigate(`/quiz-rooms/${room.roomCode}/lobby`)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
          <p className="text-sm text-gray-600">{room.quizTitle}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor()}`}>{getStatusLabel()}</span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Start: {formatDate(room.scheduledStartTime)}</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <span>
            {/* {room.currentParticipants} / {room.maxParticipants} participants */}
            {room.currentParticipants}
          </span>
        </div>


        <div className="flex items-center text-sm text-gray-600">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span>Host: {room.creatorUsername}</span>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleJoin}
          disabled={!canJoin}
          className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-colors ${
            canJoin ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {/* {isFull ? "Full" : room?.status === 0 ? "Join" : "Unavailable"} */}
           { room?.status === 0 ? "Join" : "Unavailable"}
        </button>
      </div>
    </div>
  )
}