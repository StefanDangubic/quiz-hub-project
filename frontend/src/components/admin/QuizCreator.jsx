import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
import { quizService } from "../../services/quizService"
import { categoryService } from "../../services/categoryService"

const QuizCreator = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])

  const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    categoryId: "",
    difficulty: "Easy",
    timeLimit: 30,
   
  })

  const [questions, setQuestions] = useState([
    {
      text: "",
      type: "SingleChoice",
      points: 1,
      correctAnswer: "", // For FillInBlank type
      answers: [
        { text: "", isCorrect: true },
        { text: "", isCorrect: false },
      ],
    },
  ])

  const difficultyMap = { Easy: 1, Medium: 2, Hard: 3 };
  const questionTypeMap = { SingleChoice: 1, MultipleChoice: 2, TrueFalse: 3, FillInBlank: 4 };   

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories()
      if (response.success) {
        setCategories(response.data)
      }
    } catch (error) {
      console.error("Error loading categories:", error)
    }
  }

  const handleQuizDataChange = (field, value) => {
    setQuizData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleQuestionChange = (questionIndex, field, value) => {
    setQuestions((prev) =>
      prev.map((question, index) => {
        if (index === questionIndex) {
          const updatedQuestion = { ...question, [field]: value }

          // Handle question type changes
          if (field === "type") {
            if (value === "TrueFalse") {
              updatedQuestion.answers = [
                { text: "True", isCorrect: true },
                { text: "False", isCorrect: false },
              ]
            } else if (value === "FillInBlank") {
              updatedQuestion.answers = []
              updatedQuestion.correctAnswer = ""
            } else if (value === "SingleChoice" || value === "MultipleChoice") {
              if (question.type === "FillInBlank") {
                updatedQuestion.answers = [
                  { text: "", isCorrect: true },
                  { text: "", isCorrect: false },
                ]
                updatedQuestion.correctAnswer = ""
              }
            }
          }

          return updatedQuestion
        }
        return question
      }),
    )
  }

  const handleAnswerChange = (questionIndex, answerIndex, field, value) => {
    setQuestions((prev) =>
      prev.map((question, qIndex) =>
        qIndex === questionIndex
          ? {
              ...question,
              answers: question.answers.map((answer, aIndex) =>
                aIndex === answerIndex ? { ...answer, [field]: value } : answer,
              ),
            }
          : question,
      ),
    )
  }

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        text: "",
        type: "SingleChoice",
        points: 1,
        correctAnswer: "",
        answers: [
          { text: "", isCorrect: true },
          { text: "", isCorrect: false },
        ],
      },
    ])
  }

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions((prev) => prev.filter((_, i) => i !== index))
    }
  }

  const addAnswer = (questionIndex) => {
    setQuestions((prev) =>
      prev.map((question, index) =>
        index === questionIndex
          ? {
              ...question,
              answers: [...question.answers, { text: "", isCorrect: false }],
            }
          : question,
      ),
    )
  }

  const removeAnswer = (questionIndex, answerIndex) => {
    setQuestions((prev) =>
      prev.map((question, qIndex) =>
        qIndex === questionIndex
          ? {
              ...question,
              answers: question.answers.filter((_, aIndex) => aIndex !== answerIndex),
            }
          : question,
      ),
    )
  }

  const handleCorrectAnswerChange = (questionIndex, answerIndex, questionType) => {
    setQuestions((prev) =>
      prev.map((question, qIndex) =>
        qIndex === questionIndex
          ? {
              ...question,
              answers: question.answers.map((answer, aIndex) => ({
                ...answer,
                isCorrect:
                  questionType === "SingleChoice" || questionType === "TrueFalse"
                    ? aIndex === answerIndex
                    : aIndex === answerIndex
                      ? !answer.isCorrect
                      : answer.isCorrect,
              })),
            }
          : question,
      ),
    )
  }

  const validateForm = () => {
    if (!quizData.title.trim()) {
      toast.error("Quiz title is required")
      return false
    }

    if (!quizData.categoryId) {
      toast.error("Please select a category")
      return false
    }

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]

      if (!question.text.trim()) {
        toast.error(`Question ${i + 1} text is required`)
        return false
      }

      if (question.type === "FillInBlank") {
        if (!question.correctAnswer.trim()) {
          toast.error(`Question ${i + 1} must have a correct answer for Fill in Blank type`)
          return false
        }
      } else {
        if (question.answers.length < 2 && question.type !== "TrueFalse") {
          toast.error(`Question ${i + 1} must have at least 2 answers`)
          return false
        }

        const hasCorrectAnswer = question.answers.some((answer) => answer.isCorrect)
        if (!hasCorrectAnswer) {
          toast.error(`Question ${i + 1} must have at least one correct answer`)
          return false
        }

        for (let j = 0; j < question.answers.length; j++) {
          if (!question.answers[j].text.trim()) {
            toast.error(`Question ${i + 1}, Answer ${j + 1} text is required`)
            return false
          }
        }
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const createQuizDto = {
        title: quizData.title,
        description: quizData.description,
        categoryId: Number.parseInt(quizData.categoryId),
        difficultyLevel: difficultyMap[quizData.difficulty],
        timeLimit: quizData.timeLimit,
        questions: questions.map((question, index) => ({
          questionText: question.text,
          questionType: questionTypeMap[question.type],
          points: question.points,
          orderIndex: index,
          answers:
            question.type === "FillInBlank"
              ? [{ answerText: question.correctAnswer, isCorrect: true }]
              : question.answers.map((answer,aIndex) => ({
                  answerText: answer.text,
                  isCorrect: answer.isCorrect,
                  orderIndex: aIndex
                })),
        })),
      }

      const response = await quizService.createQuiz(createQuizDto)

      if (response.success) {
        toast.success("Quiz created successfully!")
        navigate("/admin")
      } else {
        toast.error(response.message || "Failed to create quiz")
      }
    } catch (error) {
      console.error("Error creating quiz:", error)
      toast.error("Failed to create quiz")
    } finally {
      setLoading(false)
    }
  }

  const renderAnswerSection = (question, questionIndex) => {
    if (question.type === "FillInBlank") {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer *</label>
          <input
            type="text"
            value={question.correctAnswer}
            onChange={(e) => handleQuestionChange(questionIndex, "correctAnswer", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter the correct answer"
            required
          />
          <p className="text-sm text-gray-500 mt-1">Users will need to type this exact answer (case-insensitive)</p>
        </div>
      )
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-4">
          <label className="block text-sm font-medium text-gray-700">Answers *</label>
          {question.type !== "TrueFalse" && (
            <button
              type="button"
              onClick={() => addAnswer(questionIndex)}
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              Add Answer
            </button>
          )}
        </div>

        <div className="space-y-3">
          {question.answers.map((answer, answerIndex) => (
            <div key={answerIndex} className="flex items-center space-x-3">
              <input
                type={question.type === "SingleChoice" || question.type === "TrueFalse" ? "radio" : "checkbox"}
                name={`question-${questionIndex}-correct`}
                checked={answer.isCorrect}
                onChange={() => handleCorrectAnswerChange(questionIndex, answerIndex, question.type)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <input
                type="text"
                value={answer.text}
                onChange={(e) => handleAnswerChange(questionIndex, answerIndex, "text", e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder={`Answer ${answerIndex + 1}`}
                required
                readOnly={question.type === "TrueFalse"}
              />
              {question.answers.length > 2 && question.type !== "TrueFalse" && (
                <button
                  type="button"
                  onClick={() => removeAnswer(questionIndex, answerIndex)}
                  className="text-red-600 hover:text-red-700 px-2 py-1"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        {question.type === "MultipleChoice" && (
          <p className="text-sm text-gray-500 mt-2">Multiple answers can be correct for this question type</p>
        )}
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
        <p className="text-gray-600 mt-2">Fill in the details to create a new quiz</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Quiz Basic Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quiz Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title *</label>
              <input
                type="text"
                value={quizData.title}
                onChange={(e) => handleQuizDataChange("title", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter quiz title"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={quizData.categoryId}
                onChange={(e) => handleQuizDataChange("categoryId", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={quizData.difficulty}
                onChange={(e) => handleQuizDataChange("difficulty", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
              <input
                type="number"
                min="1"
                max="180"
                value={quizData.timeLimit}
                onChange={(e) => handleQuizDataChange("timeLimit", Number.parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={quizData.description}
              onChange={(e) => handleQuizDataChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter quiz description"
            />
          </div>

          
        </div>

        {/* Questions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Question
            </button>
          </div>

          <div className="space-y-8">
            {questions.map((question, questionIndex) => (
              <div key={questionIndex} className="border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Question {questionIndex + 1}</h3>
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(questionIndex)}
                      className="text-red-600 hover:text-red-700 px-3 py-1 rounded border border-red-300 hover:bg-red-50"
                    >
                      Remove Question
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                    <select
                      value={question.type}
                      onChange={(e) => handleQuestionChange(questionIndex, "type", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="SingleChoice">Single Choice</option>
                      <option value="MultipleChoice">Multiple Choice</option>
                      <option value="TrueFalse">True/False</option>
                      <option value="FillInBlank">Fill in Blank</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={question.points}
                      onChange={(e) => handleQuestionChange(questionIndex, "points", Number.parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Text *</label>
                  <textarea
                    value={question.text}
                    onChange={(e) => handleQuestionChange(questionIndex, "text", e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter question text"
                    required
                  />
                </div>

              
                {/* Answers Section */}
                {renderAnswerSection(question, questionIndex)}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/admin")}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Creating..." : "Create Quiz"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default QuizCreator









