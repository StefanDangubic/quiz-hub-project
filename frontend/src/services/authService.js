import httpClient from './httpClient';
import { ApiResponse } from '../models/ApiResponse';

export const authService = {
  async login(loginRequest) {
    try {
      const response = await httpClient.post('/Auth/login', loginRequest.toApiRequest());
      return ApiResponse.fromApiResponse(response);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  },

  async register(registerRequest) {
    try {
      const response = await httpClient.post('/Auth/register', registerRequest.toApiRequest());
      return ApiResponse.fromApiResponse(response);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  },

  async logout() {
    try {
      await httpClient.post('/Auth/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return ApiResponse.success(null, 'Logged out successfully');
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  },

  async getCurrentUser() {
    try {
      const response = await httpClient.get('/auth/profile');
      return ApiResponse.fromApiResponse(response);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  },
};
