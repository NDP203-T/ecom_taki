'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { removeFromCart, updateQuantity } from '@/lib/store/slices/cartSlice';
import styles from './cart.module.css';

export default function CartPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, total } = useAppSelector((state) => state.cart);

  useEffect(() => {
    // Sync cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const handleRemove = (id: string) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      dispatch(removeFromCart(id));
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className={styles.empty}>
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <h2>Giỏ hàng trống</h2>
              <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
              <Link href="/products" className={styles.shopButton}>
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <h1 className={styles.title}>Giỏ hàng của bạn</h1>
          
          <div className={styles.content}>
            <div className={styles.items}>
              {items.map((item) => (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemImage}>
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <div className={styles.noImage}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className={styles.itemDetails}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                    {item.variant && (
                      <div className={styles.itemVariant}>
                        {item.variant.color && <span>{item.variant.color}</span>}
                        {item.variant.size && <span>{item.variant.size}</span>}
                      </div>
                    )}
                    <p className={styles.itemSku}>SKU: {item.sku}</p>
                  </div>

                  <div className={styles.itemActions}>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className={styles.removeButton}
                      aria-label="Xóa"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>

                    <div className={styles.itemQuantity}>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className={styles.quantityButton}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                        </svg>
                      </button>
                      <span className={styles.quantity}>{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className={styles.quantityButton}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className={styles.itemPrice}>
                      {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.summary}>
              <h2 className={styles.summaryTitle}>Tổng đơn hàng</h2>
              
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

              <button onClick={handleCheckout} className={styles.checkoutButton}>
                Thanh toán
              </button>

              <Link href="/products" className={styles.continueButton}>
                Tiếp tục mua sắm
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
