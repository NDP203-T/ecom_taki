'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { resetAuthState } from '@/lib/store/slices/authSlice';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/utils/storage';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    };

    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleLogout = async () => {
    try {
      // Reset Redux state
      dispatch(resetAuthState());
      
      // Clear all cookies
      storage.clearAll();
      
      // Đóng menu
      setIsUserMenuOpen(false);
      setIsMenuOpen(false);
      
      // Redirect về trang chủ
      router.push('/');
      
      // Force reload để clear state hoàn toàn
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
    } catch {
      // Silent error handling
    }
  };

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>
            Ecom Taki
          </Link>

          <div className={styles.menu}>
            <Link href="/products" className={styles.menuLink}>
              Sản phẩm
            </Link>
            <Link href="/categories" className={styles.menuLink}>
              Danh mục
            </Link>
            <Link href="/deals" className={styles.menuLink}>
              Ưu đãi
            </Link>
            <Link href="/support" className={styles.menuLink}>
              Hỗ trợ
            </Link>
          </div>

          <div className={styles.actions}>
            <button className={styles.iconButton} aria-label="Tìm kiếm">
              <svg
                className={styles.icon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button className={styles.iconButton} aria-label="Giỏ hàng">
              <svg
                className={styles.icon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
            </button>

            {user ? (
              <div className={styles.userMenu} ref={dropdownRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={styles.userButton}
                  aria-label="User menu"
                >
                  <div className={styles.avatar}>
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <span className={styles.userName}>{user.full_name}</span>
                </button>

                {isUserMenuOpen && (
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <p className={styles.dropdownName}>{user.full_name}</p>
                      <p className={styles.dropdownEmail}>{user.email}</p>
                    </div>
                    <div className={styles.dropdownDivider}></div>
                    {user.role === 'admin' && (
                      <Link
                        href="/dashboard"
                        className={styles.dropdownItem}
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Dashboard
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className={styles.dropdownItem}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Tài khoản
                    </Link>
                    <Link
                      href="/orders"
                      className={styles.dropdownItem}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Đơn hàng
                    </Link>
                    <Link
                      href="/settings"
                      className={styles.dropdownItem}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Cài đặt
                    </Link>
                    <div className={styles.dropdownDivider}></div>
                    <button
                      onClick={handleLogout}
                      className={`${styles.dropdownItem} ${styles.logoutItem}`}
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/auth/signin" className={styles.loginLink}>
                Đăng nhập
              </Link>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={styles.mobileMenuButton}
              aria-label="Menu"
            >
              <svg
                className={styles.icon}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className={styles.mobileMenu}>
            <Link
              href="/products"
              className={styles.mobileMenuLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Sản phẩm
            </Link>
            <Link
              href="/categories"
              className={styles.mobileMenuLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Danh mục
            </Link>
            <Link
              href="/deals"
              className={styles.mobileMenuLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Ưu đãi
            </Link>
            <Link
              href="/support"
              className={styles.mobileMenuLink}
              onClick={() => setIsMenuOpen(false)}
            >
              Hỗ trợ
            </Link>
            {user ? (
              <>
                <div className={styles.mobileMenuDivider}></div>
                <Link
                  href="/profile"
                  className={styles.mobileMenuLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Tài khoản
                </Link>
                <Link
                  href="/orders"
                  className={styles.mobileMenuLink}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Đơn hàng
                </Link>
                <button
                  onClick={handleLogout}
                  className={`${styles.mobileMenuLink} ${styles.logoutButton}`}
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <Link
                href="/auth/signin"
                className={`${styles.mobileMenuLink} ${styles.primary}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Đăng nhập
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
