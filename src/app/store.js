import { configureStore } from "@reduxjs/toolkit";
import heapMemoryReducer from "../features/heapMemory/heapMemorySlice";
import userCodeReducer from "../features/userCode/userCodeSlice";
import chartModalReducer from "../features/chartModal/chartModalSlice";
import appGlobalReducer from "../features/appGlobal/appGlobalSlice";
import logger from "redux-logger";

export const store = configureStore({
  reducer: {
    heapMemory: heapMemoryReducer,
    userCode: userCodeReducer,
    chartModal: chartModalReducer,
    appGlobal: appGlobalReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
