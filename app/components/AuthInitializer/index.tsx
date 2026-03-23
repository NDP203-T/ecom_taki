'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/store/hooks';
import { loginSuccess } from '@/lib/store/slices/authSlice';
import { storage } from '@/lib/utils/storage';

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Check if user data exists in cookies
    const accessToken = storage.getToken();
    const refreshToken = storage.getRefreshToken();
    const userData = storage.getUserData();

    if (accessToken && refreshToken && userData) {
      dispatch(
        loginSuccess({
          access_token: accessToken,
          refresh_token: refreshToken,
          user: userData,
        })
      );
    }
  }, [dispatch]);

  return null;
}
