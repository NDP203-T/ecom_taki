import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Product {
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
  variants?: Array<{
    id: string;
    name: string;
    color: string;
    size: string;
    price: number;
    stock: number;
    sku: string;
    image_url?: string;
    is_active: boolean;
  }>;
}

interface ProductState {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // Get all products
    getProductsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getProductsSuccess: (state, action: PayloadAction<Product[]>) => {
      state.loading = false;
      state.products = action.payload;
    },
    getProductsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get product by ID
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getProductByIdRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    getProductByIdSuccess: (state, action: PayloadAction<Product>) => {
      state.loading = false;
      state.currentProduct = action.payload;
    },
    getProductByIdFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Clear error
    clearProductError: (state) => {
      state.error = null;
    },
  },
});

export const {
  getProductsRequest,
  getProductsSuccess,
  getProductsFailure,
  getProductByIdRequest,
  getProductByIdSuccess,
  getProductByIdFailure,
  clearProductError,
} = productSlice.actions;

export default productSlice.reducer;
