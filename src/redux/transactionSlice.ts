import { createSlice } from "@reduxjs/toolkit"
import { AppState } from "./store"

export interface TransactionState {
  count: number
}

const initialState: TransactionState = {
  count: 0,
}

export const transactionSlice = createSlice({
  name: "transaction",
  initialState,
  reducers: {
    setTransactionCount(state, action) {
      state.count = action.payload;
    }
  }
})

export const {setTransactionCount} = transactionSlice.actions;
export const getTransactionCount = (state: AppState) => state.transaction.count;
export default transactionSlice.reducer;