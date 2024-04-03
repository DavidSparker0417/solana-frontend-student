import { Store, configureStore } from "@reduxjs/toolkit";
import {TransactionState, transactionSlice} from "./transactionSlice";
import { createWrapper } from "next-redux-wrapper";

const makeStore = () => 
  configureStore({
    reducer: {
      [transactionSlice.name]: transactionSlice.reducer,
    },
    devTools: true,
  })

  export type AppStore = ReturnType<typeof makeStore>;
  export type AppState = ReturnType<AppStore["getState"]>;
  export const wrapper = createWrapper<AppStore>(makeStore)
  