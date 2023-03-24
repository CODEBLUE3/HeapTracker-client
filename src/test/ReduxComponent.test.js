import React from "react";
import { Provider } from "react-redux";
import { store } from "../app/store";
import { cleanup, render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ChartResult from "../component/ChartResult";
import ReduxMockFunction from "./reduxMockFunction";

afterEach(cleanup);

test.only("ChartResult success", () => {
  const { getByTestId } = render(
    <Provider store={store}>
      <ReduxMockFunction />
      <ChartResult />
    </Provider>,
  );

  expect(getByTestId("memoryCount")).toHaveTextContent(0);
  fireEvent.click(getByTestId("dispatchButton"));
  expect(getByTestId("memoryCount")).toHaveTextContent(30);
});
