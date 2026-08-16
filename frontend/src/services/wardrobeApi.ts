import axios from 'axios';

const BASE_URL = '/api/wardrobe';

export interface WardrobeItem {
  _id: string;
  category: string;
  name: string;
  colors: string[];
  formality: number;
  styleTags: string[];
  occasionTags: string[];
  image: {
    url: string;
  };
  active: boolean;
  createdAt: string;
}

const axiosInstance = axios.create({ baseURL: BASE_URL });

// Add auth token to requests
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const wardrobeApi = {
  getItems: (filters?: { category?: string; active?: boolean }) =>
    axiosInstance.get<WardrobeItem[]>('/', { params: filters }),

  getItem: (id: string) =>
    axiosInstance.get<WardrobeItem>(`/${id}`),

  createItem: (formData: FormData) =>
    axiosInstance.post<WardrobeItem>('/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  updateItem: (id: string, data: Partial<WardrobeItem>) =>
    axiosInstance.patch<WardrobeItem>(`/${id}`, data),

  deleteItem: (id: string) =>
    axiosInstance.delete(`/${id}`),
};

export default wardrobeApi;
