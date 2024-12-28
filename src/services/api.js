// src/services/api.js
const BASE_URL = '/api';

export const apiService = {
  getExample: async () => {
    try {
      const response = await fetch(`${BASE_URL}/example`);
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }
};