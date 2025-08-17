import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { quizService } from "../../services/quizService"
import { categoryService } from "../../services/categoryService"
import { uploadService } from "../../services/uploadService"
import ImageUpload from "../common/ImageUpload"

const QuizEditor = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState([])

  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    categoryId: "",
    difficultyLevel: 0,
    timeLimit: "",
   
    questions: [],
  })

  const [errors, setErrors] = useState({})

  const questionTypes = [
    { value: 1, label: "Single Choice" },
    { value: 2, label: "Multiple Choice" },
    { value: 3, label: "True/False" },
    { value: 4, label: "Fill in Blank" },
  ]

  const difficultyLevels = [
    { value: 1, label: "Easy" },
    { value: 2, label: "Medium" },
    { value: 3, label: "Hard" },
  ]

  useEffect(() => {
    loadCategories()
    loadQuiz()
  }, [id])

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

  const loadQuiz = async () => {
    try {
      setLoading(true)
      const response = await quizService.getQuizWithQuestions(id)

      if (response.success) {
        const quizData = response.data
        setQuiz({
          title: quizData.title || "",
          description: quizData.description || "",
          categoryId: quizData.categoryId || "",
          difficultyLevel: quizData.difficultyLevel || 0,
          timeLimit: quizData.timeLimit || "",
          questions:
            quizData.questions?.map((q) => ({
              id: q.id,
              questionText: q.questionText,
              questionType: q.questionType,
              points: q.points,      
              correctAnswer: q.questionType === 4 ? q.answers?.find((a) => a.isCorrect)?.answerText || "" : "",
              answers:
                q.answers?.map((a) => ({
                  id: a.id,
                  answerText: a.answerText,
                  isCorrect: a.isCorrect,
                })) || [],
            })) || [],
        })
      } else {
        setError(response.message || "Failed to load quiz")
      }
    } catch (error) {
      console.error("Error loading quiz:", error)
      setError("Failed to load quiz")
    } finally {
      setLoading(false)
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!quiz.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!quiz.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!quiz.categoryId) {
      newErrors.categoryId = "Category is required"
    }

    if (quiz.questions.length === 0) {
      newErrors.questions = "At least one question is required"
    }

    quiz.questions.forEach((question, qIndex) => {
      if (!question.questionText.trim()) {
        newErrors[`question_${qIndex}_text`] = "Question text is required"
      }

      if (!question.points || question.points < 1) {
        newErrors[`question_${qIndex}_points`] = "Points must be at least 1"
      }

      if (question.questionType === 4) {
        // Fill in Blank
        if (!question.correctAnswer.trim()) {
          newErrors[`question_${qIndex}_correctAnswer`] = "Correct answer is required"
        }
      } else {
        if (question.answers.length < 2) {
          newErrors[`question_${qIndex}_answers`] = "At least 2 answers are required"
        }

        const hasCorrectAnswer = question.answers.some((answer) => answer.isCorrect)
        if (!hasCorrectAnswer) {
          newErrors[`question_${qIndex}_correct`] = "At least one correct answer is required"
        }

        question.answers.forEach((answer, aIndex) => {
          if (!answer.answerText.trim()) {
            newErrors[`question_${qIndex}_answer_${aIndex}`] = "Answer text is required"
          }
        })
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleQuizChange = (field, value) => {
    setQuiz((prev) => ({
      ...prev,
      [field]: value,
    }))

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }))
    }
  }


  const addQuestion = () => {
    const newQuestion = {
      id: null,
      questionText: "",
      questionType: 1,
      points: 1,
     // imageUrl: "",
      correctAnswer: "",
      answers: [
        { id: null, answerText: "", isCorrect: true },
        { id: null, answerText: "", isCorrect: false },
      ],
    }

    setQuiz((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }))
  }

  const removeQuestion = (questionIndex) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.filter((_, index) => index !== questionIndex),
    }))
  }

  const handleQuestionChange = (questionIndex, field, value) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((question, index) => {
        if (index === questionIndex) {
          const updatedQuestion = { ...question, [field]: value }

          // Handle question type changes
          if (field === "questionType") {
            if (value === 3) {
              // True/False
              updatedQuestion.answers = [
                { id: null, answerText: "True", isCorrect: true },
                { id: null, answerText: "False", isCorrect: false },
              ]
            } else if (value === 4) {
              // Fill in Blank
              updatedQuestion.answers = []
              updatedQuestion.correctAnswer = ""
            } else if (question.questionType === 3 || question.questionType === 4) {
              // Switching from True/False or Fill in Blank to other types
              updatedQuestion.answers = [
                { id: null, answerText: "", isCorrect: true },
                { id: null, answerText: "", isCorrect: false },
              ]
              updatedQuestion.correctAnswer = ""
            }
          }

          return updatedQuestion
        }
        return question
      }),
    }))
  }

  const addAnswer = (questionIndex) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((question, index) => {
        if (index === questionIndex) {
          return {
            ...question,
            answers: [...question.answers, { id: null, answerText: "", isCorrect: false }],
          }
        }
        return question
      }),
    }))
  }

  const removeAnswer = (questionIndex, answerIndex) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((question, index) => {
        if (index === questionIndex) {
          return {
            ...question,
            answers: question.answers.filter((_, aIndex) => aIndex !== answerIndex),
          }
        }
        return question
      }),
    }))
  }

  const handleAnswerChange = (questionIndex, answerIndex, field, value) => {
    setQuiz((prev) => ({
      ...prev,
      questions: prev.questions.map((question, qIndex) => {
        if (qIndex === questionIndex) {
          return {
            ...question,
            answers: question.answers.map((answer, aIndex) => {
              if (aIndex === answerIndex) {
                return { ...answer, [field]: value }
              }
              return answer
            }),
          }
        }
        return question
      }),
    }))
  }

  const handleCorrectAnswerChange = (questionIndex, answerIndex, isCorrect) => {
    const question = quiz.questions[questionIndex]

    if (question.questionType === 1 || question.questionType === 3) {
      // Single Choice or True/False
      // Only one answer can be correct
      setQuiz((prev) => ({
        ...prev,
        questions: prev.questions.map((q, qIndex) => {
          if (qIndex === questionIndex) {
            return {
              ...q,
              answers: q.answers.map((answer, aIndex) => ({
                ...answer,
                isCorrect: aIndex === answerIndex ? isCorrect : false,
              })),
            }
          }
          return q
        }),
      }))
    } else {
      // Multiple choice - multiple answers can be correct
      handleAnswerChange(questionIndex, answerIndex, "isCorrect", isCorrect)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)
      setError("")

      // Prepare quiz data for submission
      const quizData = {
        title: quiz.title.trim(),
        description: quiz.description.trim(),
        categoryId: Number.parseInt(quiz.categoryId),
        difficultyLevel: quiz.difficultyLevel,
        timeLimit: quiz.timeLimit ? Number.parseInt(quiz.timeLimit) : null,
      //  imageUrl: quiz.imageUrl,
        questions: quiz.questions.map((question,qIndex) => ({
          id: question.id,
          questionText: question.questionText.trim(),
          questionType: question.questionType,
          points: Number.parseInt(question.points),
           orderIndex: qIndex,
        //  imageUrl: question.imageUrl,
          answers:
            question.questionType === 4
              ? [{ answerText: question.correctAnswer.trim(), isCorrect: true }]
              : question.answers.map((answer,aIndex) => ({
                  id: answer.id,
                  answerText: answer.answerText.trim(),
                  isCorrect: answer.isCorrect,
                  orderIndex: aIndex,
                })),
        })),
      }

      const response = await quizService.updateQuiz(id, quizData)

      if (response.success) {
        navigate("/admin/quizzes", {
          state: { message: "Quiz updated successfully!" },
        })
      } else {
        setError(response.message || "Failed to update quiz")
      }
    } catch (error) {
      console.error("Error updating quiz:", error)
      setError("Failed to update quiz")
    } finally {
      setSaving(false)
    }
  }

  const renderAnswerSection = (question, questionIndex) => {
    if (question.questionType === 4) {
      // Fill in Blank
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Correct Answer</label>
          <input
            type="text"
            value={question.correctAnswer}
            onChange={(e) => handleQuestionChange(questionIndex, "correctAnswer", e.target.value)}
            placeholder="Enter the correct answer"
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors[`question_${questionIndex}_correctAnswer`] ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors[`question_${questionIndex}_correctAnswer`] && (
            <p className="text-red-500 text-sm mt-1">{errors[`question_${questionIndex}_correctAnswer`]}</p>
          )}
          <p className="text-sm text-gray-500 mt-1">Answer comparison is case-insensitive</p>
        </div>
      )
    }

    return (
      <div>
        <div className="flex justify-between items-center mb-3">
          <label className="block text-sm font-medium text-gray-700">
            Answers{" "}
            {question.questionType === 2 && <span className="text-gray-500">(Multiple correct answers allowed)</span>}
          </label>
          {question.questionType !== 3 && (
            <button
              type="button"
              onClick={() => addAnswer(questionIndex)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              + Add Answer
            </button>
          )}
        </div>

        <div className="space-y-3">
          {question.answers.map((answer, answerIndex) => (
            <div key={answerIndex} className="flex items-center space-x-3">
              <input
                type={question.questionType === 1 || question.questionType === 3 ? "radio" : "checkbox"}
                name={`question_${questionIndex}_correct`}
                checked={answer.isCorrect}
                onChange={(e) => handleCorrectAnswerChange(questionIndex, answerIndex, e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
              />
              <input
                type="text"
                value={answer.answerText}
                onChange={(e) => handleAnswerChange(questionIndex, answerIndex, "answerText", e.target.value)}
                placeholder={`Answer ${answerIndex + 1}`}
                readOnly={question.questionType === 3}
                className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  question.questionType === 2 ? "bg-gray-50" : ""
                } ${errors[`question_${questionIndex}_answer_${answerIndex}`] ? "border-red-500" : "border-gray-300"}`}
              />
              {question.questionType !== 3 && question.answers.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeAnswer(questionIndex, answerIndex)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>

        {errors[`question_${questionIndex}_answers`] && (
          <p className="text-red-500 text-sm mt-1">{errors[`question_${questionIndex}_answers`]}</p>
        )}
        {errors[`question_${questionIndex}_correct`] && (
          <p className="text-red-500 text-sm mt-1">{errors[`question_${questionIndex}_correct`]}</p>
        )}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Edit Quiz</h1>
        <button onClick={() => navigate("/admin/quizzes")} className="text-gray-600 hover:text-gray-800 font-medium">
          ← Back to Quiz Management
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Quiz Basic Info */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quiz Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title *</label>
              <input
                type="text"
                value={quiz.title}
                onChange={(e) => handleQuizChange("title", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.title ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter quiz title"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                value={quiz.categoryId}
                onChange={(e) => handleQuizChange("categoryId", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.categoryId ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty Level</label>
              <select
                value={quiz.difficultyLevel}
                onChange={(e) => handleQuizChange("difficultyLevel", Number.parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {difficultyLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit (minutes)</label>
              <input
                type="number"
                value={quiz.timeLimit}
                onChange={(e) => handleQuizChange("timeLimit", e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              
                min="1"
              />
            </div>
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={quiz.description}
              onChange={(e) => handleQuizChange("description", e.target.value)}
              rows={3}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Enter quiz description"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

         
        </div>

        {/* Questions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
            <button
              type="button"
              onClick={addQuestion}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              Add Question
            </button>
          </div>

          {errors.questions && <p className="text-red-500 text-sm mb-4">{errors.questions}</p>}

          <div className="space-y-6">
            {quiz.questions.map((question, questionIndex) => (
              <div key={questionIndex} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Question {questionIndex + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="text-red-600 hover:text-red-800 p-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Question Type</label>
                    <select
                      value={question.questionType}
                      onChange={(e) =>
                        handleQuestionChange(questionIndex, "questionType", Number.parseInt(e.target.value))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {questionTypes.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Points</label>
                    <input
                      type="number"
                      value={question.points}
                      onChange={(e) => handleQuestionChange(questionIndex, "points", e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors[`question_${questionIndex}_points`] ? "border-red-500" : "border-gray-300"
                      }`}
                      min="1"
                    />
                    {errors[`question_${questionIndex}_points`] && (
                      <p className="text-red-500 text-sm mt-1">{errors[`question_${questionIndex}_points`]}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Question Text *</label>
                  <textarea
                    value={question.questionText}
                    onChange={(e) => handleQuestionChange(questionIndex, "questionText", e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors[`question_${questionIndex}_text`] ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter your question"
                  />
                  {errors[`question_${questionIndex}_text`] && (
                    <p className="text-red-500 text-sm mt-1">{errors[`question_${questionIndex}_text`]}</p>
                  )}
                </div>

                

                {renderAnswerSection(question, questionIndex)}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate("/admin/quizzes")}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default QuizEditor
