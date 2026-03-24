'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector } from '@/lib/store/hooks';
import styles from './dashboard.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAppSelector((state) => state.auth);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Give time for AuthInitializer to restore session
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isChecking) {
      if (!user) {
        router.push('/auth/signin');
      } else if (user.role !== 'admin') {
        router.push('/');
      }
    }
  }, [user, router, isChecking]);

  if (isChecking || !user || user.role !== 'admin') {
    return null;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className={styles.overlay} onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <aside
        className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}
      >
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
            <span>Taki Store</span>
          </div>
          <button className={styles.closeSidebar} onClick={closeSidebar}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <Link
            href="/dashboard"
            className={`${styles.navItem} ${isActive('/dashboard') ? styles.active : ''}`}
            onClick={closeSidebar}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <rect
                x="3"
                y="3"
                width="7"
                height="7"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect
                x="14"
                y="3"
                width="7"
                height="7"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect
                x="14"
                y="14"
                width="7"
                height="7"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <rect
                x="3"
                y="14"
                width="7"
                height="7"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
            <span>Overview</span>
          </Link>

          <Link
            href="/dashboard/products"
            className={`${styles.navItem} ${isActive('/dashboard/products') ? styles.active : ''}`}
            onClick={closeSidebar}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <span>Sản phẩm</span>
          </Link>

          <Link
            href="/dashboard/categories"
            className={`${styles.navItem} ${isActive('/dashboard/categories') ? styles.active : ''}`}
            onClick={closeSidebar}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span>Danh mục</span>
          </Link>

          <Link
            href="/dashboard/orders"
            className={`${styles.navItem} ${isActive('/dashboard/orders') ? styles.active : ''}`}
            onClick={closeSidebar}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <span>Đơn hàng</span>
          </Link>

          <Link
            href="/dashboard/customers"
            className={`${styles.navItem} ${isActive('/dashboard/customers') ? styles.active : ''}`}
            onClick={closeSidebar}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>Khách hàng</span>
          </Link>

          <Link
            href="/dashboard/reports"
            className={`${styles.navItem} ${isActive('/dashboard/reports') ? styles.active : ''}`}
            onClick={closeSidebar}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span>Báo cáo</span>
          </Link>

          <Link
            href="/dashboard/settings"
            className={`${styles.navItem} ${isActive('/dashboard/settings') ? styles.active : ''}`}
            onClick={closeSidebar}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>Cài đặt</span>
          </Link>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.homeButton}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Về trang chủ</span>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Top Bar */}
        <header className={styles.topBar}>
          <div className={styles.topBarLeft}>
            <button className={styles.menuToggle} onClick={toggleSidebar}>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className={styles.searchBar}>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input type="text" placeholder="Tìm kiếm..." />
            </div>
          </div>

          <div className={styles.topBarActions}>
            <button className={styles.iconButton} aria-label="Thông báo">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              <span className={styles.badge}>3</span>
            </button>

            <button className={styles.iconButton} aria-label="Trợ giúp">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>

            <div className={styles.userProfile}>
              <div className={styles.userAvatar}>
                {user.full_name.charAt(0).toUpperCase()}
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.full_name}</span>
                <span className={styles.userRole}>Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className={styles.contentWrapper}>{children}</div>
      </main>
    </div>
  );
}
