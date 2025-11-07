import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import { store } from "../../src/app/store";

/**
 * renderWithRedux - Custom render function that wraps component with Redux Provider
 *
 * Simplifies test setup by automatically providing Redux store to components.
 * Compatible with all @testing-library/react render options.
 *
 * @param {React.ReactElement} ui - Component to render
 * @param {Object} options - Optional render options
 * @param {Object} options.store - Custom store instance (default: application store)
 * @param {Object} options.renderOptions - Additional options passed to render()
 * @returns {Object} Render result from @testing-library/react
 *
 * @example
 * // Basic usage
 * renderWithRedux(<MyComponent />);
 *
 * @example
 * // With custom store
 * const customStore = configureStore({ reducer: myReducer });
 * renderWithRedux(<MyComponent />, { store: customStore });
 *
 * @example
 * // With render options
 * const { getByTestId } = renderWithRedux(<MyComponent />, {
 *   renderOptions: { container: document.body }
 * });
 */
export function renderWithRedux(
  ui,
  { store: customStore = store, ...renderOptions } = {},
) {
  function Wrapper({ children }) {
    return <Provider store={customStore}>{children}</Provider>;
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * createMockStore - Helper to create a mock Redux store for testing
 *
 * @param {Object} initialState - Initial state for the mock store
 * @returns {Object} Mock store instance
 *
 * @example
 * const mockStore = createMockStore({
 *   chartModal: { data: {}, styles: {} }
 * });
 * renderWithRedux(<MyComponent />, { store: mockStore });
 */
export function createMockStore(initialState = {}) {
  return {
    getState: () => initialState,
    subscribe: () => {},
    dispatch: jest.fn(),
  };
}

// Re-export commonly used testing utilities
export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";
