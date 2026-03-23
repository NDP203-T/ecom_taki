import ProductCard from '../ProductCard';
import styles from './FeaturedProducts.module.css';

const products = [
  {
    id: 1,
    name: 'Tai nghe Wireless Pro',
    price: '4.990.000₫',
    tag: 'Mới',
  },
  {
    id: 2,
    name: 'Đồng hồ thông minh X1',
    price: '8.990.000₫',
    tag: 'Hot',
  },
  {
    id: 3,
    name: 'Laptop Ultra Slim',
    price: '24.990.000₫',
    tag: 'Giảm giá',
  },
  {
    id: 4,
    name: 'Camera 4K Pro',
    price: '12.990.000₫',
    tag: 'Mới',
  },
];

export default function FeaturedProducts() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Sản phẩm nổi bật</h2>
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </section>
  );
}
