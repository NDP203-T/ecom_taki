import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { productsAPI } from '@/lib/api/products';
import {
  getProductsRequest,
  getProductsSuccess,
  getProductsFailure,
  getProductByIdRequest,
  getProductByIdSuccess,
  getProductByIdFailure,
} from '../slices/productSlice';

// Get all products saga
function* getProductsSaga() {
  try {
    const response: { products: unknown } = yield call(productsAPI.getAll);
    
    // Parse products
    const productsData = response.products || {};
    const productsArray = Object.values(productsData).map((product: unknown) => {
      const prod = product as Record<string, unknown>;
      return {
        ...prod,
        images: prod.images 
          ? Object.values(prod.images as Record<string, unknown>).map((img: unknown) => 
              (img as Record<string, unknown>).image_url as string
            )
          : [],
        is_active: prod.is_active === 'True' || prod.is_active === true,
        category: String(prod.category || ''),
        price: Number(prod.price) || 0,
        stock: Number(prod.stock) || 0,
      };
    });
    
    yield put(getProductsSuccess(productsArray as never));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Không thể tải danh sách sản phẩm';
    yield put(getProductsFailure(errorMessage));
  }
}

// Get product by ID saga
function* getProductByIdSaga(action: PayloadAction<string>) {
  try {
    const response: { product: unknown } = yield call(productsAPI.getById, action.payload);
    const data = response.product || response;
    
    // Parse variants
    let variantsArray = [];
    if (data && typeof data === 'object' && 'variants' in data) {
      const variants = (data as { variants: unknown }).variants;
      if (Array.isArray(variants)) {
        variantsArray = variants;
      } else if (typeof variants === 'object' && variants !== null) {
        variantsArray = Object.values(variants);
      }
    }
    
    // Parse images
    let imagesArray: string[] = [];
    if (data && typeof data === 'object' && 'images' in data) {
      const images = (data as { images: unknown }).images;
      if (Array.isArray(images)) {
        imagesArray = images;
      } else if (typeof images === 'object' && images !== null) {
        const imageValues = Object.values(images);
        imagesArray = imageValues.map((img: unknown) => {
          if (typeof img === 'string') return img;
          if (img && typeof img === 'object' && 'image_url' in img) {
            return (img as { image_url: string }).image_url;
          }
          return '';
        }).filter(Boolean);
      }
    }
    
    const productData = {
      ...(data as object),
      images: imagesArray,
      variants: variantsArray.map((v: unknown) => {
        const variant = v as Record<string, unknown>;
        return {
          ...variant,
          is_active: variant.is_active === 'True' || variant.is_active === true,
          price: Number(variant.price) || 0,
          stock: Number(variant.stock) || 0,
        };
      }),
      is_active: (data as { is_active: unknown }).is_active === 'True' || (data as { is_active: unknown }).is_active === true,
      price: Number((data as { price: unknown }).price) || 0,
      stock: Number((data as { stock: unknown }).stock) || 0,
    };
    
    yield put(getProductByIdSuccess(productData as never));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Không thể tải chi tiết sản phẩm';
    yield put(getProductByIdFailure(errorMessage));
  }
}

// Root product saga
export function* productSaga() {
  yield takeLatest(getProductsRequest.type, getProductsSaga);
  yield takeLatest(getProductByIdRequest.type, getProductByIdSaga);
}
