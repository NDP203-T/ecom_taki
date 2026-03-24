'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '@/lib/api/products';
import { categoriesAPI } from '@/lib/api/categories';
import styles from './products.module.css';

interface Product {
  id: string;
  name: string;
  price: number;
  image_url?: string;
  images?: string[];
  category: string;
  is_active: boolean;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  children?: Category[];
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  const loadData = async () => {
    try {
      setLoading(true);
      
      // Load products
      const productsData = await productsAPI.getAll();
      const productsArray = productsData.products 
        ? Object.values(productsData.products).map((product: unknown) => {
            const prod = product as Record<string, unknown>;
            return {
              ...prod,
              images: prod.images 
                ? Object.values(prod.images as Record<string, unknown>).map((img: unknown) => (img as Record<string, unknown>).image_url as string)
                : [],
              is_active: prod.is_active === 'True' || prod.is_active === true,
              category: String(prod.category || ''),
            };
          })
        : [];
      
      setProducts(productsArray as Product[]);

      // Load categories tree
      const categoriesData = await categoriesAPI.getTree();
      const categoriesArray = categoriesData.categories 
        ? Object.values(categoriesData.categories).map((category: unknown) => {
            const cat = category as Record<string, unknown>;
            return {
              ...cat,
              is_active: cat.is_active === 'True' || cat.is_active === true,
              children: cat.children 
                ? Object.values(cat.children as Record<string, unknown>).map((child: unknown) => {
                    const c = child as Record<string, unknown>;
                    return {
                      ...c,
                      is_active: c.is_active === 'True' || c.is_active === true,
                    };
                  })
                : [],
            };
          })
        : [];
      
      setCategories(categoriesArray as Category[]);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to count products by category
  const getProductCount = (categoryIdentifier: string) => {
    return products.filter(p => 
      p.is_active && (
        p.category === categoryIdentifier || 
        p.category === categoryIdentifier.toLowerCase() ||
        p.category.toLowerCase() === categoryIdentifier.toLowerCase()
      )
    ).length;
  };

  // Helper function to count products including children categories
  const getProductCountWithChildren = (category: Category) => {
    let count = getProductCount(category.slug || category.name);
    
    // Add products from children categories
    if (category.children && category.children.length > 0) {
      category.children.forEach(child => {
        if (child.is_active) {
          count += getProductCount(child.slug || child.name);
        }
      });
    }
    
    return count;
  };

  // Helper function to check if product belongs to category or its children
  const isProductInCategory = (product: Product, categoryIdentifier: string) => {
    // Direct match
    if (product.category === categoryIdentifier || 
        product.category.toLowerCase() === categoryIdentifier.toLowerCase()) {
      return true;
    }
    
    // Check if product belongs to any child category
    const category = categories.find(c => 
      c.slug === categoryIdentifier || 
      c.name === categoryIdentifier ||
      c.slug?.toLowerCase() === categoryIdentifier.toLowerCase() ||
      c.name.toLowerCase() === categoryIdentifier.toLowerCase()
    );
    
    if (category && category.children && category.children.length > 0) {
      return category.children.some(child => 
        product.category === child.slug ||
        product.category === child.name ||
        product.category.toLowerCase() === child.slug?.toLowerCase() ||
        product.category.toLowerCase() === child.name.toLowerCase()
      );
    }
    
    return false;
  };

  const filteredProducts = products
    .filter(p => p.is_active)
    .filter(p => {
      if (selectedCategory === 'all') return true;
      return isProductInCategory(p, selectedCategory);
    })
    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>Tất cả sản phẩm</h1>
            <p className={styles.heroSubtitle}>
              Khám phá bộ sưu tập sản phẩm của chúng tôi
            </p>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.sidebar}>
            <div className={styles.filterSection}>
              <h3 className={styles.filterTitle}>Danh mục</h3>
              <div className={styles.filterList}>
                <button
                  className={`${styles.filterItem} ${selectedCategory === 'all' ? styles.active : ''}`}
                  onClick={() => setSelectedCategory('all')}
                >
                  Tất cả
                  <span className={styles.count}>({products.filter(p => p.is_active).length})</span>
                </button>
                {categories
                  .filter(c => c.is_active)
                  .map((category) => {
                    const parentCount = getProductCountWithChildren(category);
                    const hasChildren = category.children && category.children.length > 0;
                    
                    return (
                      <div key={category.id}>
                        <button
                          className={`${styles.filterItem} ${selectedCategory === category.slug || selectedCategory === category.name ? styles.active : ''}`}
                          onClick={() => setSelectedCategory(category.slug || category.name)}
                        >
                          {category.name}
                          <span className={styles.count}>({parentCount})</span>
                        </button>
                        
                        {hasChildren && (
                          <div className={styles.subCategories}>
                            {category.children!
                              .filter(child => child.is_active)
                              .map((child) => {
                                const childCount = getProductCount(child.slug || child.name);
                                return (
                                  <button
                                    key={child.id}
                                    className={`${styles.filterItem} ${styles.subItem} ${selectedCategory === child.slug || selectedCategory === child.name ? styles.active : ''}`}
                                    onClick={() => setSelectedCategory(child.slug || child.name)}
                                  >
                                    {child.name}
                                    <span className={styles.count}>({childCount})</span>
                                  </button>
                                );
                              })}
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.toolbar}>
              <div className={styles.searchBox}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className={styles.sortBox}>
                <label>Sắp xếp:</label>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <option value="newest">Mới nhất</option>
                  <option value="name">Tên A-Z</option>
                  <option value="price-asc">Giá thấp đến cao</option>
                  <option value="price-desc">Giá cao đến thấp</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className={styles.loading}>Đang tải sản phẩm...</div>
            ) : filteredProducts.length === 0 ? (
              <div className={styles.empty}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <p>Không tìm thấy sản phẩm nào</p>
              </div>
            ) : (
              <>
                <div className={styles.resultCount}>
                  Hiển thị {filteredProducts.length} sản phẩm
                </div>
                <div className={styles.grid}>
                  {filteredProducts.map((product) => {
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
              </>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div>Đang tải...</div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  );
}