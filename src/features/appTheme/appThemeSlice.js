import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  colorTheme: "dark",
};

export const appThemeSlice = createSlice({
  name: "appTheme",
  initialState,
  reducers: {
    setColorTheme: (state, action) => {
      state.colorTheme = action.payload;
    },
  },
});

export const { setColorTheme } = appThemeSlice.actions;

export default appThemeSlice.reducer;
