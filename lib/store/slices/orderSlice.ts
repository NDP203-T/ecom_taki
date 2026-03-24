import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { CreateOrderData } from '@/lib/api/orders';

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  variant_id?: string;
  variant_name?: string;
  sku: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface Order {
  id: string;
  order_number: string;
  status: string;
  payment_status: string;
  total: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
  items: OrderItem[];
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: string;
  shipping_city: string;
  shipping_district: string;
  shipping_ward: string;
  payment_method: string;
  shipping_fee: number;
  discount: number;
  note?: string;
  user_id: string;
  items_count: number;
  confirmed_at?: string;
  cancelled_at?: string;
  completed_at?: string;
  delivered_at?: string;
  admin_note?: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  loading: boolean;
  error: string | null;
  createSuccess: boolean;
}

const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  loading: false,
  error: null,
  createSuccess: false,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Create order
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    createOrderRequest: (state, action: PayloadAction<CreateOrderData>) => {
      state.loading = true;
      state.error = null;
      state.createSuccess = false;
    },
    createOrderSuccess: (state, action: PayloadAction<Order>) => {
      state.loading = false;
      state.currentOrder = action.payload;
      state.createSuccess = true;
    },
    createOrderFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
      state.createSuccess = false;
    },

    // Get my orders
    getMyOrdersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    getMyOrdersSuccess: (state, action: PayloadAction<Order[]>) => {
      state.loading = false;
      state.orders = action.payload;
    },
    getMyOrdersFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Get order by ID
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getOrderByIdRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    getOrderByIdSuccess: (state, action: PayloadAction<Order>) => {
      state.loading = false;
      state.currentOrder = action.payload;
    },
    getOrderByIdFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Cancel order
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    cancelOrderRequest: (state, action: PayloadAction<string>) => {
      state.loading = true;
      state.error = null;
    },
    cancelOrderSuccess: (state, action: PayloadAction<Order>) => {
      state.loading = false;
      state.currentOrder = action.payload;
      // Update in orders list
      const index = state.orders.findIndex(o => o.id === action.payload.id);
      if (index !== -1) {
        state.orders[index] = action.payload;
      }
    },
    cancelOrderFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Reset create success flag
    resetCreateSuccess: (state) => {
      state.createSuccess = false;
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  createOrderRequest,
  createOrderSuccess,
  createOrderFailure,
  getMyOrdersRequest,
  getMyOrdersSuccess,
  getMyOrdersFailure,
  getOrderByIdRequest,
  getOrderByIdSuccess,
  getOrderByIdFailure,
  cancelOrderRequest,
  cancelOrderSuccess,
  cancelOrderFailure,
  resetCreateSuccess,
  clearError,
} = orderSlice.actions;

export default orderSlice.reducer;
