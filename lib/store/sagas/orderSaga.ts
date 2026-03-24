import { call, put, takeLatest } from 'redux-saga/effects';
import { PayloadAction } from '@reduxjs/toolkit';
import { ordersAPI, CreateOrderData } from '@/lib/api/orders';
import {
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
} from '../slices/orderSlice';

// Helper function to parse order data
function parseOrder(order: Record<string, unknown>) {
  // Convert items object to array
  const itemsObj = order.items as Record<string, unknown> || {};
  const itemsArray = Object.values(itemsObj).map((item: unknown) => {
    const i = item as Record<string, unknown>;
    return {
      ...i,
      price: typeof i.price === 'string' ? parseFloat(i.price) : i.price,
      quantity: typeof i.quantity === 'string' ? parseInt(i.quantity) : i.quantity,
      subtotal: typeof i.subtotal === 'string' ? parseFloat(i.subtotal) : i.subtotal,
    };
  });

  return {
    ...order,
    items: itemsArray,
    total: typeof order.total_amount === 'string' ? parseFloat(order.total_amount as string) : order.total_amount,
    shipping_fee: typeof order.shipping_fee === 'string' ? parseFloat(order.shipping_fee as string) : order.shipping_fee,
    discount: typeof order.discount === 'string' ? parseFloat(order.discount as string) : order.discount,
    subtotal: typeof order.subtotal === 'string' ? parseFloat(order.subtotal as string) : order.subtotal,
  };
}

// Create order saga
function* createOrderSaga(action: PayloadAction<CreateOrderData>) {
  try {
    const response: { order: unknown } = yield call(ordersAPI.create, action.payload);
    const parsedOrder = parseOrder(response.order as Record<string, unknown>);
    yield put(createOrderSuccess(parsedOrder as never));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Đặt hàng thất bại';
    yield put(createOrderFailure(errorMessage));
  }
}

// Get my orders saga
function* getMyOrdersSaga() {
  try {
    const response: { orders: unknown } = yield call(ordersAPI.getMyOrders);
    const ordersData = response.orders || {};
    const ordersArray = Array.isArray(ordersData) 
      ? ordersData 
      : Object.values(ordersData);
    
    const parsedOrders = ordersArray.map((order: unknown) => 
      parseOrder(order as Record<string, unknown>)
    );
    
    yield put(getMyOrdersSuccess(parsedOrders as never));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Không thể tải danh sách đơn hàng';
    yield put(getMyOrdersFailure(errorMessage));
  }
}

// Get order by ID saga
function* getOrderByIdSaga(action: PayloadAction<string>) {
  try {
    const response: { order: unknown } = yield call(ordersAPI.getById, action.payload);
    const parsedOrder = parseOrder(response.order as Record<string, unknown>);
    yield put(getOrderByIdSuccess(parsedOrder as never));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Không thể tải chi tiết đơn hàng';
    yield put(getOrderByIdFailure(errorMessage));
  }
}

// Cancel order saga
function* cancelOrderSaga(action: PayloadAction<string>) {
  try {
    const response: { order: unknown } = yield call(ordersAPI.cancel, action.payload);
    const parsedOrder = parseOrder(response.order as Record<string, unknown>);
    yield put(cancelOrderSuccess(parsedOrder as never));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Không thể hủy đơn hàng';
    yield put(cancelOrderFailure(errorMessage));
  }
}

// Root order saga
export function* orderSaga() {
  yield takeLatest(createOrderRequest.type, createOrderSaga);
  yield takeLatest(getMyOrdersRequest.type, getMyOrdersSaga);
  yield takeLatest(getOrderByIdRequest.type, getOrderByIdSaga);
  yield takeLatest(cancelOrderRequest.type, cancelOrderSaga);
}
