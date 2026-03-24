import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { storage } from '@/lib/utils/storage';

export interface AuthState {
  user: {
    id: string;
    email: string;
    full_name: string;
    role?: string;
    avatar_url?: string;
    is_verified?: boolean;
  } | null;
  isLoading: boolean;
  error: string | null;
  registrationEmail: string | null;
  isOTPSent: boolean;
  isVerified: boolean;
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  registrationEmail: null,
  isOTPSent: false,
  isVerified: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Register actions
    registerRequest: (
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _action: PayloadAction<{
        email: string;
        password: string;
        full_name: string;
      }>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    registerSuccess: (state, action: PayloadAction<{ email: string }>) => {
      state.isLoading = false;
      state.registrationEmail = action.payload.email;
      state.isOTPSent = true;
      state.error = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Verify OTP actions
    verifyOTPRequest: (
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _action: PayloadAction<{ email: string; code: string }>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    verifyOTPSuccess: (
      state,
      action: PayloadAction<{
        access_token?: string;
        refresh_token?: string;
        user: {
          id: string;
          email: string;
          full_name: string;
          role?: string;
          avatar_url?: string;
          is_verified?: boolean;
        };
      }>
    ) => {
      state.isLoading = false;
      state.isVerified = true;
      state.user = action.payload.user;
      state.error = null;
      
      if (action.payload.access_token) {
        storage.setToken(action.payload.access_token);
      }
      if (action.payload.refresh_token) {
        storage.setRefreshToken(action.payload.refresh_token);
      }
      storage.setUserData(action.payload.user);
    },
    verifyOTPFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Resend OTP actions
    resendOTPRequest: (
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _action: PayloadAction<{ email: string }>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    resendOTPSuccess: (state) => {
      state.isLoading = false;
      state.error = null;
    },
    resendOTPFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Reset actions
    resetAuthState: (state) => {
      state.isLoading = false;
      state.error = null;
      state.registrationEmail = null;
      state.isOTPSent = false;
      state.isVerified = false;
    },
    clearError: (state) => {
      state.error = null;
    },

    // Login actions
    loginRequest: (
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _action: PayloadAction<{ email: string; password: string }>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (
      state,
      action: PayloadAction<{
        access_token: string;
        refresh_token: string;
        user: {
          id: string;
          email: string;
          full_name: string;
          role?: string;
          avatar_url?: string;
          is_verified?: boolean;
        };
      }>
    ) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.error = null;
      
      storage.setToken(action.payload.access_token);
      storage.setRefreshToken(action.payload.refresh_token);
      storage.setUserData(action.payload.user);
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Google Login actions
    googleLoginRequest: (
      state,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      _action: PayloadAction<{ token: string }>
    ) => {
      state.isLoading = true;
      state.error = null;
    },
    googleLoginSuccess: (
      state,
      action: PayloadAction<{
        access_token: string;
        refresh_token: string;
        user: {
          id: string;
          email: string;
          full_name: string;
          role?: string;
          avatar_url?: string;
          is_verified?: boolean;
        };
      }>
    ) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.error = null;
      
      storage.setToken(action.payload.access_token);
      storage.setRefreshToken(action.payload.refresh_token);
      storage.setUserData(action.payload.user);
    },
    googleLoginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  registerRequest,
  registerSuccess,
  registerFailure,
  verifyOTPRequest,
  verifyOTPSuccess,
  verifyOTPFailure,
  resendOTPRequest,
  resendOTPSuccess,
  resendOTPFailure,
  resetAuthState,
  clearError,
  loginRequest,
  loginSuccess,
  loginFailure,
  googleLoginRequest,
  googleLoginSuccess,
  googleLoginFailure,
} = authSlice.actions;

export default authSlice.reducer;
