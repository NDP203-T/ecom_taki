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

// Create order saga
function* createOrderSaga(action: PayloadAction<CreateOrderData>) {
  try {
    const response: { order: unknown } = yield call(ordersAPI.create, action.payload);
    yield put(createOrderSuccess(response.order as never));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Đặt hàng thất bại';
    yield put(createOrderFailure(errorMessage));
  }
}

// Get my orders saga
function* getMyOrdersSaga() {
  try {
    const response: { orders: unknown } = yield call(ordersAPI.getMyOrders);
    const orders = response.orders || [];
    yield put(getMyOrdersSuccess(orders as never));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Không thể tải danh sách đơn hàng';
    yield put(getMyOrdersFailure(errorMessage));
  }
}

// Get order by ID saga
function* getOrderByIdSaga(action: PayloadAction<string>) {
  try {
    const response: { order: unknown } = yield call(ordersAPI.getById, action.payload);
    yield put(getOrderByIdSuccess(response.order as never));
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Không thể tải chi tiết đơn hàng';
    yield put(getOrderByIdFailure(errorMessage));
  }
}

// Cancel order saga
function* cancelOrderSaga(action: PayloadAction<string>) {
  try {
    const response: { order: unknown } = yield call(ordersAPI.cancel, action.payload);
    yield put(cancelOrderSuccess(response.order as never));
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
