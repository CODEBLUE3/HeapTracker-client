import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  variableBarData: {
    variableName: "",
    variableCount: 0,
  },
  styles: {
    visibility: false,
    top: 0,
    left: 0,
  },
};

export const variableBarModalSlice = createSlice({
  name: "variableBarModal",
  initialState,
  reducers: {
    setVariableBarModalData: (state, action) => {
      const { variableCount, variableName } = action.payload;

      state.variableBarData.variableCount = variableCount;
      state.variableBarData.variableName = variableName;
    },
    setVariableBarModalStyle: (state, action) => {
      const { visibility, top, left } = action.payload;

      state.styles.visibility = visibility;
      state.styles.top = top;
      state.styles.left = left;
    },
    hiddenVariableChartModal: (state, action) => {
      const hidden = action.payload;

      state.styles.visibility = hidden;
    },
  },
});

export const {
  setVariableBarModalData,
  setVariableBarModalStyle,
  hiddenVariableChartModal,
} = variableBarModalSlice.actions;

export default variableBarModalSlice.reducer;
