import Cookies from 'js-cookie';

// Sử dụng cookies với expiry 15 ngày
// Cookies sẽ tự động gửi kèm request và có thể set httpOnly từ backend

const COOKIE_OPTIONS = {
  expires: 15, // 15 ngày
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'strict' as const, // CSRF protection
};

const REFRESH_TOKEN_OPTIONS = {
  expires: 30, // 30 ngày cho refresh token
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
};

export const storage = {
  setToken: (token: string) => {
    Cookies.set('access_token', token, COOKIE_OPTIONS);
  },

  getToken: (): string | undefined => {
    return Cookies.get('access_token');
  },

  removeToken: () => {
    Cookies.remove('access_token');
  },

  setRefreshToken: (token: string) => {
    Cookies.set('refresh_token', token, REFRESH_TOKEN_OPTIONS);
  },

  getRefreshToken: (): string | undefined => {
    return Cookies.get('refresh_token');
  },

  removeRefreshToken: () => {
    Cookies.remove('refresh_token');
  },

  setUserData: (userData: {
    id: string;
    email: string;
    full_name: string;
    role?: string;
    avatar_url?: string;
    is_verified?: boolean;
  }) => {
    Cookies.set('user_data', JSON.stringify(userData), COOKIE_OPTIONS);
  },

  getUserData: (): {
    id: string;
    email: string;
    full_name: string;
    role?: string;
    avatar_url?: string;
    is_verified?: boolean;
  } | null => {
    const data = Cookies.get('user_data');
    if (data) {
      try {
        return JSON.parse(data);
      } catch {
        return null;
      }
    }
    return null;
  },

  removeUserData: () => {
    Cookies.remove('user_data');
  },

  clearAll: () => {
    Cookies.remove('access_token');
    Cookies.remove('refresh_token');
    Cookies.remove('user_data');
  },

  // Cập nhật expiry mỗi khi user active
  refreshExpiry: () => {
    const token = Cookies.get('access_token');
    const refreshToken = Cookies.get('refresh_token');
    const userData = Cookies.get('user_data');

    if (token) {
      Cookies.set('access_token', token, COOKIE_OPTIONS);
    }
    if (refreshToken) {
      Cookies.set('refresh_token', refreshToken, REFRESH_TOKEN_OPTIONS);
    }
    if (userData) {
      Cookies.set('user_data', userData, COOKIE_OPTIONS);
    }
  },
};
