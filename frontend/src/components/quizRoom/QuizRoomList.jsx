
// import { useState, useEffect } from "react"
// import quizRoomService from "../../services/quizRoomService"
// import QuizRoomCard from "./QuizRoomCard"

// export default function QuizRoomList() {
//   const [rooms, setRooms] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [filter, setFilter] = useState("active")

//   useEffect(() => {
//     loadRooms()
//   }, [filter])

//   const loadRooms = async () => {
//     try {
//       setLoading(true)
//       setError(null)

//       const response =
//         filter === "active" ? await quizRoomService.getActiveRooms() : await quizRoomService.getUpcomingRooms()

//       setRooms(response || [])
//     } catch (err) {
//       setError(err.message || "Greška pri učitavanju soba")
//      // console.error("Error loading rooms:", err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center py-12">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     )
//   }

//   if (error) {
//     return <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">{error}</div>
//   }

//   return (
//     <div>
//       <div className="flex gap-4 mb-6">
//         <button
//           onClick={() => setFilter("active")}
//           className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
//             filter === "active" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//           }`}
//         >
//           Aktivne sobe
//         </button>
//         <button
//           onClick={() => setFilter("upcoming")}
//           className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
//             filter === "upcoming" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//           }`}
//         >
//           Nadolazeće sobe
//         </button>
//       </div>

//       {rooms.length === 0 ? (
//         <div className="text-center py-12 text-gray-500">
//           <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
//             />
//           </svg>
//           <p className="text-lg">Nema dostupnih soba</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {rooms.map((room) => (
//             <QuizRoomCard key={room.id} room={room} />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }


import { useState, useEffect } from "react"
import quizRoomService from "../../services/quizRoomService"
import QuizRoomCard from "./QuizRoomCard"

export default function QuizRoomList() {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("active")

  useEffect(() => {
    loadRooms()
  }, [filter])

  const loadRooms = async () => {
    try {
      setLoading(true)
      setError(null)

      const response =
        filter === "active" ? await quizRoomService.getActiveRooms() : await quizRoomService.getUpcomingRooms()

      setRooms(response || [])
    } catch (err) {
      setError(err.message || "Error loading rooms")
      // console.error("Error loading rooms:", err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">{error}</div>
  }

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setFilter("active")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === "active" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Active Rooms
        </button>
        <button
          onClick={() => setFilter("upcoming")}
          className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
            filter === "upcoming" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Upcoming Rooms
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
          <p className="text-lg">No available rooms</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <QuizRoomCard key={room.id}  room={room} />
          ))}
        </div>
      )}
    </div>
  )
}