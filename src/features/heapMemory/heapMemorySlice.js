import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  heapMemoryData: {},
};

export const heapMemorySlice = createSlice({
  name: "heapMemory",
  initialState,
  reducers: {
    setHeapMemoryData: (state, action) => {
      state.heapMemoryData = action.payload;
    },
  },
});

export const { setHeapMemoryData } = heapMemorySlice.actions;

export default heapMemorySlice.reducer;
