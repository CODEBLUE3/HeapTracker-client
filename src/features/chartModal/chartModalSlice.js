import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  codeCount: 0,
  codeType: "",
  usedMemory: "",
  timeStamp: "",
  visibility: false,
};

export const chartModalSlice = createSlice({
  name: "chartModal",
  initialState,
  reducers: {
    setChartModal: (state, action) => {
      state.heapMemoryData = action.payload;
    },
  },
});

export const { setChartModal } = chartModalSlice.actions;

export default chartModalSlice.reducer;
