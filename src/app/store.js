import { configureStore } from "@reduxjs/toolkit";
import heapMemoryReducer from "../features/heapMemory/heapMemorySlice";
import userCodeReducer from "../features/userCode/userCodeSlice";
import logger from "redux-logger";

export const store = configureStore({
  reducer: {
    heapMemory: heapMemoryReducer,
    userCode: userCodeReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
