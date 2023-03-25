import React from "react";
import { Provider } from "react-redux";
import { store } from "../../src/app/store";
import { cleanup, render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ChartResult from "../../src/component/ChartResult";
import ReduxMockFunction from "./reduxMockFunction";

afterEach(cleanup);

test.only("ChartResult success", () => {
  const { getByTestId } = render(
    <Provider store={store}>
      <ReduxMockFunction />
      <ChartResult />
    </Provider>,
  );

  expect(getByTestId("memory-count")).toHaveTextContent(0);
  fireEvent.click(getByTestId("dispatch-button"));
  expect(getByTestId("memory-count")).toHaveTextContent(30);
});
