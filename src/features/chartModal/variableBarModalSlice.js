import { createModalSlice } from "../modal/createModalSlice";

const variableBarModalSlice = createModalSlice(
  "variableBarModal",
  {
    variableName: "",
    variableCount: 0,
  },
  "variableBarData", // Custom data key to maintain state structure
);

// Export actions with original names for backward compatibility
export const {
  setModalData: setVariableBarModalData,
  setModalStyle: setVariableBarModalStyle,
  hideModal: hiddenVariableChartModal,
} = variableBarModalSlice.actions;

export default variableBarModalSlice.reducer;
