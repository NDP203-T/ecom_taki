'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks';
import { loginSuccess } from '@/lib/store/slices/authSlice';
import { storage } from '@/lib/utils/storage';

export default function AuthInitializer() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only restore session once
    if (!user && !hasInitialized.current) {
      hasInitialized.current = true;
      
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

        // Only redirect if on auth pages
        if (pathname === '/auth/signin' || pathname === '/auth/signup') {
          if (userData.role === 'admin') {
            router.push('/dashboard');
          } else {
            router.push('/');
          }
        }
      }
    }
  }, [dispatch, pathname, router, user]);

  return null;
}
