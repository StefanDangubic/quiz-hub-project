import httpClient from './httpClient';
import { ApiResponse } from '../models/ApiResponse';

export const categoryService = {
  async getCategories() {
    try {
      const response = await httpClient.get('/categories');
      return ApiResponse.fromApiResponse(response);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  },

  async getCategoryById(categoryId) {
    try {
      const response = await httpClient.get(`/categories/${categoryId}`);
      return ApiResponse.fromApiResponse(response);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  },

  async createCategory(categoryData) {
    try {
      const response = await httpClient.post('/categories', categoryData);
      return ApiResponse.fromApiResponse(response);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  },

  async updateCategory(categoryId, categoryData) {
    try {
      const response = await httpClient.put(`/categories/${categoryId}`, categoryData);
      return ApiResponse.fromApiResponse(response);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  },

  async deleteCategory(categoryId) {
    try {
      const response = await httpClient.delete(`/categories/${categoryId}`);
      return ApiResponse.fromApiResponse(response);
    } catch (error) {
      return ApiResponse.error(error.message);
    }
  },
};
