import React from "react";
import Chart from "../../src/component/Chart";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { store } from "../../src/app/store";

describe("Chart Component test", () => {
  test("init test", () => {
    render(
      <Provider store={store}>
        <Chart />
      </Provider>,
    );

    const startButton = screen.getByTestId("start-button");
    const pauseButton = screen.getByTestId("pause-button");
    const stopButton = screen.getByTestId("stop-button");

    expect(startButton).toBeInTheDocument();
    expect(pauseButton).toBeInTheDocument();
    expect(stopButton).toBeInTheDocument();
  });

  test("button click test", () => {
    const { getByTestId } = render(
      <Provider store={store}>
        <Chart />
      </Provider>,
    );

    const startButton = getByTestId("start-button");
  });
});
