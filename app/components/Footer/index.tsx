import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.column}>
            <h3>Mua sắm</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/products" className={styles.link}>
                  Tất cả sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/deals" className={styles.link}>
                  Ưu đãi
                </Link>
              </li>
              <li>
                <Link href="/new" className={styles.link}>
                  Hàng mới
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3>Tài khoản</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/auth/signin" className={styles.link}>
                  Đăng nhập
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className={styles.link}>
                  Đăng ký
                </Link>
              </li>
              <li>
                <Link href="/orders" className={styles.link}>
                  Đơn hàng
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3>Hỗ trợ</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/support" className={styles.link}>
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className={styles.link}>
                  Vận chuyển
                </Link>
              </li>
              <li>
                <Link href="/returns" className={styles.link}>
                  Đổi trả
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.column}>
            <h3>Về chúng tôi</h3>
            <ul className={styles.linkList}>
              <li>
                <Link href="/about" className={styles.link}>
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/terms" className={styles.link}>
                  Điều khoản
                </Link>
              </li>
              <li>
                <Link href="/privacy" className={styles.link}>
                  Bảo mật
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.copyright}>
          <p>© 2026 Ecom Taki. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
