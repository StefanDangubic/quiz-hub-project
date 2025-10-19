import httpClient from "./httpClient"
import { ApiResponse } from "../models/ApiResponse"

export const quizService = {
  
  async getQuizzes(params = {}) {
    try {
      const queryParams = new URLSearchParams()

      // Add pagination
      queryParams.append("page", params.page || 1)
      queryParams.append("pageSize", params.pageSize || 10)

      // Add filters if they exist
      if (params.searchTerm) {
        queryParams.append("searchTerm", params.searchTerm)
      }
      if (params.categoryId) {
        queryParams.append("categoryId", params.categoryId)
      }
      if (params.difficulty !== undefined && params.difficulty !== null) {
        queryParams.append("difficulty", params.difficulty)
      }

      const response = await httpClient.get(`/quizzes?${queryParams.toString()}`)
      return ApiResponse.fromApiResponse(response)
    } catch (error) {
      return ApiResponse.error(error.message)
    }
  },

  // Get quiz with questions for editing
  async getQuizWithQuestions(id) {
    try {
      const response = await httpClient.get(`/quizzes/${id}/with-questions`)
       return ApiResponse.fromApiResponse(response)
    } catch (error) {
      return ApiResponse.error(error.message)
    }
  },

  async getQuizById(quizId) {
    try {
      const response = await httpClient.get(`/quizzes/${quizId}`)
      return ApiResponse.fromApiResponse(response)
    } catch (error) {
      return ApiResponse.error(error.message)
    }
  },

  async createQuiz(quizData) {
    try {
      const response = await httpClient.post("/Quizzes", quizData)
      return ApiResponse.fromApiResponse(response)
    } catch (error) {
      return ApiResponse.error(error.message)
    }
  },

  async updateQuiz(quizId, quizData) {
    try {
      const response = await httpClient.put(`/quizzes/${quizId}`, quizData)
      return ApiResponse.fromApiResponse(response)
    } catch (error) {
      return ApiResponse.error(error.message)
    }
  },

  async deleteQuiz(quizId) {
    try {
      const response = await httpClient.delete(`/quizzes/${quizId}`)
      return ApiResponse.fromApiResponse(response)
    } catch (error) {
      return ApiResponse.error(error.message)
    }
  },

  async toggleQuizStatus(quizId, isActive) {
    try {
      const response = await httpClient.patch(`/quizzes/${quizId}/status`, { isActive })
      return ApiResponse.fromApiResponse(response)
    } catch (error) {
      return ApiResponse.error(error.message)
    }
  },

  async startQuiz(quizId) {
    try {
      const response = await httpClient.post(`/quizzes/${quizId}/start`)
      return ApiResponse.fromApiResponse(response)
    } catch (error) {
      return ApiResponse.error(error.message)
    }
  },

  
  async submitQuiz(id, answers, timeSpent) {
    try {
      const response = await httpClient.post(`/quizzes/${id}/submit`, {
        quizId: id,
        answers,
        timeSpent,
      })
      return ApiResponse.fromApiResponse(response)
    } catch (error) {
      return ApiResponse.error(error.message)
    }
  },


  async getQuizResults(attemptId) {
    try {
      const response = await httpClient.get(`/quiz-attempts/${attemptId}/results`)
      return ApiResponse.fromApiResponse(response)
    } catch (error) {
      return ApiResponse.error(error.message)
    }
  },

 

  async getUserQuizAttempts(userId) {
    try {
      const response = await httpClient.get(`/users/${userId}/quiz-attempts`)
      return ApiResponse.fromApiResponse(response)
    } catch (error) {
      return ApiResponse.error(error.message)
    }
  },
   async getUserHistory(quizId = null) {
    try {
      const params = quizId ? { quizId } : {}
      const response = await httpClient.get("/quizzes/my-history", { params })
      return ApiResponse.fromApiResponse(response)
    } catch (error) {
        return ApiResponse.error(error.message)
    }
  },
  async getQuizProgress(quizId) {
    try {
      const response = await httpClient.get(`/quizzes/${quizId}/my-progress`)
       return ApiResponse.fromApiResponse(response)
    } catch (error) {
      return ApiResponse.error(error.message)
    }
  }


}
