import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import goalReducer from '../features/goals/goalSlice'
import balanceReducer from '../features/balance/balanceSlice'
import orderReducer from '../features/orders/orderSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    goals: goalReducer,
    balance: balanceReducer,
    openOrders: orderReducer,
    portfolio: balanceReducer,
  },
})
