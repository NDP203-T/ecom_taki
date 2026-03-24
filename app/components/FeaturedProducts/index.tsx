'use client';

import { useEffect, useState } from 'react';
import ProductCard from '../ProductCard';
import { productsAPI } from '@/lib/api/products';
import styles from './FeaturedProducts.module.css';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  images?: string[];
  is_active: boolean;
}

export default function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll();
      
      const productsArray = data.products 
        ? Object.values(data.products).map((product: unknown) => {
            const prod = product as Record<string, unknown>;
            return {
              ...prod,
              images: prod.images 
                ? Object.values(prod.images as Record<string, unknown>).map((img: unknown) => (img as Record<string, unknown>).image_url as string)
                : [],
              is_active: prod.is_active === 'True' || prod.is_active === true,
            };
          })
        : [];
      
      // Filter active products and take first 8
      const activeProducts = (productsArray as Product[])
        .filter(p => p.is_active)
        .slice(0, 8);
      
      setProducts(activeProducts);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>Sản phẩm nổi bật</h2>
          <div className={styles.loading}>Đang tải sản phẩm...</div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return (
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.title}>Sản phẩm nổi bật</h2>
          <div className={styles.empty}>Chưa có sản phẩm nào</div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Sản phẩm nổi bật</h2>
        <div className={styles.grid}>
          {products.map((product) => {
            const imageUrl = product.image_url || (Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : '');
            return (
              <ProductCard 
                key={product.id} 
                id={product.id}
                name={product.name}
                price={`${product.price.toLocaleString('vi-VN')}₫`}
                image={imageUrl}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
