import httpClient from './httpClient';
import { ApiResponse } from '../models/ApiResponse';

export const leaderboardService = {
  async getGlobalLeaderboard(count = 100) {
    try {
      const response = await httpClient.get(`/leaderboard/global?count=${count}`);
      return ApiResponse.fromApiResponse(response);
    } catch (error) {
      return ApiResponse.error(error.message);
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

  async getCategoryLeaderboard(categoryId, count = 100) {
    try {
      const response = await httpClient.get(`/leaderboard/category/${categoryId}?count=${count}`);
      return ApiResponse.fromApiResponse(response);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  },

  async getUserStats(userId) {
    try {
      const response = await httpClient.get(`/leaderboard/user/${userId}/stats`);
      return ApiResponse.fromApiResponse(response);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  },
};
