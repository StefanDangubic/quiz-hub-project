import { useState, useEffect } from "react"
import { quizService } from "../../services/quizService"
import quizRoomService from "../../services/quizRoomService"

export default function CreateQuizRoom({ onRoomCreated, onCancel }) {
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    quizId: "",
    maxParticipants: 50,
    scheduledStartTime: "",
  })

  useEffect(() => {
    loadQuizzes()
  }, [])

  const loadQuizzes = async () => {
    try {
      const params = {
        page: 1,
        pageSize: 10,
      }

      const response = await quizService.getQuizzes(params)
      setQuizzes(response.data.items || [])
    } catch (error) {
      console.error("Error loading quizzes:", error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      setLoading(true)

      const createDto = {
        name: formData.name,
        quizId: Number.parseInt(formData.quizId),
      //  maxParticipants: Number.parseInt(formData.maxParticipants),
        scheduledStartTime: new Date(formData.scheduledStartTime).toISOString(),
      }

      await quizRoomService.createRoom(createDto)

      alert("Room successfully created!")
      onRoomCreated()
    } catch (error) {
      console.error("Error creating room:", error)
      alert("Error creating room: " + (error.message || "Unknown error"))
    } finally {
      setLoading(false)
    }
  }

  const getMinDateTime = () => {
    const now = new Date()
    now.setMinutes(now.getMinutes() + 5)
    return now.toISOString().slice(0, 16)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create a New Competition Room</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Room Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g. Evening Challenge"
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Quiz</label>
          <select
            name="quizId"
            value={formData.quizId}
            onChange={handleChange}
            required
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          >
            <option value="">-- Select Quiz --</option>
            {quizzes.map((quiz) => (
              <option key={quiz.id} value={quiz.id}>
                {quiz.title} ({quiz.questionCount} questions)
              </option>
            ))}
          </select>
        </div>

        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Participants</label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              required
              min="2"
              max="500"
              className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />
          </div>

        </div> */}

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Scheduled Start Time</label>
          <input
            type="datetime-local"
            name="scheduledStartTime"
            value={formData.scheduledStartTime}
            onChange={handleChange}
            required
            min={getMinDateTime()}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
          <p className="text-sm text-gray-500 mt-1">Must be in the future</p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Room"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}