'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { getMyOrdersRequest } from '@/lib/store/slices/orderSlice';
import styles from './orders.module.css';

export default function OrdersPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { orders = [], loading } = useAppSelector((state) => state.order);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    dispatch(getMyOrdersRequest());
  }, [dispatch, user, router]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return styles.statusPending;
      case 'confirmed':
        return styles.statusConfirmed;
      case 'shipping':
        return styles.statusShipping;
      case 'delivered':
        return styles.statusDelivered;
      case 'cancelled':
        return styles.statusCancelled;
      default:
        return '';
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'Chờ xác nhận';
      case 'confirmed':
        return 'Đã xác nhận';
      case 'shipping':
        return 'Đang giao';
      case 'delivered':
        return 'Đã giao';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) {
    return null;
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Đơn hàng của bạn.</h1>
          <p className={styles.heroSubtitle}>
            Theo dõi và quản lý đơn hàng của bạn.
          </p>
        </section>

        <section className={styles.ordersSection}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
            </div>
          ) : orders.length === 0 ? (
            <div className={styles.empty}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" />
              </svg>
              <p>Bạn chưa có đơn hàng nào.</p>
              <button onClick={() => router.push('/products')} className={styles.shopButton}>
                Mua sắm ngay
              </button>
            </div>
          ) : (
            <div className={styles.ordersList}>
              {orders.map((order) => (
                <div key={order.id} className={styles.orderCard}>
                  <div className={styles.orderHeader}>
                    <div className={styles.orderInfo}>
                      <h3 className={styles.orderNumber}>#{order.order_number}</h3>
                      <p className={styles.orderDate}>{formatDate(order.created_at)}</p>
                    </div>
                    <div className={`${styles.orderStatus} ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </div>
                  </div>

                  <div className={styles.orderBody}>
                    <div className={styles.orderItems}>
                      {order.items && order.items.length > 0 && order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className={styles.orderItem}>
                          <div className={styles.itemDetails}>
                            <p className={styles.itemName}>{item.product_name}</p>
                            {item.variant_name && (
                              <p className={styles.itemVariant}>{item.variant_name}</p>
                            )}
                          </div>
                          <div className={styles.itemRight}>
                            <span className={styles.itemQuantity}>x{item.quantity}</span>
                            <span className={styles.itemPrice}>
                              {(item.subtotal || 0).toLocaleString('vi-VN')}₫
                            </span>
                          </div>
                        </div>
                      ))}
                      {order.items && order.items.length > 3 && (
                        <p className={styles.moreItems}>
                          +{order.items.length - 3} sản phẩm khác
                        </p>
                      )}
                    </div>

                    <div className={styles.orderMeta}>
                      <div className={styles.metaItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                        </svg>
                        <span>{order.customer_name}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                        </svg>
                        <span>{order.customer_phone}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                        <span>{order.shipping_city}</span>
                      </div>
                      <div className={styles.metaItem}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                          <line x1="1" y1="10" x2="23" y2="10" />
                        </svg>
                        <span>{order.payment_method === 'cod' ? 'COD' : 'Chuyển khoản'}</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.orderFooter}>
                    <div className={styles.orderTotal}>
                      <span>Tổng cộng:</span>
                      <span className={styles.totalAmount}>
                        {(order.total || 0).toLocaleString('vi-VN')}₫
                      </span>
                    </div>
                    <button
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className={styles.detailButton}
                    >
                      Chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
