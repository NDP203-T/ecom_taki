'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { getCategoriesTreeRequest } from '@/lib/store/slices/categorySlice';
import styles from './categories.module.css';

export default function CategoriesPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { categoriesTree, loading } = useAppSelector((state) => state.category);

  useEffect(() => {
    dispatch(getCategoriesTreeRequest());
  }, [dispatch]);

  const handleCategoryClick = (categorySlug: string) => {
    router.push(`/products?category=${categorySlug}`);
  };

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>Khám phá theo danh mục.</h1>
          <p className={styles.heroSubtitle}>
            Tìm chính xác những gì bạn đang tìm kiếm.
          </p>
        </section>

        <section className={styles.categoriesSection}>
          {loading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
            </div>
          ) : categoriesTree.length === 0 ? (
            <div className={styles.empty}>
              <p>Chưa có danh mục nào.</p>
            </div>
          ) : (
            <div className={styles.grid}>
              {categoriesTree
                .filter(c => c.is_active)
                .map((category) => (
                  <div key={category.id} className={styles.categoryCard}>
                    <div 
                      className={styles.categoryMain}
                      onClick={() => handleCategoryClick(category.slug || category.name)}
                    >
                      <div className={styles.imageWrapper}>
                        {category.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={category.image_url} alt={category.name} className={styles.categoryImage} />
                        ) : (
                          <div className={styles.imagePlaceholder}>
                            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <circle cx="8.5" cy="8.5" r="1.5" />
                              <path d="M21 15l-5-5L5 21" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className={styles.categoryContent}>
                        <h2 className={styles.categoryName}>{category.name}</h2>
                        {category.description && (
                          <p className={styles.categoryDesc}>{category.description}</p>
                        )}
                        <div className={styles.shopLink}>
                          Mua ngay
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8.5 2.5l5 5-5 5M13 7.5H3" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      </div>
                    </div>

                    {category.children && category.children.length > 0 && (
                      <div className={styles.subCategories}>
                        {category.children
                          .filter(child => child.is_active)
                          .slice(0, 4)
                          .map((child) => (
                            <button
                              key={child.id}
                              onClick={() => handleCategoryClick(child.slug || child.name)}
                              className={styles.subCategoryLink}
                            >
                              {child.name}
                            </button>
                          ))}
                        {category.children.filter(c => c.is_active).length > 4 && (
                          <button
                            onClick={() => handleCategoryClick(category.slug || category.name)}
                            className={styles.subCategoryLink}
                          >
                            Xem tất cả
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
