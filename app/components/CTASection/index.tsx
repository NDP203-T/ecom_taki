import Link from 'next/link';
import styles from './CTASection.module.css';

export default function CTASection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Bắt đầu mua sắm ngay hôm nay</h2>
        <p className={styles.subtitle}>Đăng ký để nhận ưu đãi độc quyền</p>
        <Link href="/auth/signup" className={styles.button}>
          Tạo tài khoản miễn phí
        </Link>
      </div>
    </section>
  );
}
