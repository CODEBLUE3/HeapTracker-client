import { configureStore } from "@reduxjs/toolkit";
import heapMemoryReducer from "../features/heapMemory/heapMemorySlice";
import userCodeReducer from "../features/userCode/userCodeSlice";
import chartModalReducer from "../features/chartModal/chartModalSlice";
import appThemeReducer from "../features/appTheme/appThemeSlice";
import variableBarModalReducer from "../features/chartModal/variableBarModalSlice";
import logger from "redux-logger";

export const store = configureStore({
  reducer: {
    heapMemory: heapMemoryReducer,
    userCode: userCodeReducer,
    chartModal: chartModalReducer,
    appTheme: appThemeReducer,
    variableBarModal: variableBarModalReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
