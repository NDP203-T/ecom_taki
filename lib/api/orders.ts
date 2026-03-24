import { apiClient } from './auth';

export interface OrderItem {
  product_id: string;
  variant_id?: string;
  quantity: number;
}

export interface CreateOrderData {
  items: OrderItem[];
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  shipping_address: string;
  shipping_city: string;
  shipping_district: string;
  shipping_ward: string;
  payment_method: string;
  shipping_fee?: number;
  discount?: number;
  note?: string;
}

export const ordersAPI = {
  // Create new order
  create: async (data: CreateOrderData) => {
    const response = await apiClient.post('/orders', data);
    return response.data;
  },

  // Get user's orders
  getMyOrders: async () => {
    const response = await apiClient.get('/orders/my-orders');
    return response.data;
  },

  // Get order details
  getById: async (orderId: string) => {
    const response = await apiClient.get(`/orders/${orderId}`);
    return response.data;
  },

  // Get order by order number
  getByNumber: async (orderNumber: string) => {
    const response = await apiClient.get(`/orders/number/${orderNumber}`);
    return response.data;
  },

  // Cancel order
  cancel: async (orderId: string) => {
    const response = await apiClient.put(`/orders/${orderId}/cancel`);
    return response.data;
  },
};
