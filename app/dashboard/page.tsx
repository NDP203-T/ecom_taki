'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector } from '@/lib/store/hooks';
import styles from './dashboard.module.css';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [activeMenu, setActiveMenu] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    // Kiểm tra quyền truy cập
    if (!user) {
      router.push('/auth/signin');
    } else if (user.role !== 'admin') {
      router.push('/');
    }
  }, [user, router]);

  if (!user || user.role !== 'admin') {
    return null;
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div className={styles.overlay} onClick={closeSidebar}></div>
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z" />
            </svg>
            <span>Taki Store</span>
          </div>
          <button className={styles.closeSidebar} onClick={closeSidebar}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <button
            className={`${styles.navItem} ${activeMenu === 'overview' ? styles.active : ''}`}
            onClick={() => {
              setActiveMenu('overview');
              closeSidebar();
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="3" width="7" height="7" strokeWidth="2" strokeLinecap="round" />
              <rect x="14" y="3" width="7" height="7" strokeWidth="2" strokeLinecap="round" />
              <rect x="14" y="14" width="7" height="7" strokeWidth="2" strokeLinecap="round" />
              <rect x="3" y="14" width="7" height="7" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span>Overview</span>
          </button>

          <button
            className={`${styles.navItem} ${activeMenu === 'products' ? styles.active : ''}`}
            onClick={() => {
              setActiveMenu('products');
              closeSidebar();
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Sản phẩm</span>
          </button>

          <button
            className={`${styles.navItem} ${activeMenu === 'orders' ? styles.active : ''}`}
            onClick={() => {
              setActiveMenu('orders');
              closeSidebar();
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span>Đơn hàng</span>
          </button>

          <button
            className={`${styles.navItem} ${activeMenu === 'customers' ? styles.active : ''}`}
            onClick={() => {
              setActiveMenu('customers');
              closeSidebar();
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Khách hàng</span>
          </button>

          <button
            className={`${styles.navItem} ${activeMenu === 'reports' ? styles.active : ''}`}
            onClick={() => {
              setActiveMenu('reports');
              closeSidebar();
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Báo cáo</span>
          </button>

          <button
            className={`${styles.navItem} ${activeMenu === 'settings' ? styles.active : ''}`}
            onClick={() => {
              setActiveMenu('settings');
              closeSidebar();
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Cài đặt</span>
          </button>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.homeButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
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
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <div className={styles.searchBar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input type="text" placeholder="Tìm kiếm..." />
            </div>
          </div>

          <div className={styles.topBarActions}>
            <button className={styles.iconButton} aria-label="Thông báo">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className={styles.badge}>3</span>
            </button>

            <button className={styles.iconButton} aria-label="Trợ giúp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
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
        <div className={styles.contentArea}>
          <div className={styles.pageHeader}>
            <div>
              <h1 className={styles.pageTitle}>Hi {user.full_name}</h1>
              <p className={styles.pageSubtitle}>Chào mừng trở lại Taki Store dashboard</p>
            </div>
            <div className={styles.headerActions}>
              <button className={styles.secondaryButton}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className={styles.buttonText}>Download</span>
              </button>
              <button className={styles.primaryButton}>
                <span className={styles.buttonIcon}>+</span>
                <span className={styles.buttonText}>Thêm mới</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <div className={styles.statIcon} style={{ background: '#E8EAFF' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6366F1">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <button className={styles.menuButton}>⋯</button>
              </div>
              <div className={styles.statValue}>$22,880.50</div>
              <div className={styles.statLabel}>Doanh thu từ 18 đơn</div>
              <div className={styles.statProgress}>
                <div className={styles.progressBar} style={{ width: '67%', background: '#6366F1' }}></div>
              </div>
              <div className={styles.statPercentage}>67%</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <div className={styles.statIcon} style={{ background: '#FFE8E8' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <button className={styles.menuButton}>⋯</button>
              </div>
              <div className={styles.statValue}>$1,096.30</div>
              <div className={styles.statLabel}>Thu nhập trung bình</div>
              <div className={styles.statProgress}>
                <div className={styles.progressBar} style={{ width: '18%', background: '#EF4444' }}></div>
              </div>
              <div className={styles.statPercentage}>18%</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <div className={styles.statIcon} style={{ background: '#E0F7FA' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#06B6D4">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <button className={styles.menuButton}>⋯</button>
              </div>
              <div className={styles.statValue}>33.98%</div>
              <div className={styles.statLabel}>Tỷ lệ chuyển đổi</div>
              <div className={styles.statProgress}>
                <div className={styles.progressBar} style={{ width: '78%', background: '#06B6D4' }}></div>
              </div>
              <div className={styles.statPercentage}>78%</div>
            </div>

            <div className={styles.statCard}>
              <div className={styles.statHeader}>
                <div className={styles.statIcon} style={{ background: '#FFF4E6' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#F59E0B">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <button className={styles.menuButton}>⋯</button>
              </div>
              <div className={styles.statValue}>778</div>
              <div className={styles.statLabel}>Chiến dịch đã gửi</div>
              <div className={styles.statProgress}>
                <div className={styles.progressBar} style={{ width: '80%', background: '#F59E0B' }}></div>
              </div>
              <div className={styles.statPercentage}>80%</div>
            </div>
          </div>

          {/* Charts Grid */}
          <div className={styles.chartsGrid}>
            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <div>
                  <h3 className={styles.chartTitle}>Doanh thu</h3>
                  <p className={styles.chartSubtitle}>Từ 262 đơn hàng</p>
                </div>
                <button className={styles.menuButton}>⋯</button>
              </div>
              <div className={styles.chartValue}>$165,750.23</div>
              <div className={styles.chartPlaceholder}>
                <svg width="100%" height="200" viewBox="0 0 400 200" preserveAspectRatio="none">
                  <path d="M 0 150 Q 50 120, 100 130 T 200 100 T 300 80 T 400 90" fill="none" stroke="#6366F1" strokeWidth="2" />
                  <path d="M 0 150 Q 50 120, 100 130 T 200 100 T 300 80 T 400 90 L 400 200 L 0 200 Z" fill="url(#gradient)" opacity="0.2" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#6366F1" />
                      <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            <div className={styles.chartCard}>
              <div className={styles.chartHeader}>
                <div>
                  <h3 className={styles.chartTitle}>Đơn hàng gần đây</h3>
                  <p className={styles.chartSubtitle}>Tháng này</p>
                </div>
                <button className={styles.menuButton}>⋯</button>
              </div>
              <div className={styles.ordersList}>
                <div className={styles.orderItem}>
                  <div className={styles.orderInfo}>
                    <span className={styles.orderId}>#12345</span>
                    <span className={styles.orderCustomer}>Nguyễn Văn A</span>
                  </div>
                  <span className={styles.orderAmount}>$250.00</span>
                  <span className={styles.orderStatus} data-status="completed">Hoàn thành</span>
                </div>
                <div className={styles.orderItem}>
                  <div className={styles.orderInfo}>
                    <span className={styles.orderId}>#12344</span>
                    <span className={styles.orderCustomer}>Trần Thị B</span>
                  </div>
                  <span className={styles.orderAmount}>$180.50</span>
                  <span className={styles.orderStatus} data-status="pending">Đang xử lý</span>
                </div>
                <div className={styles.orderItem}>
                  <div className={styles.orderInfo}>
                    <span className={styles.orderId}>#12343</span>
                    <span className={styles.orderCustomer}>Lê Văn C</span>
                  </div>
                  <span className={styles.orderAmount}>$320.00</span>
                  <span className={styles.orderStatus} data-status="completed">Hoàn thành</span>
                </div>
                <div className={styles.orderItem}>
                  <div className={styles.orderInfo}>
                    <span className={styles.orderId}>#12342</span>
                    <span className={styles.orderCustomer}>Phạm Thị D</span>
                  </div>
                  <span className={styles.orderAmount}>$95.00</span>
                  <span className={styles.orderStatus} data-status="shipping">Đang giao</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
