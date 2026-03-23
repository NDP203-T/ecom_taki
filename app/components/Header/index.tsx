'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './Header.module.css';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <Link href="/auth/signin" className={styles.loginLink}>
              Đăng nhập
            </Link>
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
            <Link href="/products" className={styles.mobileMenuLink}>
              Sản phẩm
            </Link>
            <Link href="/categories" className={styles.mobileMenuLink}>
              Danh mục
            </Link>
            <Link href="/deals" className={styles.mobileMenuLink}>
              Ưu đãi
            </Link>
            <Link href="/support" className={styles.mobileMenuLink}>
              Hỗ trợ
            </Link>
            <Link
              href="/auth/signin"
              className={`${styles.mobileMenuLink} ${styles.primary}`}
            >
              Đăng nhập
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}
