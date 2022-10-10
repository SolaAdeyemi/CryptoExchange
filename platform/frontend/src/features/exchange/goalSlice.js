import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import goalService from './goalService'

const initialState = {
  goals: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Get user goals
export const getBitcoinPrice = createAsyncThunk(
  'goals/getAll',
  async (_, thunkAPI) => {
    try {
      return await exchangeService.getCryptoPrice('btcgbp')
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

export const { reset } = goalSlice.actions
export default goalSlice.reducer
