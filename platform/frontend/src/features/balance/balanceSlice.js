import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import balanceService from './balanceService'

const initialState = {
  balance: [],
  portfolio: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

export const getBalance = createAsyncThunk(
  'balance/get',
  async (symbol, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await balanceService.getBalance(symbol, token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const getTotalBalance = createAsyncThunk(
  'balance/getall',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token
      return await balanceService.getTotalBalance(token)
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString()
      return thunkAPI.rejectWithValue(message)
    }
  }
)

export const balanceSlice = createSlice({
  name: 'balance',
  initialState,
  reducers: {
    reset: (state) => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(getBalance.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getBalance.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.balance = action.payload
      })
      .addCase(getBalance.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(getTotalBalance.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getTotalBalance.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.portfolio = action.payload
      })
      .addCase(getTotalBalance.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
  },
})



export const { reset } = balanceSlice.actions
export default balanceSlice.reducer
