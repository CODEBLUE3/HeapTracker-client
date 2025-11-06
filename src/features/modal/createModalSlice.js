import { createSlice } from "@reduxjs/toolkit";

/**
 * createModalSlice - Factory function for creating modal Redux slices
 *
 * Creates a Redux slice with standardized modal state management,
 * including data fields and positioning styles.
 *
 * @param {string} name - The slice name (e.g., "chartModal")
 * @param {Object} initialDataFields - Initial data fields for the modal
 * @param {string} dataKey - The key name for data in state (default: "data")
 *
 * @returns {Object} Redux slice with actions and reducer
 *
 * @example
 * const chartModalSlice = createModalSlice("chartModal", {
 *   codeCount: 0,
 *   codeType: "",
 *   codePosition: "",
 *   usedMemory: "",
 *   timeStamp: "",
 * });
 */
export const createModalSlice = (name, initialDataFields, dataKey = "data") => {
  const initialState = {
    [dataKey]: initialDataFields,
    styles: {
      visibility: false,
      top: 0,
      left: 0,
    },
  };

  const slice = createSlice({
    name,
    initialState,
    reducers: {
      setModalData: (state, action) => {
        // Update all fields from payload
        Object.keys(action.payload).forEach((key) => {
          if (state[dataKey].hasOwnProperty(key)) {
            state[dataKey][key] = action.payload[key];
          }
        });
      },
      setModalStyle: (state, action) => {
        const { visibility, top, left } = action.payload;

        if (visibility !== undefined) state.styles.visibility = visibility;
        if (top !== undefined) state.styles.top = top;
        if (left !== undefined) state.styles.left = left;
      },
      hideModal: (state, action) => {
        state.styles.visibility = action.payload;
      },
    },
  });

  return slice;
};

/**
 * Helper function to extract actions with custom names
 *
 * @param {Object} slice - The Redux slice
 * @param {string} prefix - Prefix for action names (e.g., "chart")
 * @returns {Object} Object with renamed actions
 */
export const getModalActions = (slice, prefix) => {
  const { setModalData, setModalStyle, hideModal } = slice.actions;

  return {
    [`set${prefix}ModalData`]: setModalData,
    [`set${prefix}ModalStyle`]: setModalStyle,
    [`hidden${prefix}Modal`]: hideModal,
  };
};
