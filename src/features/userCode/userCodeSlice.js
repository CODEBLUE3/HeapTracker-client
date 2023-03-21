import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInput: "",
  userExecution: "",
};

export const userCodeSlice = createSlice({
  name: "userCode",
  initialState,
  reducers: {
    setUserCode: (state, action) => {
      state.userInput = action.payload.userInput;
      state.userExecution = action.payload.userExecution;
    },
  },
});

export const { setUserCode } = userCodeSlice.actions;

export default userCodeSlice.reducer;
