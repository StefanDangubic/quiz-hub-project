import { useState, useEffect } from "react"
import signalrService from "../../services/signalrService"

export default function LiveQuiz({ room, currentQuestion, onAnswerSubmit }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null) 
  const [selectedAnswers, setSelectedAnswers] = useState([]) 
  const [textAnswer, setTextAnswer] = useState("") 
  const [timeLeft, setTimeLeft] = useState(currentQuestion?.timeLimit || 30)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [answerResult, setAnswerResult] = useState(null)
  const [startTime, setStartTime] = useState(Date.now())

  useEffect(() => {
    // Reset state when question changes
    setSelectedAnswer(null)
    setSelectedAnswers([])
    setTextAnswer("")
    setTimeLeft(currentQuestion?.timeLimit || 30)
    setHasAnswered(false)
    setAnswerResult(null)
    setStartTime(Date.now())
  }, [currentQuestion?.questionId])

  useEffect(() => {
    if (timeLeft > 0 && !hasAnswered) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !hasAnswered) {
      handleSubmit()
    }
  }, [timeLeft, hasAnswered])

  useEffect(() => {
    const handleAnswerResult = (result) => {
      setAnswerResult(result)
      setHasAnswered(true)
    }

    signalrService.on("AnswerResult", handleAnswerResult)

    return () => {
      signalrService.off("AnswerResult", handleAnswerResult)
    }
  }, [])

  const handleMultipleChoiceToggle = (answerId) => {
    setSelectedAnswers((prev) => {
      if (prev.includes(answerId)) {
        return prev.filter((id) => id !== answerId)
      } else {
        return [...prev, answerId]
      }
    })
  }

  const handleSubmit = async () => {
    if (hasAnswered) return

    try {
      const timeToAnswer = Date.now() - startTime

      let submitAnswerId = null
      let submitAnswerIds = null
      let submitTextAnswer = null

      switch (currentQuestion.questionType) {
        case 1: // SingleChoice
        case 3: // TrueFalse
          submitAnswerId = selectedAnswer
          break
        case 2: // MultipleChoice
          submitAnswerIds = selectedAnswers
          break
        case 4: // FillInTheBlank
          submitTextAnswer = textAnswer
          break
      }

      await signalrService.submitAnswer(
        room.id,
        currentQuestion.questionId,
        submitAnswerId,
        submitAnswerIds,
        submitTextAnswer,
      )

      setHasAnswered(true)
    } catch (error) {
      console.error("Error submitting answer:", error)
    }
  }

  if (!currentQuestion) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const getQuestionTypeLabel = () => {
    switch (currentQuestion.questionType) {
      case 1:
        return "Single correct answer"
      case 2:
        return "Multiple correct answers"
      case 3:
        return "True / False"
      case 4:
        return "Enter your answer"
      default:
        return ""
    }
  }

  const progressPercentage = (timeLeft / currentQuestion.timeLimit) * 100

  const isAnswerReady = () => {
    switch (currentQuestion.questionType) {
      case 1: // SingleChoice
      case 3: // TrueFalse
        return selectedAnswer !== null
      case 2: // MultipleChoice
        return selectedAnswers.length > 0
      case 4: // FillInTheBlank
        return textAnswer.trim() !== ""
      default:
        return false
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div className="text-sm font-semibold text-gray-600">
            Question {currentQuestion.questionNumber} of {currentQuestion.totalQuestions}
          </div>
          <div className="text-sm font-semibold text-gray-600">{getQuestionTypeLabel()}</div>
        </div>

        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold text-gray-700">Time remaining</span>
            <span className={`text-2xl font-bold ${timeLeft <= 5 ? "text-red-600" : "text-blue-600"}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ${timeLeft <= 5 ? "bg-red-600" : "bg-blue-600"}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-6">{currentQuestion.questionText}</h2>

        {currentQuestion.questionType === 4 ? (
          // FillInTheBlank - Text input
          <div className="mb-6">
            <input
              type="text"
              value={textAnswer}
              onChange={(e) => setTextAnswer(e.target.value)}
              disabled={hasAnswered}
              placeholder="Enter your answer..."
              className="w-full p-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed text-lg"
            />
          </div>
        ) : currentQuestion.questionType === 2 ? (
          // MultipleChoice - Checkboxes
          <div className="space-y-3 mb-6">
            <p className="text-sm text-gray-600 mb-3">Select all correct answers:</p>
            {currentQuestion.answers.map((answer) => (
              <label
                key={answer.answerId}
                className={`flex items-center p-4 rounded-lg border-2 transition-all cursor-pointer ${
                  selectedAnswers.includes(answer.answerId)
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400"
                } ${hasAnswered ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                <input
                  type="checkbox"
                  checked={selectedAnswers.includes(answer.answerId)}
                  onChange={() => !hasAnswered && handleMultipleChoiceToggle(answer.answerId)}
                  disabled={hasAnswered}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mr-4"
                />
                <span className="text-lg">{answer.answerText}</span>
              </label>
            ))}
          </div>
        ) : (
          // SingleChoice or TrueFalse - Radio buttons
          <div className="space-y-3 mb-6">
            {currentQuestion.answers.map((answer) => (
              <button
                key={answer.answerId}
                onClick={() => !hasAnswered && setSelectedAnswer(answer.answerId)}
                disabled={hasAnswered}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                  selectedAnswer === answer.answerId
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-300 hover:border-blue-400"
                } ${hasAnswered ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                      selectedAnswer === answer.answerId ? "border-blue-600 bg-blue-600" : "border-gray-400"
                    }`}
                  >
                    {selectedAnswer === answer.answerId && (
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="text-lg">{answer.answerText}</span>
                </div>
              </button>
            ))}
          </div>
        )}

        {!hasAnswered && (
          <button
            onClick={handleSubmit}
            disabled={!isAnswerReady()}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        )}

        {answerResult && (
          <div
            className={`mt-6 p-6 rounded-lg ${
              answerResult.isCorrect ? "bg-green-50 border-2 border-green-500" : "bg-red-50 border-2 border-red-500"
            }`}
          >
            <div className="flex items-center mb-4">
              {answerResult.isCorrect ? (
                <svg className="w-8 h-8 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <div>
                <div className={`text-xl font-bold ${answerResult.isCorrect ? "text-green-800" : "text-red-800"}`}>
                  {answerResult.isCorrect ? "Correct!" : "Incorrect"}
                </div>
                <div className={`text-lg ${answerResult.isCorrect ? "text-green-700" : "text-red-700"}`}>
                  +{answerResult.pointsEarned} points
                </div>
              </div>
            </div>
            {answerResult.speedBonus > 0 && (
              <div className="text-sm text-green-700 font-semibold">
                Speed bonus: +{answerResult.speedBonus} points
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
