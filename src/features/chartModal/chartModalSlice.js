import { createModalSlice } from "../modal/createModalSlice";

const chartModalSlice = createModalSlice("chartModal", {
  codeCount: 0,
  codeType: "",
  codePosition: "",
  usedMemory: "",
  timeStamp: "",
});

// Export actions with original names for backward compatibility
export const {
  setModalData: setChartModalData,
  setModalStyle: setChartModalStyle,
  hideModal: hiddenChartModal,
} = chartModalSlice.actions;

export default chartModalSlice.reducer;
