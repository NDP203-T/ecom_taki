import Link from 'next/link';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  id: string;
  name: string;
  price: string;
  image?: string;
  tag?: string;
}

export default function ProductCard({ id, name, price, image, tag }: ProductCardProps) {
  return (
    <Link href={`/products/${id}`} className={styles.card}>
      <div className={styles.cardInner}>
        <div className={styles.imageContainer}>
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={name} className={styles.productImage} />
          ) : (
            <div className={styles.noImage}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
          {tag && <span className={styles.tag}>{tag}</span>}
        </div>
        <div className={styles.content}>
          <h3 className={styles.name}>{name}</h3>
          <p className={styles.price}>{price}</p>
        </div>
      </div>
    </Link>
  );
}
