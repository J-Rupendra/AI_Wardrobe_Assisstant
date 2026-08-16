import axios from 'axios';

const BASE_URL = '/api/chat';

export interface ChatMessage {
  _id: string;
  role: 'user' | 'assistant';
  content: string;
  eventDetails?: any;
  createdAt: string;
}

const axiosInstance = axios.create({ baseURL: BASE_URL });

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const chatApi = {
  getMessages: (limit?: number) =>
    axiosInstance.get<ChatMessage[]>('/', { params: { limit } }),

  sendMessage: (content: string, eventDetails?: any) =>
    axiosInstance.post<ChatMessage>('/', { content, eventDetails }),

  clearChat: () =>
    axiosInstance.delete<{ message: string }>('/'),
};

export default chatApi;
