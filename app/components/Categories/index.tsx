'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { categoriesAPI } from '@/lib/api/categories';
import styles from './Categories.module.css';

interface Category {
  id: string;
  name: string;
  slug: string;
  image_url?: string;
  is_active: boolean;
}

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesAPI.getAll();
      
      const categoriesArray = data.categories 
        ? Object.values(data.categories).map((category: unknown) => {
            const cat = category as Record<string, unknown>;
            return {
              ...cat,
              is_active: cat.is_active === 'True' || cat.is_active === true,
            };
          })
        : [];
      
      // Filter active categories and take first 8
      const activeCategories = (categoriesArray as Category[])
        .filter(c => c.is_active)
        .slice(0, 8);
      
      setCategories(activeCategories);
    } catch {
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>Danh mục</h2>
          <div className={styles.loading}>Đang tải danh mục...</div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Danh mục</h2>
        <div className={styles.grid}>
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className={styles.card}
            >
              {category.image_url ? (
                <div className={styles.imageWrapper}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={category.image_url} alt={category.name} className={styles.image} />
                </div>
              ) : (
                <div className={styles.icon}></div>
              )}
              <h3 className={styles.name}>{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
