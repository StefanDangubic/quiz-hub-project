import httpClient from './httpClient';
import { ApiResponse } from '../models/ApiResponse';

export const leaderboardService = {
  async getGlobalLeaderboard(params = {}) {
    try {
      const queryParams = new URLSearchParams()

      if (params.quizId) queryParams.append("quizId", params.quizId)
      if (params.timePeriod) queryParams.append("timePeriod", params.timePeriod)
      if (params.count) queryParams.append("count", params.count)
      if (params.page) queryParams.append("page", params.page)
      if (params.pageSize) queryParams.append("pageSize", params.pageSize)

      const response = await httpClient.get(`/leaderboard/global?${queryParams}`)
      return ApiResponse.fromApiResponse(response)
    } catch (error) {
      return ApiResponse.error(error.message)
    }
  },

  async getQuizLeaderboard(quizId, count = 10) {
    try {
      const response = await httpClient.get(`/leaderboard/quiz/${quizId}?count=${count}`);
      return ApiResponse.fromApiResponse(response);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  },

  

   async getUserPosition(params = {}) {
    try {
      const queryParams = new URLSearchParams()
      if (params.quizId) queryParams.append("quizId", params.quizId)
      if (params.timePeriod) queryParams.append("timePeriod", params.timePeriod)

      const response = await httpClient.get(`/leaderboard/user/position?${queryParams}`)
      return ApiResponse.fromApiResponse(response)
    } catch (error) {
      return ApiResponse.error(error.message)
    }
  },

  async getQuizzesForFilter() {
    try {
      const response = await httpClient.get("/quizzes")
      return ApiResponse.fromApiResponse(response)
    } catch (error) {
      return ApiResponse.error(error.message)
    }
  },

  async getUserStats(userId) {
    try {
      const response = await httpClient.get(`/leaderboard/user/${userId}/stats`)
      return ApiResponse.fromApiResponse(response)
    } catch (error) {
      return ApiResponse.error(error.message)
    }
  },

 
};
