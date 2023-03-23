import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {
    codeCount: 0,
    codeType: "",
    codePosition: "",
    usedMemory: "",
    timeStamp: "",
  },
  styles: {
    visibility: false,
    top: 0,
    left: 0,
  },
};

export const chartModalSlice = createSlice({
  name: "chartModal",
  initialState,
  reducers: {
    setChartModalData: (state, action) => {
      const { codeCount, codeType, codePosition, usedMemory, timeStamp } =
        action.payload;

      state.data.codeCount = codeCount;
      state.data.codeType = codeType;
      state.data.codePosition = codePosition;
      state.data.usedMemory = usedMemory;
      state.data.timeStamp = timeStamp;
    },
    setChartModalStyle: (state, action) => {
      const { visibility, top, left } = action.payload;

      state.styles.visibility = visibility;
      state.styles.top = top;
      state.styles.left = left;
    },
    hiddenChartModal: (state, action) => {
      const hidden = action.payload;

      state.styles.visibility = hidden;
    },
  },
});

export const { setChartModalData, setChartModalStyle, hiddenChartModal } =
  chartModalSlice.actions;

export default chartModalSlice.reducer;
