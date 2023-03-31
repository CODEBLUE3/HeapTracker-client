import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  colorTheme: "dark",
  chartColor: "#1E90FF",
};

export const appThemeSlice = createSlice({
  name: "appTheme",
  initialState,
  reducers: {
    setColorTheme: (state, action) => {
      state.colorTheme = action.payload;
    },
    setChartColor: (state, action) => {
      state.chartColor = action.payload;
    },
  },
});

export const { setColorTheme, setChartColor } = appThemeSlice.actions;

export default appThemeSlice.reducer;
