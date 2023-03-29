import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  type: "lineChart",
};

export const chartTypeSlice = createSlice({
  name: "chartType",
  initialState,
  reducers: {
    setChartType: (state, action) => {
      state.type = action.payload;
    },
  },
});

export const { setChartType } = chartTypeSlice.actions;

export default chartTypeSlice.reducer;
