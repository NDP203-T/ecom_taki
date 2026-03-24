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

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category: string;
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductPayload {
  name: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  category: string;
  is_active?: boolean;
}

export interface UpdateProductPayload {
  name?: string;
  sku?: string;
  description?: string;
  price?: number;
  image_url?: string;
  category?: string;
}

export interface UpdateStockPayload {
  stock: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export interface CreateVariantPayload {
  name: string;
  price: number;
  stock: number;
  attributes: Record<string, string>;
}

export const productsAPI = {
  // GET /api/products - Get all products (Public)
  getAll: async () => {
    const response = await apiClient.get('/products');
    return response.data;
  },

  // POST /api/products/add - Create product (Admin only)
  create: async (data: CreateProductPayload) => {
    const response = await apiClient.post('/products/add', data);
    return response.data;
  },

  // GET /api/products/{product_id} - Get product by ID (Public)
  getById: async (productId: string) => {
    const response = await apiClient.get(`/products/${productId}`);
    return response.data;
  },

  // PUT /api/products/{product_id} - Update product (Admin only)
  update: async (productId: string, data: UpdateProductPayload) => {
    const response = await apiClient.put(`/products/${productId}`, data);
    return response.data;
  },

  // DELETE /api/products/{product_id} - Delete product (Admin only)
  delete: async (productId: string) => {
    const response = await apiClient.delete(`/products/${productId}`);
    return response.data;
  },

  // PUT /api/products/{product_id}/toggle-status - Toggle product visibility (Admin only)
  toggleStatus: async (productId: string) => {
    const response = await apiClient.put(`/products/${productId}/toggle-status`);
    return response.data;
  },

  // PUT /api/products/{product_id}/stock - Update product stock (Admin only)
  updateStock: async (productId: string, data: UpdateStockPayload) => {
    const response = await apiClient.put(`/products/${productId}/stock`, data);
    return response.data;
  },

  // POST /api/products/{product_id}/images - Upload product image (Admin only)
  uploadImage: async (productId: string, formData: FormData) => {
    const response = await apiClient.post(
      `/products/${productId}/images`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  },

  // POST /api/products/{product_id}/variants - Create product variant (Admin only)
  createVariant: async (productId: string, data: CreateVariantPayload) => {
    const response = await apiClient.post(
      `/products/${productId}/variants`,
      data
    );
    return response.data;
  },
};
