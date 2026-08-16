import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api',
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface GenerateRecommendationPayload {
  message: string;
}

export interface RecommendationResponse {
  data: any[];
  parsedRequest: any;
}

export const recommendationApi = {
  generate: async (message: string): Promise<RecommendationResponse> => {
    const response = await apiClient.post('/recommendations', { message });
    return response.data;
  },
  history: async () => {
    const response = await apiClient.get('/recommendations/history');
    return response.data;
  },
};

export default recommendationApi;
