import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '@/lib/api/auth';
import {
  registerRequest,
  registerSuccess,
  registerFailure,
  verifyOTPRequest,
  verifyOTPSuccess,
  verifyOTPFailure,
  resendOTPRequest,
  resendOTPSuccess,
  resendOTPFailure,
  loginRequest,
  loginSuccess,
  loginFailure,
  googleLoginRequest,
  googleLoginSuccess,
  googleLoginFailure,
} from '../slices/authSlice';

function* handleRegister(
  action: PayloadAction<{
    email: string;
    password: string;
    full_name: string;
  }>
): Generator {
  try {
    yield call(authAPI.register, action.payload);
    yield put(registerSuccess({ email: action.payload.email }));
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    const errorMessage =
      error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
    yield put(registerFailure(errorMessage));
  }
}

function* handleVerifyOTP(
  action: PayloadAction<{ email: string; code: string }>
): Generator {
  try {
    const response = (yield call(authAPI.verifyOTP, action.payload)) as {
      access_token: string;
      refresh_token: string;
      user: {
        id: string;
        email: string;
        full_name: string;
        role: string;
        avatar_url: string;
        is_verified: boolean;
      };
    };
    
    yield put(
      verifyOTPSuccess({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        user: {
          id: response.user.id,
          email: response.user.email,
          full_name: response.user.full_name,
          role: response.user.role,
          avatar_url: response.user.avatar_url,
          is_verified: response.user.is_verified,
        },
      })
    );

    // Redirect dựa trên role
    if (typeof window !== 'undefined') {
      if (response.user.role === 'admin') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/';
      }
    }
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    const errorMessage =
      error.response?.data?.message ||
      'Xác thực OTP thất bại. Vui lòng thử lại.';
    yield put(verifyOTPFailure(errorMessage));
  }
}

function* handleResendOTP(
  action: PayloadAction<{ email: string }>
): Generator {
  try {
    yield call(authAPI.resendOTP, action.payload);
    yield put(resendOTPSuccess());
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    const errorMessage =
      error.response?.data?.message ||
      'Gửi lại OTP thất bại. Vui lòng thử lại.';
    yield put(resendOTPFailure(errorMessage));
  }
}

function* handleLogin(
  action: PayloadAction<{ email: string; password: string }>
): Generator {
  try {
    const response = (yield call(authAPI.login, action.payload)) as {
      access_token: string;
      refresh_token: string;
      user: {
        id: string;
        email: string;
        full_name: string;
        role: string;
        avatar_url: string;
        is_verified: boolean;
      };
    };
    
    yield put(
      loginSuccess({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        user: {
          id: response.user.id,
          email: response.user.email,
          full_name: response.user.full_name,
          role: response.user.role,
          avatar_url: response.user.avatar_url,
          is_verified: response.user.is_verified,
        },
      })
    );

    // Redirect dựa trên role
    if (typeof window !== 'undefined') {
      if (response.user.role === 'admin') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/';
      }
    }
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    const errorMessage =
      error.response?.data?.message ||
      'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
    yield put(loginFailure(errorMessage));
  }
}

function* handleGoogleLogin(
  action: PayloadAction<{ token: string }>
): Generator {
  try {
    const response = (yield call(authAPI.googleLogin, action.payload)) as {
      access_token: string;
      refresh_token: string;
      user: {
        id: string;
        email: string;
        full_name: string;
        role: string;
        avatar_url: string;
        is_verified: boolean;
      };
    };
    
    yield put(
      googleLoginSuccess({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        user: {
          id: response.user.id,
          email: response.user.email,
          full_name: response.user.full_name,
          role: response.user.role,
          avatar_url: response.user.avatar_url,
          is_verified: response.user.is_verified,
        },
      })
    );

    // Redirect dựa trên role
    if (typeof window !== 'undefined') {
      if (response.user.role === 'admin') {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/';
      }
    }
  } catch (err) {
    const error = err as { response?: { data?: { message?: string } } };
    const errorMessage =
      error.response?.data?.message ||
      'Đăng nhập Google thất bại. Vui lòng thử lại.';
    yield put(googleLoginFailure(errorMessage));
  }
}

export function* authSaga() {
  yield takeLatest(registerRequest.type, handleRegister);
  yield takeLatest(verifyOTPRequest.type, handleVerifyOTP);
  yield takeLatest(resendOTPRequest.type, handleResendOTP);
  yield takeLatest(loginRequest.type, handleLogin);
  yield takeLatest(googleLoginRequest.type, handleGoogleLogin);
}
