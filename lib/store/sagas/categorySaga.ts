import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { categoriesAPI } from '@/lib/api/categories';
import {
  getCategoriesRequest,
  getCategoriesSuccess,
  getCategoriesFailure,
  getCategoriesTreeRequest,
  getCategoriesTreeSuccess,
  getCategoriesTreeFailure,
  getCategoryByIdRequest,
  getCategoryByIdSuccess,
  getCategoryByIdFailure,
} from '../slices/categorySlice';

// Get all categories saga
function* getCategoriesSaga() {
  try {
    const response: { categories: unknown } = yield call(categoriesAPI.getAll);
    
    // Parse categories
    const categoriesData = response.categories || {};
    const categoriesArray = Object.values(categoriesData).map((category: unknown) => {
      const cat = category as Record<string, unknown>;
      return {
        ...cat,
        is_active: cat.is_active === 'True' || cat.is_active === true,
      };
    });
    
    yield put(getCategoriesSuccess(categoriesArray as never));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Không thể tải danh sách danh mục';
    yield put(getCategoriesFailure(errorMessage));
  }
}

// Get categories tree saga
function* getCategoriesTreeSaga() {
  try {
    const response: { categories: unknown } = yield call(categoriesAPI.getTree);
    
    // Parse categories tree
    const categoriesData = response.categories || {};
    const categoriesArray = Object.values(categoriesData).map((category: unknown) => {
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
    });
    
    yield put(getCategoriesTreeSuccess(categoriesArray as never));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Không thể tải cây danh mục';
    yield put(getCategoriesTreeFailure(errorMessage));
  }
}

// Get category by ID saga
function* getCategoryByIdSaga(action: PayloadAction<string>) {
  try {
    const response: { category: unknown } = yield call(categoriesAPI.getById, action.payload);
    const data = response.category || response;
    
    const categoryData = {
      ...(data as object),
      is_active: (data as { is_active: unknown }).is_active === 'True' || (data as { is_active: unknown }).is_active === true,
    };
    
    yield put(getCategoryByIdSuccess(categoryData as never));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Không thể tải chi tiết danh mục';
    yield put(getCategoryByIdFailure(errorMessage));
  }
}

// Root category saga
export function* categorySaga() {
  yield takeLatest(getCategoriesRequest.type, getCategoriesSaga);
  yield takeLatest(getCategoriesTreeRequest.type, getCategoriesTreeSaga);
  yield takeLatest(getCategoryByIdRequest.type, getCategoryByIdSaga);
}
