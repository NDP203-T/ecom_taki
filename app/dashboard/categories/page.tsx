'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector } from '@/lib/store/hooks';
import { categoriesAPI, Category } from '@/lib/api/categories';
import styles from './categories.module.css';

export default function CategoriesPage() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/auth/signin');
    } else if (user.role !== 'admin') {
      router.push('/');
    } else {
      loadCategories();
    }
  }, [user, router]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesAPI.getAll();
      
      // Convert categories object to array
      const categoriesArray = data.categories 
        ? Object.values(data.categories).map((category: unknown) => {
            const cat = category as Record<string, unknown>;
            return {
              ...cat,
              description: String(cat.description || ''),
              is_active: cat.is_active === 'True' || cat.is_active === true,
            };
          })
        : [];
      
      setCategories(categoriesArray as Category[]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục này?')) return;

    try {
      await categoriesAPI.delete(categoryId);
      await loadCategories();
    } catch {
      alert('Xóa danh mục thất bại');
    }
  };

  const handleToggleStatus = async (categoryId: string) => {
    try {
      await categoriesAPI.toggleStatus(categoryId);
      await loadCategories();
    } catch {
      alert('Cập nhật trạng thái thất bại');
    }
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Quản lý danh mục</h1>
          <p className={styles.subtitle}>
            Tổng số: {categories.length} danh mục
          </p>
        </div>
        <button
          className={styles.addButton}
          onClick={() => {
            setEditingCategory(null);
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
          Thêm danh mục
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
            placeholder="Tìm kiếm danh mục..."
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
                  <th>Tên danh mục</th>
                  <th>Slug</th>
                  <th>Mô tả</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.map((category) => (
                  <tr key={category.id}>
                    <td>
                      <span className={styles.categoryName}>{category.name}</span>
                    </td>
                    <td>
                      <span className={styles.slug}>{category.slug}</span>
                    </td>
                    <td>
                      <span className={styles.description}>
                        {typeof category.description === 'string' 
                          ? category.description.substring(0, 60) + (category.description.length > 60 ? '...' : '')
                          : ''}
                      </span>
                    </td>
                    <td>
                      <button
                        className={`${styles.statusBadge} ${
                          category.is_active ? styles.active : styles.inactive
                        }`}
                        onClick={() => handleToggleStatus(category.id)}
                      >
                        {category.is_active ? 'Hiển thị' : 'Ẩn'}
                      </button>
                    </td>
                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.actionButton}
                          onClick={() => {
                            setEditingCategory(category);
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
                          onClick={() => handleDelete(category.id)}
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

            {filteredCategories.length === 0 && (
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <p>Không tìm thấy danh mục nào</p>
              </div>
            )}
          </div>

          {/* Mobile Card View */}
          <div className={styles.cardsContainer}>
            {filteredCategories.map((category) => (
              <div key={category.id} className={styles.categoryCard}>
                <div className={styles.cardHeader}>
                  <h3 className={styles.cardTitle}>{category.name}</h3>
                  <button
                    className={`${styles.statusBadge} ${
                      category.is_active ? styles.active : styles.inactive
                    }`}
                    onClick={() => handleToggleStatus(category.id)}
                  >
                    {category.is_active ? 'Hiển thị' : 'Ẩn'}
                  </button>
                </div>
                <p className={styles.cardSlug}>{category.slug}</p>
                <p className={styles.cardDesc}>
                  {typeof category.description === 'string'
                    ? category.description.substring(0, 80) + (category.description.length > 80 ? '...' : '')
                    : ''}
                </p>
                <div className={styles.cardFooter}>
                  <div className={styles.cardActions}>
                    <button
                      className={styles.actionButton}
                      onClick={() => {
                        setEditingCategory(category);
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
                      onClick={() => handleDelete(category.id)}
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
            ))}

            {filteredCategories.length === 0 && (
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
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                <p>Không tìm thấy danh mục nào</p>
              </div>
            )}
          </div>
        </>
      )}

      {showModal && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setShowModal(false);
            setEditingCategory(null);
          }}
          onSuccess={() => {
            setShowModal(false);
            setEditingCategory(null);
            loadCategories();
          }}
        />
      )}
    </div>
  );
}

interface CategoryModalProps {
  category: Category | null;
  onClose: () => void;
  onSuccess: () => void;
}

function CategoryModal({ category, onClose, onSuccess }: CategoryModalProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    slug: category?.slug || '',
    description: String(category?.description || ''),
    image_url: category?.image_url || '',
    parent_id: category?.parent_id || '',
    sort_order: category?.sort_order || 0,
    is_active: category?.is_active === true || category?.is_active === 'True',
  });
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(
    category?.image_url || ''
  );
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadParentCategories();
  }, []);

  const loadParentCategories = async () => {
    try {
      const data = await categoriesAPI.getAll();
      const categoriesArray = data.categories 
        ? Object.values(data.categories).map((cat: unknown) => {
            const c = cat as Record<string, unknown>;
            return {
              ...c,
              is_active: c.is_active === 'True' || c.is_active === true,
            };
          })
        : [];
      setCategories(categoriesArray as Category[]);
    } catch {
      // Ignore error
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const handleNameChange = (name: string) => {
    setFormData({ 
      ...formData, 
      name,
      slug: generateSlug(name)
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        image_url: formData.image_url,
        parent_id: formData.parent_id || null,
        sort_order: formData.sort_order,
      };

      if (category) {
        await categoriesAPI.update(category.id, payload);
      } else {
        await categoriesAPI.create({
          ...payload,
          is_active: formData.is_active,
        });
      }
      onSuccess();
    } catch {
      alert('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{category ? 'Chỉnh sửa danh mục' : 'Thêm danh mục mới'}</h2>
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

        <form onSubmit={handleSubmit} className={styles.modalFormWrapper}>
          <div className={styles.modalForm}>
            <div className={styles.formGroup}>
              <label>Tên danh mục</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Slug (URL thân thiện)</label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
                placeholder="electronics"
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Danh mục cha (tùy chọn)</label>
              <select
                value={formData.parent_id}
                onChange={(e) =>
                  setFormData({ ...formData, parent_id: e.target.value })
                }
              >
                <option value="">-- Không có danh mục cha --</option>
                {categories
                  .filter((cat) => cat.id !== category?.id)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Mô tả</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={4}
                placeholder="Mô tả về danh mục..."
              />
            </div>

            <div className={styles.formGroup}>
              <label>Hình ảnh danh mục</label>
              <div className={styles.imageUpload}>
                {imagePreview && (
                  <div className={styles.imagePreview}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="Preview" />
                    <button
                      type="button"
                      className={styles.removeImage}
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview('');
                        setFormData({ ...formData, image_url: '' });
                      }}
                    >
                      <svg
                        width="16"
                        height="16"
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
                )}
                <label className={styles.uploadButton}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
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
                  <span>
                    {imagePreview ? 'Thay đổi hình ảnh' : 'Chọn hình ảnh'}
                  </span>
                </label>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Thứ tự sắp xếp</label>
              <input
                type="number"
                value={formData.sort_order}
                onChange={(e) =>
                  setFormData({ ...formData, sort_order: Number(e.target.value) })
                }
                min="0"
                placeholder="0"
              />
            </div>

            {!category && (
              <div className={styles.formGroup}>
                <label className={styles.checkbox}>
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) =>
                      setFormData({ ...formData, is_active: e.target.checked })
                    }
                  />
                  <span>Hiển thị danh mục</span>
                </label>
              </div>
            )}
          </div>

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
              {loading ? 'Đang xử lý...' : category ? 'Cập nhật' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
