import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  colorTheme: "dark",
};

export const appGlobalSlice = createSlice({
  name: "appGlobal",
  initialState,
  reducers: {
    setColorTheme: (state, action) => {
      state.colorTheme = action.payload;
    },
  },
});

export const { setColorTheme } = appGlobalSlice.actions;

export default appGlobalSlice.reducer;
