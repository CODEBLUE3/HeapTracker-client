import React from "react";
import { renderWithRedux, fireEvent, cleanup } from "../utils/test-helpers";
import "@testing-library/jest-dom/extend-expect";
import ChartResult from "../../src/component/ChartResult";
import ReduxMockFunction from "../mock/reduxMockFunction";

afterEach(cleanup);

describe("ChartResult Component test", () => {
  test("init test", () => {
    const { getByTestId } = renderWithRedux(
      <>
        <ReduxMockFunction />
        <ChartResult />
      </>,
    );

    expect(getByTestId("memory-duration")).toHaveTextContent(0);
    expect(getByTestId("memory-max")).toHaveTextContent(0);
    expect(getByTestId("memory-min")).toHaveTextContent(0);
    expect(getByTestId("memory-used")).toHaveTextContent(0);
    expect(getByTestId("memory-count")).toHaveTextContent(0);
  });

  test("value change test", () => {
    const { getByTestId } = renderWithRedux(
      <>
        <ReduxMockFunction />
        <ChartResult />
      </>,
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
