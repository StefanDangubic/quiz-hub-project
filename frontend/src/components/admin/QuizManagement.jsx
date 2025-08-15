






"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Edit, Trash2, Eye, Plus, Search, Filter } from "lucide-react"
import { quizService } from "../../services/quizService"
import { categoryService } from "../../services/categoryService"

const QuizManagement = () => {
  const navigate = useNavigate()
  const [quizzes, setQuizzes] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [filters, setFilters] = useState({
    search: "",
    categoryId: "",
    difficulty: "",
    page: 1,
    pageSize: 10,
  })
  const [pagination, setPagination] = useState({
    totalCount: 0,
    totalPages: 0,
    currentPage: 1,
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    loadCategories()
  }, [])

  useEffect(() => {
    loadQuizzes()
  }, [filters])

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

  const loadQuizzes = async () => {
    try {
      setLoading(true)
      setError("")

      const params = {
        page: filters.page,
        pageSize: filters.pageSize,
      }

      // Add search term if provided
      if (filters.search.trim()) {
        params.searchTerm = filters.search.trim()
      }

      // Add category filter if selected
      if (filters.categoryId) {
        params.categoryId = Number.parseInt(filters.categoryId)
      }

      // Add difficulty filter if selected
      if (filters.difficulty) {
        params.difficulty = Number.parseInt(filters.difficulty)
      }

      const response = await quizService.getQuizzes(params)

      if (response.success) {
        setQuizzes(response.data.items || [])
        setPagination({
          totalCount: response.data.totalCount || 0,
          totalPages: response.data.totalPages || 0,
          currentPage: response.data.currentPage || 1,
        })
      } else {
        setError(response.message || "Failed to load quizzes")
      }
    } catch (error) {
      console.error("Error loading quizzes:", error)
      setError("Failed to load quizzes")
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      page: key !== "page" ? 1 : value, // Reset to page 1 when changing filters
    }))
  }

  const handleDeleteQuiz = async (quizId) => {
    if (!window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
      return
    }

    try {
      setDeleting(quizId)
      setError("")
      setSuccess("")

      const response = await quizService.deleteQuiz(quizId)

      if (response.success) {
        setSuccess("Quiz deleted successfully!")
        // Reload quizzes to reflect changes
        loadQuizzes()
      } else {
        setError(response.message || "Failed to delete quiz")
      }
    } catch (error) {
      console.error("Error deleting quiz:", error)
      setError("Failed to delete quiz")
    } finally {
      setDeleting(null)
    }
  }

  const clearFilters = () => {
    setFilters({
      search: "",
      categoryId: "",
      difficulty: "",
      page: 1,
      pageSize: 10,
    })
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // const getStatusColor = (isActive) => {
  //   return isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
  // }

  // if (loading && filters.page === 1) {
  //   return (
  //     <div className="flex items-center justify-center min-h-64">
  //       <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 h-8 w-8"></div>
  //     </div>
  //   )
  // }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quiz Management</h1>
          <p className="text-gray-600 mt-2">Manage all quizzes in the system</p>
        </div>
        <Link
          to="/admin/quizzes/create"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Quiz
        </Link>
      </div>

      {/* Messages */}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">{success}</div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Search by title, description, or category..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              value={filters.categoryId}
              onChange={(e) => handleFilterChange("categoryId", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
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
              value={filters.difficulty}
              onChange={(e) => handleFilterChange("difficulty", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Difficulties</option>
              <option value="1">Easy</option>
              <option value="2">Medium</option>
              <option value="3">Hard</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center"
            >
              <Filter className="h-4 w-4 mr-2" />
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Difficulty
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Questions
                </th>
                {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th> */}
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {quizzes.map((quiz) => (
                <tr key={quiz.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {/* {quiz.imageUrl && (
                        <img
                          src={quiz.imageUrl || "/placeholder.svg"}
                          alt={quiz.title}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                        />
                      )} */}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">{quiz.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{quiz.categoryName}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(quiz.difficultyName)}`}
                    >
                      {quiz.difficultyName}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quiz.questionCount || 0}</td>
                  {/* <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quiz.isActive)}`}
                    >
                      {quiz.isActive ? "Active" : "Inactive"}
                    </span>
                  </td> */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {/* <Link
                        to={`/quiz/${quiz.id}`}
                        className="text-blue-600 hover:text-blue-700 transition-colors p-1 rounded hover:bg-blue-50"
                        title="View Quiz"
                      >
                        <Eye className="h-4 w-4" />
                      </Link> */}
                      <Link
                        to={`/admin/quizzes/edit/${quiz.id}`}
                        className="text-green-600 hover:text-green-700 transition-colors p-1 rounded hover:bg-green-50"
                        title="Edit Quiz"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        disabled={deleting === quiz.id}
                        className="text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 p-1 rounded hover:bg-red-50"
                        title="Delete Quiz"
                      >
                        {deleting === quiz.id ? (
                          <div className="animate-spin rounded-full border-2 border-red-600 border-t-transparent h-4 w-4"></div>
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {quizzes.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
            <p className="text-gray-500 mb-4">
              {filters.search || filters.categoryId || filters.difficulty
                ? "Try adjusting your search criteria"
                : "Get started by creating your first quiz"}
            </p>
            {/* <Link
              to="/admin/quizzes/create"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Quiz
            </Link> */}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handleFilterChange("page", Math.max(1, filters.page - 1))}
                  disabled={filters.page === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handleFilterChange("page", Math.min(pagination.totalPages, filters.page + 1))}
                  disabled={filters.page === pagination.totalPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(filters.page - 1) * filters.pageSize + 1}</span> to{" "}
                    <span className="font-medium">
                      {Math.min(filters.page * filters.pageSize, pagination.totalCount)}
                    </span>{" "}
                    of <span className="font-medium">{pagination.totalCount}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <button
                      onClick={() => handleFilterChange("page", Math.max(1, filters.page - 1))}
                      disabled={filters.page === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                      const page = i + 1
                      return (
                        <button
                          key={page}
                          onClick={() => handleFilterChange("page", page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            filters.page === page
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    })}
                    <button
                      onClick={() => handleFilterChange("page", Math.min(pagination.totalPages, filters.page + 1))}
                      disabled={filters.page === pagination.totalPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default QuizManagement





















// "use client"

// import { useState, useEffect } from "react"
// import { Link, useNavigate } from "react-router-dom"
// import { Edit, Trash2, Eye, Plus, Search, Filter } from "lucide-react"
// import { quizService } from "../../services/quizService"
// import { categoryService } from "../../services/categoryService"

// const QuizManagement = () => {
//   const navigate = useNavigate()
//   const [quizzes, setQuizzes] = useState([])
//   const [categories, setCategories] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [deleting, setDeleting] = useState(null)
//   const [filters, setFilters] = useState({
//     search: "",
//     categoryId: "",
//     difficulty: "",
//     page: 1,
//     pageSize: 10,
//   })
//   const [pagination, setPagination] = useState({
//     totalCount: 0,
//     totalPages: 0,
//     currentPage: 1,
//   })
//   const [error, setError] = useState("")
//   const [success, setSuccess] = useState("")

//   useEffect(() => {
//     loadCategories()
//   }, [])

//   useEffect(() => {
//     loadQuizzes()
//   }, [filters])

//   const loadCategories = async () => {
//     try {
//       const response = await categoryService.getCategories()
//       if (response.success) {
//         setCategories(response.data)
//       }
//     } catch (error) {
//       console.error("Error loading categories:", error)
//     }
//   }

//   const loadQuizzes = async () => {
//     try {
//       setLoading(true)
//       setError("")

//       const params = {
//         page: filters.page,
//         pageSize: filters.pageSize,
//       }

//       // Add search term if provided
//       if (filters.search.trim()) {
//         params.searchTerm = filters.search.trim()
//       }

//       // Add category filter if selected
//       if (filters.categoryId) {
//         params.categoryId = Number.parseInt(filters.categoryId)
//       }

//       // Add difficulty filter if selected
//       if (filters.difficulty) {
//         params.difficulty = Number.parseInt(filters.difficulty)
//       }

//       const response = await quizService.getQuizzes(params)

//       if (response.success) {
//         setQuizzes(response.data.items || [])
//         setPagination({
//           totalCount: response.data.totalCount || 0,
//           totalPages: response.data.totalPages || 0,
//           currentPage: response.data.currentPage || 1,
//         })
//       } else {
//         setError(response.message || "Failed to load quizzes")
//       }
//     } catch (error) {
//       console.error("Error loading quizzes:", error)
//       setError("Failed to load quizzes")
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({
//       ...prev,
//       [key]: value,
//       page: key !== "page" ? 1 : value, // Reset to page 1 when changing filters
//     }))
//   }

//   const handleDeleteQuiz = async (quizId) => {
//     if (!window.confirm("Are you sure you want to delete this quiz? This action cannot be undone.")) {
//       return
//     }

//     try {
//       setDeleting(quizId)
//       setError("")
//       setSuccess("")

//       const response = await quizService.deleteQuiz(quizId)

//       if (response.success) {
//         setSuccess("Quiz deleted successfully!")
//         // Reload quizzes to reflect changes
//         loadQuizzes()
//       } else {
//         setError(response.message || "Failed to delete quiz")
//       }
//     } catch (error) {
//       console.error("Error deleting quiz:", error)
//       setError("Failed to delete quiz")
//     } finally {
//       setDeleting(null)
//     }
//   }

//   const clearFilters = () => {
//     setFilters({
//       search: "",
//       categoryId: "",
//       difficulty: "",
//       page: 1,
//       pageSize: 10,
//     })
//   }

//   const getDifficultyColor = (difficulty) => {
//     switch (difficulty?.toLowerCase()) {
//       case "easy":
//         return "bg-green-100 text-green-800"
//       case "medium":
//         return "bg-yellow-100 text-yellow-800"
//       case "hard":
//         return "bg-red-100 text-red-800"
//       default:
//         return "bg-gray-100 text-gray-800"
//     }
//   }

//   // const getStatusColor = (isActive) => {
//   //   return isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
//   // }

//   // if (loading && filters.page === 1) {
//   //   return (
//   //     <div className="flex items-center justify-center min-h-64">
//   //       <div className="animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 h-8 w-8"></div>
//   //     </div>
//   //   )
//   // }

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">Quiz Management</h1>
//           <p className="text-gray-600 mt-2">Manage all quizzes in the system</p>
//         </div>
//         <Link
//           to="/admin/quizzes/create"
//           className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//         >
//           <Plus className="h-4 w-4 mr-2" />
//           Create Quiz
//         </Link>
//       </div>

//       {/* Messages */}
//       {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{error}</div>}
//       {success && (
//         <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">{success}</div>
//       )}

//       {/* Filters */}
//       <div className="bg-white rounded-lg shadow mb-6 p-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
//               <input
//                 type="text"
//                 value={filters.search}
//                 onChange={(e) => handleFilterChange("search", e.target.value)}
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 placeholder="Search by title, description, or category..."
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
//             <select
//               value={filters.categoryId}
//               onChange={(e) => handleFilterChange("categoryId", e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="">All Categories</option>
//               {categories.map((category) => (
//                 <option key={category.id} value={category.id}>
//                   {category.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
//             <select
//               value={filters.difficulty}
//               onChange={(e) => handleFilterChange("difficulty", e.target.value)}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//             >
//               <option value="">All Difficulties</option>
//               <option value="1">Easy</option>
//               <option value="2">Medium</option>
//               <option value="3">Hard</option>
//             </select>
//           </div>

//           <div className="flex items-end">
//             <button
//               onClick={clearFilters}
//               className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center"
//             >
//               <Filter className="h-4 w-4 mr-2" />
//               Clear
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Quiz Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quiz</th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Category
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Difficulty
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Questions
//                 </th>
//                 {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th> */}
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Created
//                 </th>
//                 <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {quizzes.map((quiz) => (
//                 <tr key={quiz.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="flex items-center">
//                       {quiz.imageUrl && (
//                         <img
//                           src={quiz.imageUrl || "/placeholder.svg"}
//                           alt={quiz.title}
//                           className="h-10 w-10 rounded-lg object-cover mr-3"
//                         />
//                       )}
//                       <div>
//                         <div className="text-sm font-medium text-gray-900">{quiz.title}</div>
//                         <div className="text-sm text-gray-500 max-w-xs truncate">{quiz.description}</div>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="text-sm text-gray-900">{quiz.categoryName}</span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(quiz.difficultyName)}`}
//                     >
//                       {quiz.difficultyName}
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{quiz.questionCount || 0}</td>
//                   {/* <td className="px-6 py-4 whitespace-nowrap">
//                     <span
//                       className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(quiz.isActive)}`}
//                     >
//                       {quiz.isActive ? "Active" : "Inactive"}
//                     </span>
//                   </td> */}
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {new Date(quiz.createdAt).toLocaleDateString()}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <div className="flex items-center justify-end space-x-2">
//                       <Link
//                         to={`/quiz/${quiz.id}`}
//                         className="text-blue-600 hover:text-blue-700 transition-colors p-1 rounded hover:bg-blue-50"
//                         title="View Quiz"
//                       >
//                         <Eye className="h-4 w-4" />
//                       </Link>
//                       <Link
//                         to={`/admin/quizzes/edit/${quiz.id}`}
//                         className="text-green-600 hover:text-green-700 transition-colors p-1 rounded hover:bg-green-50"
//                         title="Edit Quiz"
//                       >
//                         <Edit className="h-4 w-4" />
//                       </Link>
//                       <button
//                         onClick={() => handleDeleteQuiz(quiz.id)}
//                         disabled={deleting === quiz.id}
//                         className="text-red-600 hover:text-red-700 transition-colors disabled:opacity-50 p-1 rounded hover:bg-red-50"
//                         title="Delete Quiz"
//                       >
//                         {deleting === quiz.id ? (
//                           <div className="animate-spin rounded-full border-2 border-red-600 border-t-transparent h-4 w-4"></div>
//                         ) : (
//                           <Trash2 className="h-4 w-4" />
//                         )}
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Empty State */}
//         {quizzes.length === 0 && !loading && (
//           <div className="text-center py-12">
//             <div className="text-gray-400 mb-4">
//               <Search className="h-12 w-12 mx-auto" />
//             </div>
//             <h3 className="text-lg font-medium text-gray-900 mb-2">No quizzes found</h3>
//             <p className="text-gray-500 mb-4">
//               {filters.search || filters.categoryId || filters.difficulty
//                 ? "Try adjusting your search criteria"
//                 : "Get started by creating your first quiz"}
//             </p>
//             <Link
//               to="/admin/quizzes/create"
//               className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               <Plus className="h-4 w-4 mr-2" />
//               Create Quiz
//             </Link>
//           </div>
//         )}

//         {/* Pagination */}
//         {pagination.totalPages > 1 && (
//           <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
//             <div className="flex items-center justify-between">
//               <div className="flex-1 flex justify-between sm:hidden">
//                 <button
//                   onClick={() => handleFilterChange("page", Math.max(1, filters.page - 1))}
//                   disabled={filters.page === 1}
//                   className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Previous
//                 </button>
//                 <button
//                   onClick={() => handleFilterChange("page", Math.min(pagination.totalPages, filters.page + 1))}
//                   disabled={filters.page === pagination.totalPages}
//                   className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   Next
//                 </button>
//               </div>
//               <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                 <div>
//                   <p className="text-sm text-gray-700">
//                     Showing <span className="font-medium">{(filters.page - 1) * filters.pageSize + 1}</span> to{" "}
//                     <span className="font-medium">
//                       {Math.min(filters.page * filters.pageSize, pagination.totalCount)}
//                     </span>{" "}
//                     of <span className="font-medium">{pagination.totalCount}</span> results
//                   </p>
//                 </div>
//                 <div>
//                   <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
//                     <button
//                       onClick={() => handleFilterChange("page", Math.max(1, filters.page - 1))}
//                       disabled={filters.page === 1}
//                       className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Previous
//                     </button>
//                     {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
//                       const page = i + 1
//                       return (
//                         <button
//                           key={page}
//                           onClick={() => handleFilterChange("page", page)}
//                           className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
//                             filters.page === page
//                               ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
//                               : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
//                           }`}
//                         >
//                           {page}
//                         </button>
//                       )
//                     })}
//                     <button
//                       onClick={() => handleFilterChange("page", Math.min(pagination.totalPages, filters.page + 1))}
//                       disabled={filters.page === pagination.totalPages}
//                       className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                     >
//                       Next
//                     </button>
//                   </nav>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default QuizManagement





