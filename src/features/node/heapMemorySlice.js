import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  memoryData: {},
};

export const heapMemorySlice = createSlice({
  name: "heapMemory",
  initialState,
  reducers: {
    setNodeData: (state, action) => {
      state.memoryData = action.payload;
    },
  },
});

export const { setNodeData } = heapMemorySlice.actions;

export default heapMemorySlice.reducer;
