'use client';

import { useEffect } from 'react';
import { storage } from '@/lib/utils/storage';
import { useAppSelector } from '@/lib/store/hooks';

export default function ActivityTracker() {
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) return;

    // Refresh cookie expiry khi user có hoạt động
    const handleActivity = () => {
      storage.refreshExpiry();
    };

    // Các sự kiện user activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    // Throttle để không refresh quá nhiều
    let lastRefresh = Date.now();
    const throttledRefresh = () => {
      const now = Date.now();
      // Chỉ refresh mỗi 5 phút
      if (now - lastRefresh > 5 * 60 * 1000) {
        handleActivity();
        lastRefresh = now;
      }
    };

    events.forEach((event) => {
      window.addEventListener(event, throttledRefresh);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, throttledRefresh);
      });
    };
  }, [user]);

  return null;
}
