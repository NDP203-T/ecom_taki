'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { clearCart } from '@/lib/store/slices/cartSlice';
import { createOrderRequest, resetCreateSuccess } from '@/lib/store/slices/orderSlice';
import styles from './checkout.module.css';

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);
  const { user } = useAppSelector((state) => state.auth);
  const { loading, error, createSuccess } = useAppSelector((state) => state.order);

  const [formData, setFormData] = useState({
    fullName: user?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    note: '',
    paymentMethod: 'cod',
  });

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart');
    }
  }, [items.length, router]);

  // Handle order success
  useEffect(() => {
    if (createSuccess) {
      // Clear cart
      dispatch(clearCart());
      localStorage.removeItem('cart');
      
      // Reset success flag
      dispatch(resetCreateSuccess());
      
      // Show success message and redirect
      alert('Đặt hàng thành công!');
      router.push('/orders');
    }
  }, [createSuccess, dispatch, router]);

  // Handle error
  useEffect(() => {
    if (error) {
      alert(error);
    }
  }, [error]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      alert('Vui lòng đăng nhập để đặt hàng');
      router.push('/auth/signin');
      return;
    }

    const orderData = {
      items: items.map(item => ({
        product_id: item.productId,
        variant_id: item.variantId || undefined,
        quantity: item.quantity,
      })),
      customer_name: formData.fullName,
      customer_phone: formData.phone,
      customer_email: formData.email,
      shipping_address: formData.address,
      shipping_city: formData.city,
      shipping_district: formData.district,
      shipping_ward: formData.ward,
      payment_method: formData.paymentMethod,
      shipping_fee: 0,
      discount: 0,
      note: formData.note || undefined,
    };

    dispatch(createOrderRequest(orderData));
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Thanh toán</h1>

          <form onSubmit={handleSubmit} className={styles.content}>
            <div className={styles.formSection}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Thông tin giao hàng</h2>
                
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label className={styles.label}>Họ và tên</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Số điện thoại</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Địa chỉ</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Tỉnh/Thành phố</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Quận/Huyện</label>
                    <input
                      type="text"
                      name="district"
                      value={formData.district}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label className={styles.label}>Phường/Xã</label>
                    <input
                      type="text"
                      name="ward"
                      value={formData.ward}
                      onChange={handleChange}
                      className={styles.input}
                      required
                    />
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label className={styles.label}>Ghi chú (tùy chọn)</label>
                    <textarea
                      name="note"
                      value={formData.note}
                      onChange={handleChange}
                      className={styles.textarea}
                      rows={3}
                      placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"
                    />
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Phương thức thanh toán</h2>
                
                <div className={styles.paymentMethods}>
                  <label className={styles.paymentMethod}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === 'cod'}
                      onChange={handleChange}
                    />
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentName}>Thanh toán khi nhận hàng (COD)</span>
                      <span className={styles.paymentDesc}>Thanh toán bằng tiền mặt khi nhận hàng</span>
                    </div>
                  </label>

                  <label className={styles.paymentMethod}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="bank"
                      checked={formData.paymentMethod === 'bank'}
                      onChange={handleChange}
                    />
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentName}>Chuyển khoản ngân hàng</span>
                      <span className={styles.paymentDesc}>Chuyển khoản qua ngân hàng</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className={styles.summary}>
              <h2 className={styles.summaryTitle}>Đơn hàng của bạn</h2>

              <div className={styles.orderItems}>
                {items.map((item) => (
                  <div key={item.id} className={styles.orderItem}>
                    <div className={styles.orderItemInfo}>
                      <span className={styles.orderItemName}>
                        {item.name} × {item.quantity}
                      </span>
                      {item.variant && (
                        <span className={styles.orderItemVariant}>
                          {item.variant.color} {item.variant.size}
                        </span>
                      )}
                    </div>
                    <span className={styles.orderItemPrice}>
                      {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.summaryDivider}></div>

              <div className={styles.summaryRow}>
                <span>Tạm tính</span>
                <span>{total.toLocaleString('vi-VN')}₫</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Phí vận chuyển</span>
                <span>Miễn phí</span>
              </div>

              <div className={styles.summaryDivider}></div>

              <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                <span>Tổng cộng</span>
                <span>{total.toLocaleString('vi-VN')}₫</span>
              </div>

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? 'Đang xử lý...' : 'Đặt hàng'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
