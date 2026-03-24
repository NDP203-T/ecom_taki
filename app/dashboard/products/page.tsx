'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/store/hooks';
import { productsAPI, Product } from '@/lib/api/products';
import styles from './products.module.css';

export default function ProductsPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
    } else if (user.role !== 'admin') {
      router.push('/');
    } else {
      loadProducts();
    }
  }, [user, router]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productsAPI.getAll();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;

    try {
      await productsAPI.delete(productId);
      await loadProducts();
    } catch (error) {
      alert('Xóa sản phẩm thất bại');
    }
  };

  const handleToggleStatus = async (productId: string) => {
    try {
      await productsAPI.toggleStatus(productId);
      await loadProducts();
    } catch (error) {
      alert('Cập nhật trạng thái thất bại');
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Quản lý sản phẩm</h1>
          <p className={styles.subtitle}>
            Tổng số: {products.length} sản phẩm
          </p>
        </div>
        <button
          className={styles.addButton}
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Thêm sản phẩm
        </button>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Đang tải...</div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className={styles.tableContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Hình ảnh</th>
                  <th>Tên sản phẩm</th>
                  <th>Danh mục</th>
                  <th>Giá</th>
                  <th>Tồn kho</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>
                      <div className={styles.productImage}>
                        {product.image_url || (product.images && product.images.length > 0) ? (
                          <img src={product.image_url || product.images[0]} alt={product.name} />
                        ) : (
                          <div className={styles.noImage}>
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                            >
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
                    </td>
                    <td>
                      <div className={styles.productInfo}>
                        <span className={styles.productName}>{product.name}</span>
                        <span className={styles.productDesc}>
                          {product.description?.substring(0, 50)}...
                        </span>
                      </div>
                    </td>
                    <td>{product.category}</td>
                    <td className={styles.price}>
                      ${product.price.toLocaleString()}
                    </td>
                    <td>
                      <span
                        className={`${styles.stock} ${
                          product.stock < 10 ? styles.lowStock : ''
                        }`}
                      >
                        {product.stock}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`${styles.statusBadge} ${
                          product.is_active ? styles.active : styles.inactive
                        }`}
                        onClick={() => handleToggleStatus(product.id)}
                      >
                        {product.is_active ? 'Hiển thị' : 'Ẩn'}
                      </button>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionButton}
                          onClick={() => {
                            setEditingProduct(product);
                            setShowModal(true);
                          }}
                          title="Chỉnh sửa"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </button>
                        <button
                          className={`${styles.actionButton} ${styles.deleteButton}`}
                          onClick={() => handleDelete(product.id)}
                          title="Xóa"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredProducts.length === 0 && (
              <div className={styles.empty}>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <p>Không tìm thấy sản phẩm nào</p>
              </div>
            )}
          </div>

          {/* Mobile Card View */}
          <div className={styles.cardsContainer}>
            {filteredProducts.map((product) => (
              <div key={product.id} className={styles.productCard}>
                <div className={styles.cardImage}>
                  {product.image_url || (product.images && product.images.length > 0) ? (
                    <img src={product.image_url || product.images[0]} alt={product.name} />
                  ) : (
                    <div className={styles.noImage}>
                      <svg
                        width="32"
                        height="32"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
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
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.cardTitle}>{product.name}</h3>
                    <button
                      className={`${styles.statusBadge} ${
                        product.is_active ? styles.active : styles.inactive
                      }`}
                      onClick={() => handleToggleStatus(product.id)}
                    >
                      {product.is_active ? 'Hiển thị' : 'Ẩn'}
                    </button>
                  </div>
                  <p className={styles.cardDesc}>
                    {product.description?.substring(0, 80)}...
                  </p>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardCategory}>{product.category}</span>
                    <span className={styles.cardPrice}>
                      ${product.price.toLocaleString()}
                    </span>
                  </div>
                  <div className={styles.cardFooter}>
                    <span
                      className={`${styles.stock} ${
                        product.stock < 10 ? styles.lowStock : ''
                      }`}
                    >
                      Tồn: {product.stock}
                    </span>
                    <div className={styles.cardActions}>
                      <button
                        className={styles.actionButton}
                        onClick={() => {
                          setEditingProduct(product);
                          setShowModal(true);
                        }}
                        title="Chỉnh sửa"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => handleDelete(product.id)}
                        title="Xóa"
                      >
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <div className={styles.empty}>
                <svg
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
                <p>Không tìm thấy sản phẩm nào</p>
              </div>
            )}
          </div>
        </>
      )}

      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingProduct(null);
            loadProducts();
          }}
        />
      )}
    </div>
  );
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSuccess: () => void;
}

function ProductModal({ product, onClose, onSuccess }: ProductModalProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    sku: product?.sku || '',
    description: product?.description || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    image_url: product?.image_url || '',
    category: product?.category || '',
    is_active: product?.is_active ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (product) {
        await productsAPI.update(product.id, {
          name: formData.name,
          sku: formData.sku,
          description: formData.description,
          price: formData.price,
          image_url: formData.image_url,
          category: formData.category,
        });
      } else {
        await productsAPI.create(formData);
      }
      onSuccess();
    } catch (error) {
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{product ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label>Tên sản phẩm</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>SKU (Mã sản phẩm)</label>
            <input
              type="text"
              value={formData.sku}
              onChange={(e) =>
                setFormData({ ...formData, sku: e.target.value })
              }
              placeholder="IP15PRO-BLK"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              required
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Giá ($)</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Tồn kho</label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) =>
                  setFormData({ ...formData, stock: Number(e.target.value) })
                }
                min="0"
                required
                disabled={!!product}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Danh mục</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              placeholder="Electronics"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label>URL hình ảnh</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) =>
                setFormData({ ...formData, image_url: e.target.value })
              }
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          {!product && (
            <div className={styles.formGroup}>
              <label className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) =>
                    setFormData({ ...formData, is_active: e.target.checked })
                  }
                />
                <span>Hiển thị sản phẩm</span>
              </label>
            </div>
          )}

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={onClose}
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : product ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
