import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero() {
  return (
    <section className={styles.hero}>
      <div className={styles.container}>
        <h1 className={styles.title}>Ecom Taki</h1>
        <p className={styles.subtitle}>Trải nghiệm mua sắm hiện đại.</p>
        <div className={styles.actions}>
          <Link href="/products" className={styles.primaryButton}>
            Khám phá ngay
          </Link>
          <Link href="/deals" className={styles.secondaryButton}>
            Xem ưu đãi
          </Link>
        </div>
      </div>
    </section>
  );
}
