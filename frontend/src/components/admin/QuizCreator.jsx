import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "react-hot-toast"
//import { quizService } from "../../services/quizService"
//import { categoryService } from "../../services/categoryService"

export default function QuizCreator() {
   const navigate = useNavigate();
   const [loading, setLoading] = useState(true);
   const [categories, setCategories] = useState([]);

    const [quizData, setQuizData] = useState({
    title: "",
    description: "",
    categoryId: "",
    difficulty: "Easy",
    timeLimit: 30,
    image: null,
  })
  
    const handleQuizDataChange = (field, value) => {
    setQuizData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }


  return (
    <div>
        <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Quiz</h1>
        <p className="text-gray-600 mt-2">Fill in the details to create a new quiz</p>
      </div>

      <form>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quiz Information</h2>

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





      </form>
    </div>
  )
}
