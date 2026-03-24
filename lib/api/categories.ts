import axios from 'axios';
import { storage } from '../utils/storage';
import { decryptResponse, isEncrypted } from '../utils/encryption';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance with interceptor
const apiClient = axios.create({
  baseURL: API_URL,
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response decryption
apiClient.interceptors.response.use(
  async (response) => {
    if (isEncrypted(response.data)) {
      try {
        const decrypted = await decryptResponse(response.data);
        response.data = decrypted;
      } catch {
        throw new Error('Decryption failed');
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = storage.getRefreshToken();

        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          let data = response.data;

          if (isEncrypted(data)) {
            data = await decryptResponse(data);
          }

          const { access_token } = data;
          storage.setToken(access_token);

          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch {
        storage.clearAll();
        window.location.href = '/auth/signin';
        return Promise.reject(error);
      }
    }

    if (error.response?.status === 401) {
      storage.clearAll();
      window.location.href = '/auth/signin';
    }

    return Promise.reject(error);
  }
);

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string | null;
  sort_order?: number;
  is_active: boolean | string;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

export interface CreateCategoryPayload {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string | null;
  sort_order?: number;
  is_active?: boolean;
}

export interface UpdateCategoryPayload {
  name?: string;
  slug?: string;
  description?: string;
  image_url?: string;
  parent_id?: string | null;
  sort_order?: number;
}

export interface CategoryResponse {
  id?: string;
  [key: string]: unknown;
}

export const categoriesAPI = {
  // GET /api/categories - Get all categories (Public)
  getAll: async () => {
    const response = await apiClient.get('/categories');
    return response.data;
  },

  // GET /api/categories/tree - Get category tree with hierarchy (Public)
  getTree: async () => {
    const response = await apiClient.get('/categories/tree');
    return response.data;
  },

  // POST /api/categories/add - Create category (Admin only)
  create: async (data: CreateCategoryPayload): Promise<CategoryResponse> => {
    const response = await apiClient.post('/categories/add', data);
    return response.data;
  },

  // GET /api/categories/{category_id} - Get category by ID (Public)
  getById: async (categoryId: string) => {
    const response = await apiClient.get(`/categories/${categoryId}`);
    return response.data;
  },

  // GET /api/categories/slug/{slug} - Get category by slug (Public)
  getBySlug: async (slug: string) => {
    const response = await apiClient.get(`/categories/slug/${slug}`);
    return response.data;
  },

  // PUT /api/categories/{category_id} - Update category (Admin only)
  update: async (categoryId: string, data: UpdateCategoryPayload) => {
    const response = await apiClient.put(`/categories/${categoryId}`, data);
    return response.data;
  },

  // DELETE /api/categories/{category_id} - Delete category (Admin only)
  delete: async (categoryId: string) => {
    const response = await apiClient.delete(`/categories/${categoryId}`);
    return response.data;
  },

  // PUT /api/categories/{category_id}/toggle-status - Toggle category visibility (Admin only)
  toggleStatus: async (categoryId: string) => {
    const response = await apiClient.put(`/categories/${categoryId}/toggle-status`);
    return response.data;
  },
};
