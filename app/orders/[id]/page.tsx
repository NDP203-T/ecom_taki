'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { getOrderByIdRequest, cancelOrderRequest } from '@/lib/store/slices/orderSlice';
import styles from './order-detail.module.css';

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { currentOrder, loading } = useAppSelector((state) => state.order);
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
      return;
    }
    if (params.id) {
      dispatch(getOrderByIdRequest(params.id as string));
    }
  }, [dispatch, params.id, user, router]);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
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
    switch (status?.toLowerCase()) {
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

  const handleCancelOrder = () => {
    if (currentOrder && window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
      dispatch(cancelOrderRequest(currentOrder.id));
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentOrder) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.empty}>
            <p>Không tìm thấy đơn hàng.</p>
            <button onClick={() => router.push('/orders')} className={styles.backButton}>
              Quay lại danh sách
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const canCancel = currentOrder.status?.toLowerCase() === 'pending';

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <button onClick={() => router.push('/orders')} className={styles.backLink}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path d="M12 4l-8 8 8 8" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Quay lại
          </button>

          <div className={styles.header}>
            <div>
              <h1 className={styles.title}>Đơn hàng #{currentOrder.order_number}</h1>
              <p className={styles.date}>{formatDate(currentOrder.created_at)}</p>
            </div>
            <div className={`${styles.status} ${getStatusColor(currentOrder.status)}`}>
              {getStatusText(currentOrder.status)}
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.mainContent}>
              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Sản phẩm</h2>
                <div className={styles.items}>
                  {currentOrder.items && currentOrder.items.length > 0 ? (
                    currentOrder.items.map((item, index) => (
                      <div key={index} className={styles.item}>
                        <div className={styles.itemMain}>
                          <div className={styles.itemDetails}>
                            <h3 className={styles.itemName}>{item.product_name}</h3>
                            {item.variant_name && (
                              <p className={styles.itemVariant}>{item.variant_name}</p>
                            )}
                            <p className={styles.itemSku}>SKU: {item.sku}</p>
                          </div>
                          <div className={styles.itemMeta}>
                            <div className={styles.itemQuantity}>
                              <span className={styles.quantityLabel}>Số lượng</span>
                              <span className={styles.quantityValue}>{item.quantity || 0}</span>
                            </div>
                            <div className={styles.itemPricing}>
                              <span className={styles.unitPrice}>
                                {(item.price || 0).toLocaleString('vi-VN')}₫
                              </span>
                              <span className={styles.itemTotal}>
                                {(item.subtotal || 0).toLocaleString('vi-VN')}₫
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className={styles.noItems}>Không có sản phẩm</p>
                  )}
                </div>
              </section>

              <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Thông tin giao hàng</h2>
                <div className={styles.infoGrid}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Người nhận:</span>
                    <span className={styles.infoValue}>{currentOrder.customer_name}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Số điện thoại:</span>
                    <span className={styles.infoValue}>{currentOrder.customer_phone}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Email:</span>
                    <span className={styles.infoValue}>{currentOrder.customer_email}</span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Địa chỉ:</span>
                    <span className={styles.infoValue}>
                      {currentOrder.shipping_address}, {currentOrder.shipping_ward}, {currentOrder.shipping_district}, {currentOrder.shipping_city}
                    </span>
                  </div>
                  {currentOrder.note && (
                    <div className={styles.infoItem}>
                      <span className={styles.infoLabel}>Ghi chú:</span>
                      <span className={styles.infoValue}>{currentOrder.note}</span>
                    </div>
                  )}
                </div>
              </section>
            </div>

            <aside className={styles.sidebar}>
              <div className={styles.summary}>
                <h2 className={styles.summaryTitle}>Tóm tắt đơn hàng</h2>
                
                <div className={styles.summaryRow}>
                  <span>Tạm tính:</span>
                  <span>{(currentOrder.subtotal || 0).toLocaleString('vi-VN')}₫</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>Phương thức thanh toán:</span>
                  <span>{currentOrder.payment_method === 'cod' ? 'COD' : 'Chuyển khoản'}</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>Trạng thái thanh toán:</span>
                  <span>{currentOrder.payment_status === 'pending' ? 'Chưa thanh toán' : 'Đã thanh toán'}</span>
                </div>

                <div className={styles.summaryRow}>
                  <span>Phí vận chuyển:</span>
                  <span>{(currentOrder.shipping_fee || 0).toLocaleString('vi-VN')}₫</span>
                </div>

                {currentOrder.discount > 0 && (
                  <div className={styles.summaryRow}>
                    <span>Giảm giá:</span>
                    <span>-{(currentOrder.discount || 0).toLocaleString('vi-VN')}₫</span>
                  </div>
                )}

                <div className={styles.summaryTotal}>
                  <span>Tổng cộng:</span>
                  <span className={styles.totalAmount}>
                    {(currentOrder.total || 0).toLocaleString('vi-VN')}₫
                  </span>
                </div>

                {canCancel && (
                  <button onClick={handleCancelOrder} className={styles.cancelButton}>
                    Hủy đơn hàng
                  </button>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
