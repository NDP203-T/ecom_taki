import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_id?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  children?: Category[];
}

interface CategoryState {
  categories: Category[];
  categoriesTree: Category[];
  currentCategory: Category | null;
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  categories: [],
  categoriesTree: [],
  currentCategory: null,
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // Get all categories
    getCategoriesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCategoriesSuccess: (state, action: PayloadAction<Category[]>) => {
      state.loading = false;
      state.categories = action.payload;
    },
    getCategoriesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get categories tree
    getCategoriesTreeRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getCategoriesTreeSuccess: (state, action: PayloadAction<Category[]>) => {
      state.loading = false;
      state.categoriesTree = action.payload;
    },
    getCategoriesTreeFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get category by ID
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getCategoryByIdRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    getCategoryByIdSuccess: (state, action: PayloadAction<Category>) => {
      state.loading = false;
      state.currentCategory = action.payload;
    },
    getCategoryByIdFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear error
    clearCategoryError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getCategoriesRequest,
  getCategoriesSuccess,
  getCategoriesFailure,
  getCategoriesTreeRequest,
  getCategoriesTreeSuccess,
  getCategoriesTreeFailure,
  getCategoryByIdRequest,
  getCategoryByIdSuccess,
  getCategoryByIdFailure,
  clearCategoryError,
} = categorySlice.actions;

export default categorySlice.reducer;
