import httpClient from "./httpClient"

const adminService = {
  // Get admin dashboard statistics
  getDashboardStats: async () => {
    try {
      const response = await httpClient.get("/admin/dashboard-stats")
      return response
    } catch (error) {
      console.error("Error fetching dashboard stats:", error)
      return {
        success: false,
        message: error.message || "Failed to fetch dashboard statistics",
      }
    }
  },

   getAllQuizAttempts: async () => {
    try {
      const response = await httpClient.get("/admin/quiz-attempts")
      return response
    } catch (error) {
      console.error("Error fetching quiz attempts:", error)
      return {
        success: false,
        message: error.message || "Failed to fetch quiz attempts",
      }
    }
  },

 
}

export default adminService
