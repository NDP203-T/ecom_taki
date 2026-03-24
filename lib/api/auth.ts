import axios from 'axios';
import { storage } from '../utils/storage';
import { decryptResponse, isEncrypted } from '../utils/encryption';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Create axios instance with interceptor
export const apiClient = axios.create({
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

// Handle response decryption and 401 errors
apiClient.interceptors.response.use(
  async (response) => {
    // Giải mã response nếu cần
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

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Lấy refresh token
        const refreshToken = storage.getRefreshToken();

        if (refreshToken) {
          // Gọi API refresh token
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          let data = response.data;

          // Giải mã response nếu cần
          if (isEncrypted(data)) {
            data = await decryptResponse(data);
          }

          const { access_token } = data;

          // Lưu access token mới
          storage.setToken(access_token);

          // Retry request với token mới
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token cũng hết hạn, logout user
        storage.clearAll();
        window.location.href = '/auth/signin';
        return Promise.reject(refreshError);
      }
    }

    // Token expired hoặc invalid và không thể refresh
    if (error.response?.status === 401) {
      storage.clearAll();
      window.location.href = '/auth/signin';
    }

    return Promise.reject(error);
  }
);

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
}

export interface VerifyOTPPayload {
  email: string;
  code: string;
}

export interface ResendOTPPayload {
  email: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RefreshTokenPayload {
  refresh_token: string;
}

export interface GoogleLoginPayload {
  token: string;
}

export const authAPI = {
  register: async (data: RegisterPayload) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  verifyOTP: async (data: VerifyOTPPayload) => {
    const response = await apiClient.post('/auth/verify-otp', data);
    return response.data;
  },

  resendOTP: async (data: ResendOTPPayload) => {
    const response = await apiClient.post('/auth/resend-otp', data);
    return response.data;
  },

  login: async (data: LoginPayload) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },

  googleLogin: async (data: GoogleLoginPayload) => {
    const response = await apiClient.post('/auth/google', data);
    return response.data;
  },
};
