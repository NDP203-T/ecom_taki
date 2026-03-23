import Link from 'next/link';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  id: number;
  name: string;
  price: string;
  tag: string;
}

export default function ProductCard({ id, name, price, tag }: ProductCardProps) {
  return (
    <Link href={`/products/${id}`} className={styles.card}>
      <div className={styles.cardInner}>
        <div className={styles.imageContainer}>
          <span className={styles.tag}>{tag}</span>
        </div>
        <div className={styles.content}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.price}>{price}</p>
        </div>
      </div>
    </Link>
  );
}
