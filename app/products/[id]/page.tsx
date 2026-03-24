'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ProductCard from '@/app/components/ProductCard';
import { productsAPI } from '@/lib/api/products';
import { useAppDispatch } from '@/lib/store/hooks';
import { addToCart } from '@/lib/store/slices/cartSlice';
import styles from './product-detail.module.css';

interface Variant {
  id: string;
  name: string;
  color: string;
  size: string;
  price: number;
  stock: number;
  sku: string;
  image_url?: string;
  is_active: boolean | string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  price: number;
  stock: number;
  image_url?: string;
  images?: string[];
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  variants?: Variant[];
}

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);

  useEffect(() => {
    if (productId) {
      loadProduct();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      
      // Load product detail
      const response = await productsAPI.getById(productId);
      const data = response.product || response;
      
      // Parse variants - handle both object and array formats
      let variantsArray: Variant[] = [];
      if (data.variants) {
        if (Array.isArray(data.variants)) {
          variantsArray = data.variants;
        } else if (typeof data.variants === 'object') {
          variantsArray = Object.values(data.variants);
        }
      }
      
      // Parse images - handle both object and array formats
      let imagesArray: string[] = [];
      if (data.images) {
        if (Array.isArray(data.images)) {
          imagesArray = data.images;
        } else if (typeof data.images === 'object') {
          const imageValues = Object.values(data.images);
          imagesArray = imageValues.map((img: unknown) => {
            if (typeof img === 'string') return img;
            if (img && typeof img === 'object' && 'image_url' in img) {
              return (img as { image_url: string }).image_url;
            }
            return '';
          }).filter(Boolean);
        }
      }
      
      const productData: Product = {
        id: String(data.id || ''),
        name: String(data.name || ''),
        sku: String(data.sku || ''),
        description: String(data.description || ''),
        price: Number(data.price) || 0,
        stock: Number(data.stock) || 0,
        image_url: data.image_url || '',
        images: imagesArray,
        category: String(data.category || ''),
        is_active: data.is_active === 'True' || data.is_active === true,
        created_at: String(data.created_at || ''),
        updated_at: String(data.updated_at || ''),
        variants: variantsArray.map((v: unknown) => {
          const variant = v as Record<string, unknown>;
          return {
            id: String(variant.id || ''),
            name: String(variant.name || ''),
            color: String(variant.color || ''),
            size: String(variant.size || ''),
            price: Number(variant.price) || 0,
            stock: Number(variant.stock) || 0,
            sku: String(variant.sku || ''),
            image_url: variant.image_url ? String(variant.image_url) : undefined,
            is_active: variant.is_active === 'True' || variant.is_active === true,
          };
        }),
      };
      
      setProduct(productData);
      
      // Set default variant if available
      if (productData.variants && productData.variants.length > 0) {
        setSelectedVariant(productData.variants[0]);
      }

      // Load related products
      const allProducts = await productsAPI.getAll();
      const productsData = allProducts.products || allProducts;
      
      let productsArray: Product[] = [];
      if (Array.isArray(productsData)) {
        productsArray = productsData;
      } else if (typeof productsData === 'object') {
        productsArray = Object.values(productsData);
      }
      
      const related = productsArray
        .map((p: unknown) => {
          const prod = p as Record<string, unknown>;
          return {
            id: String(prod.id || ''),
            name: String(prod.name || ''),
            sku: String(prod.sku || ''),
            description: String(prod.description || ''),
            price: Number(prod.price) || 0,
            stock: Number(prod.stock) || 0,
            image_url: prod.image_url ? String(prod.image_url) : '',
            category: String(prod.category || ''),
            is_active: prod.is_active === 'True' || prod.is_active === true,
            created_at: String(prod.created_at || ''),
            updated_at: String(prod.updated_at || ''),
          } as Product;
        })
        .filter(p => p.is_active && p.category === productData.category && p.id !== productId)
        .slice(0, 4);
      
      setRelatedProducts(related);
    } catch {
      router.push('/products');
    } finally {
      setLoading(false);
    }
  };

  // Get images based on selected variant or product
  const getImages = () => {
    // If variant is selected and has image, use it
    if (selectedVariant?.image_url && selectedVariant.image_url !== 'None') {
      return [selectedVariant.image_url];
    }
    
    // Otherwise use product images
    if (product?.images && product.images.length > 0) {
      return product.images;
    }
    
    // Fallback to product main image
    if (product?.image_url) {
      return [product.image_url];
    }
    
    return [];
  };

  const images = getImages();
  const currentPrice = selectedVariant ? selectedVariant.price : product?.price || 0;
  const currentStock = selectedVariant ? selectedVariant.stock : product?.stock || 0;
  const hasVariants = product?.variants && product.variants.length > 0;

  const handleAddToCart = () => {
    if (!product) return;

    const cartItem = {
      id: selectedVariant ? `${product.id}-${selectedVariant.id}` : product.id,
      productId: product.id,
      variantId: selectedVariant?.id,
      name: selectedVariant ? `${product.name} - ${selectedVariant.name}` : product.name,
      price: currentPrice,
      quantity,
      image: images.length > 0 ? images[0] : undefined,
      sku: selectedVariant ? selectedVariant.sku : product.sku,
      variant: selectedVariant ? {
        color: selectedVariant.color,
        size: selectedVariant.size,
      } : undefined,
    };

    dispatch(addToCart(cartItem));

    // Save to localStorage
    const savedCart = localStorage.getItem('cart');
    const cartItems = savedCart ? JSON.parse(savedCart) : [];
    const existingIndex = cartItems.findIndex((item: { id: string }) => item.id === cartItem.id);
    
    if (existingIndex >= 0) {
      cartItems[existingIndex].quantity += quantity;
    } else {
      cartItems.push(cartItem);
    }
    
    localStorage.setItem('cart', JSON.stringify(cartItems));

    // Show success message
    alert(`Đã thêm ${quantity} sản phẩm vào giỏ hàng!`);
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.loading}>Đang tải...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.productSection}>
            <div className={styles.gallery}>
              <div className={styles.mainImage}>
                {images.length > 0 ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={images[currentImageIndex]} alt={product.name} />
                ) : (
                  <div className={styles.noImage}>
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              
              {images.length > 1 && (
                <div className={styles.thumbnails}>
                  {images.map((img, index) => (
                    <button
                      key={index}
                      className={`${styles.thumbnail} ${index === currentImageIndex ? styles.activeThumbnail : ''}`}
                      onClick={() => setCurrentImageIndex(index)}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={img} alt={`${product.name} ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className={styles.details}>
              <div className={styles.category}>{product.category}</div>
              <h1 className={styles.title}>{product.name}</h1>
              <div className={styles.price}>
                {currentPrice.toLocaleString('vi-VN')}₫
              </div>
              
              {hasVariants && (
                <div className={styles.variants}>
                  <h3 className={styles.variantTitle}>Chọn phiên bản</h3>
                  <div className={styles.variantGrid}>
                    {product.variants!.map((variant) => (
                      <button
                        key={variant.id}
                        className={`${styles.variantButton} ${selectedVariant?.id === variant.id ? styles.activeVariant : ''}`}
                        onClick={() => {
                          setSelectedVariant(variant);
                          setQuantity(1);
                          setCurrentImageIndex(0); // Reset to first image when variant changes
                        }}
                      >
                        <div className={styles.variantInfo}>
                          <span className={styles.variantColor}>{variant.color}</span>
                          <span className={styles.variantSize}>{variant.size}</span>
                        </div>
                        <div className={styles.variantPrice}>
                          {variant.price.toLocaleString('vi-VN')}₫
                        </div>
                        {variant.stock <= 0 && (
                          <span className={styles.variantOutOfStock}>Hết hàng</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div className={styles.description}>
                <h3>Mô tả sản phẩm</h3>
                <p>{product.description}</p>
              </div>

              <div className={styles.info}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>SKU:</span>
                  <span className={styles.infoValue}>
                    {selectedVariant ? selectedVariant.sku : product.sku}
                  </span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Tình trạng:</span>
                  <span className={`${styles.infoValue} ${currentStock > 0 ? styles.inStock : styles.outOfStock}`}>
                    {currentStock > 0 ? `Còn ${currentStock} sản phẩm` : 'Hết hàng'}
                  </span>
                </div>
              </div>

              {currentStock > 0 && (
                <div className={styles.actions}>
                  <div className={styles.quantitySelector}>
                    <button
                      className={styles.quantityButton}
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      disabled={quantity <= 1}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className={styles.quantity}>{quantity}</span>
                    <button
                      className={styles.quantityButton}
                      onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
                      disabled={quantity >= currentStock}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  <button className={styles.addToCartButton} onClick={handleAddToCart}>
                    Thêm vào giỏ hàng
                  </button>
                </div>
              )}
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className={styles.relatedSection}>
              <h2 className={styles.relatedTitle}>Sản phẩm liên quan</h2>
              <div className={styles.relatedGrid}>
                {relatedProducts.map((p) => {
                  const imageUrl = p.image_url || (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '');
                  return (
                    <ProductCard 
                      key={p.id} 
                      id={p.id}
                      name={p.name}
                      price={`${p.price.toLocaleString('vi-VN')}₫`}
                      image={imageUrl}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
