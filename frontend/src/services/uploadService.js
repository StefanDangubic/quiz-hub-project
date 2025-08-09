import httpClient from './httpClient';
import { ApiResponse } from '../models/ApiResponse';

export const uploadService = {
  async uploadImage(file, type = 'profile') {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const endpoint = type === 'profile' ? '/Upload/profile-image' : '/upload/quiz-image';
      const response = await httpClient.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const apiResponse = ApiResponse.fromApiResponse(response);
      if (apiResponse.success) {
        return apiResponse.data;
      }
      
      throw new Error(apiResponse.message);
    } catch (error) {
      throw new Error(error.message || 'Upload failed');
    }
  },
};
