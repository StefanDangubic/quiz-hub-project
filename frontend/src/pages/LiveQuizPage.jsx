import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import LiveQuiz from "../components/quizRoom/LiveQuiz"
import LiveLeaderboard from "../components/quizRoom/LiveLeaderboard"
import quizRoomService from "../services/quizRoomService"
import signalrService from "../services/signalrService"

export default function LiveQuizPage() {
  const { roomCode } = useParams()
  const navigate = useNavigate()
  const { token, user } = useSelector((state) => state.auth)

  const [room, setRoom] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [showingLeaderboard, setShowingLeaderboard] = useState(false)
  const [isRoomCreator, setIsRoomCreator] = useState(false)
  const location = useLocation()
  const initialQuestion = location.state?.question

  useEffect(() => {
    if (initialQuestion) {
      setCurrentQuestion(initialQuestion)
    }
  }, [initialQuestion])

  useEffect(() => {
    initializeLiveQuiz()

    return () => {
      signalrService.disconnect()
    }
  }, [roomCode])

  const initializeLiveQuiz = async () => {
    try {
      setLoading(true)

      const roomResponse = await quizRoomService.getRoomByCode(roomCode)
      setRoom(roomResponse)
  
      if (roomResponse?.creatorId && user?.id === roomResponse.creatorId) {
        setIsRoomCreator(true)
      }

      setupSignalRListeners()

      if (!signalrService.isConnected) {
        await signalrService.connect(token)
        await signalrService.joinRoom(roomCode)
      }
    } catch (err) {
      console.error("Error initializing live quiz:", err)
      alert("Error loading quiz")
      navigate("/quiz-rooms")
    } finally {
      setLoading(false)
    }
  }

  const setupSignalRListeners = () => {
    signalrService.on("QuestionStarted", (question) => {
      console.log("Question started:", question)
      setCurrentQuestion(question)
      setShowingLeaderboard(false)
    })

    signalrService.on("RoomState", (state) => {
      setIsRoomCreator(state.isRoomCreator || false)
    })

    signalrService.on("LeaderboardUpdate", (updatedLeaderboard) => {
      console.log("Leaderboard updated:", updatedLeaderboard)
      setLeaderboard(updatedLeaderboard || [])
    })

    signalrService.on("ShowQuestionLeaderboard", (updatedLeaderboard) => {
      console.log("Showing question leaderboard:", updatedLeaderboard)
      setLeaderboard(updatedLeaderboard || [])
      setShowingLeaderboard(true)
    })

    signalrService.on("QuizCompleted", (results) => {
      console.log("Quiz completed:", results)
      setQuizCompleted(true)
      setLeaderboard(results.finalLeaderboard || [])
    })

    signalrService.on("Error", (message) => {
      console.error("SignalR error:", message)
      alert("Error: " + message)
    })
  }

  const handleAnswerSubmit = () => {
    // Waiting for the next question
  }

  const handleFinish = async () => {
    await signalrService.disconnect()
    navigate("/quiz-rooms")
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

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8 mb-6 text-center">
              <svg className="w-20 h-20 mx-auto mb-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Quiz Completed!</h1>
              <p className="text-xl text-gray-600 mb-8">Check out the final results below</p>
              <button
                onClick={handleFinish}
                className="bg-blue-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Back to rooms
              </button>
            </div>

            <LiveLeaderboard leaderboard={leaderboard} title="Final Results" />
          </div>
        </div>
      </div>
    )
  }

  if (isRoomCreator) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-blue-50 border-2 border-blue-500 rounded-lg p-6 mb-6">
              <div className="flex items-center">
                <svg className="w-8 h-8 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div>
                  <h3 className="text-lg font-bold text-blue-900">Admin Mode</h3>
                  <p className="text-blue-700">
                    You are the room creator and cannot participate in the quiz. You can follow the live results.
                  </p>
                </div>
              </div>
            </div>

            {currentQuestion && (
              <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                <div className="text-sm font-semibold text-gray-600 mb-2">
                  Current question {currentQuestion.questionNumber} of {currentQuestion.totalQuestions}
                </div>
                <h2 className="text-2xl font-bold text-gray-900">{currentQuestion.questionText}</h2>
              </div>
            )}

            <LiveLeaderboard leaderboard={leaderboard} title="Current Results" />
          </div>
        </div>
      </div>
    )
  }

  if (showingLeaderboard) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg p-8 mb-6 text-center text-white">
              <h1 className="text-4xl font-bold mb-2">Question Results</h1>
              <p className="text-xl">Next question starting soon...</p>
            </div>

            <LiveLeaderboard leaderboard={leaderboard} title="Current Leaderboard" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {currentQuestion ? (
              <LiveQuiz room={room} currentQuestion={currentQuestion} onAnswerSubmit={handleAnswerSubmit} />
            ) : (
              <div className="text-center text-gray-500 text-lg mt-10">
                Waiting for the question to start...
              </div>
            )}
          </div>
          <div className="lg:col-span-1"></div>
        </div>
      </div>
    </div>
  )
}
