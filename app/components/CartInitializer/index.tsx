'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/lib/store/hooks';
import { loadCartFromStorage } from '@/lib/store/slices/cartSlice';

export default function CartInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch(loadCartFromStorage(cartItems));
      } catch {
        // Invalid cart data, ignore
      }
    }
  }, [dispatch]);

  return null;
}
