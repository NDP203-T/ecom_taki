'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch } from '@/lib/store/hooks';
import { loginSuccess } from '@/lib/store/slices/authSlice';
import { storage } from '@/lib/utils/storage';

export default function AuthInitializer() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();

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

      // Nếu đang ở trang signin/signup và là admin, redirect về dashboard
      if (
        (pathname === '/auth/signin' || pathname === '/auth/signup') &&
        userData.role === 'admin'
      ) {
        router.push('/dashboard');
      }
      // Nếu đang ở trang signin/signup và là user thường, redirect về home
      else if (pathname === '/auth/signin' || pathname === '/auth/signup') {
        router.push('/');
      }
    }
  }, [dispatch, pathname, router]);

  return null;
}
