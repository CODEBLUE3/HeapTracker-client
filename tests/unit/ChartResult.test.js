import React from "react";
import { Provider } from "react-redux";
import { store } from "../../src/app/store";
import { cleanup, render, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import ChartResult from "../../src/component/ChartResult";
import ReduxMockFunction from "../mock/reduxMockFunction";

afterEach(cleanup);

describe("ChartResult Component test", () => {
  test("init test ", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <ReduxMockFunction />
        <ChartResult />
      </Provider>,
    );

    expect(getByTestId("memory-duration")).toHaveTextContent(0);
    expect(getByTestId("memory-max")).toHaveTextContent(0);
    expect(getByTestId("memory-min")).toHaveTextContent(0);
    expect(getByTestId("memory-used")).toHaveTextContent(0);
    expect(getByTestId("memory-count")).toHaveTextContent(0);
  });

  test("value change test", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <ReduxMockFunction />
        <ChartResult />
      </Provider>,
    );

    expect(Number(getByTestId("memory-count").textContent)).toBe(0);

    fireEvent.click(getByTestId("dispatch-button"));

    expect(Number(getByTestId("memory-count").textContent)).toBe(30);
    expect(
      Number(getByTestId("memory-duration").textContent.replace(/[^0-9]/g, "")),
    ).toBeGreaterThan(1);
    expect(
      Number(getByTestId("memory-max").textContent.replace(/[^0-9]/g, "")),
    ).toBeGreaterThan(1);
    expect(
      Number(getByTestId("memory-min").textContent.replace(/[^0-9]/g, "")),
    ).toBeGreaterThan(1);
    expect(
      Number(getByTestId("memory-used").textContent.replace(/[^0-9]/g, "")),
    ).toBeGreaterThan(1);
  });
});
