import Link from 'next/link';
import styles from './Categories.module.css';

const categories = ['Điện tử', 'Thời trang', 'Gia dụng', 'Thể thao'];

export default function Categories() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Danh mục</h2>
        <div className={styles.grid}>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/categories/${category.toLowerCase()}`}
              className={styles.card}
            >
              <div className={styles.icon}></div>
              <h3 className={styles.name}>{category}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
