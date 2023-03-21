import { configureStore } from "@reduxjs/toolkit";
import heapMemoryReducer from "../features/node/heapMemorySlice";
import logger from "redux-logger";

export const store = configureStore({
  reducer: {
    heapMemory: heapMemoryReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
