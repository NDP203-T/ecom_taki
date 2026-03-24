import { all } from 'redux-saga/effects';
import { authSaga } from './authSaga';
import { orderSaga } from './orderSaga';
import { productSaga } from './productSaga';
import { categorySaga } from './categorySaga';

export function* rootSaga() {
  yield all([
    authSaga(),
    orderSaga(),
    productSaga(),
    categorySaga(),
  ]);
}
