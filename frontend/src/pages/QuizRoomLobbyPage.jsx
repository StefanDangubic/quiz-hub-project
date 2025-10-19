import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import QuizRoomLobby from "../components/quizRoom/QuizRoomLobby"
import quizRoomService from "../services/quizRoomService"
import signalrService from "../services/signalrService"

export default function QuizRoomLobbyPage() {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  const { user, token } = useSelector((state) => state.auth)

  const [room, setRoom] = useState(null)
  const [participants, setParticipants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isConnected, setIsConnected] = useState(false)
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    initializeRoom()

    return () => {
      if (isConnected) {
        signalrService.leaveRoom(room?.id)
        signalrService.disconnect()
      }
    }
  }, [roomCode])

  const initializeRoom = async () => {

    if (joining) return; 
    setJoining(true);

    try {
      setLoading(true)
      setError(null)

 
      const roomResponse = await quizRoomService.getRoomByCode(roomCode)
      setRoom(roomResponse)
      setParticipants(roomResponse.participants || [])

      setupSignalRListeners()

      if (!signalrService.isConnected) {
        await signalrService.connect(token);
      }

     const result = await quizRoomService.joinRoom(roomCode)

      // Join SignalR room
      await signalrService.joinRoom(roomCode)
      setIsConnected(true)

    
    } catch (err) {
      console.error("Error initializing room:", err)
      setError(err.message || "Error loading room")
    } finally {
      setLoading(false)
      setJoining(false);
    }
  }

  const setupSignalRListeners = () => {

    signalrService.on("RoomState", (state) => {
    console.log("Room state received:", state)
    const updatedParticipants = []
    const seenIds = new Set()

    for (const p of state.participants || []) {
      
      if (seenIds.has(p.userId)) {
        const index = updatedParticipants.findIndex(u => u.userId === p.userId)
        if (index !== -1) {
          updatedParticipants[index] = p
        }
      } else {
        seenIds.add(p.userId)
        updatedParticipants.push(p)
      }
    }

    setParticipants(updatedParticipants)
  })

   
    signalrService.on("ParticipantJoined", (participant) => {
     console.log("Participant joined:", participant)
      setParticipants((prev) => {
      const index = prev.findIndex(p => p.userId === participant.userId)
    
      if (index !== -1) {
       const updated = [...prev]
       updated[index] = participant
       return updated
      } else {
   
       return [...prev, participant]
      }
     })
   })


    signalrService.on("ParticipantLeft", (data) => {
      console.log("Participant left:", data)
      setParticipants((prev) => prev.filter((p) => p.userId !== data.userId))
    })

    signalrService.on("ParticipantDisconnected", (data) => {
      console.log("Participant disconnected:", data)
      setParticipants((prev) =>
        prev.map((p) =>
          p.userId === data.userId ? { ...p, isConnected: false } : p
        )
      )
    })

    signalrService.on("Error", (message) => {
      console.error("SignalR error:", message)
      alert("Error: " + message)
    })
  }

  const handleLeave = async () => {
    try {
      if (room) {
        await signalrService.leaveRoom(room.id)
        await quizRoomService.leaveRoom(room.id)
      }
      await signalrService.disconnect()
      navigate("/quiz-rooms")
    } catch (error) {
      console.error("Error leaving room:", error)
      navigate("/quiz-rooms")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">

        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-red-800">
            <h2 className="text-xl font-bold mb-2">Error</h2>
            <p>{error}</p>
            <button
              onClick={() => navigate("/quiz-rooms")}
              className="mt-4 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
            >
              Back to rooms
            </button>
          </div>
        </div>
      </div>
    )
  }

  const isHost = user?.id === room?.creatorId

  return (
    <div className="min-h-screen bg-gray-50">
     
      <div className="container mx-auto px-4 py-8">
        <QuizRoomLobby
          room={room}
          participants={participants}
          isHost={isHost}
          onLeave={handleLeave}
        />
      </div>
    </div>
  )
}