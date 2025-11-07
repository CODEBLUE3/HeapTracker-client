import React from "react";
import Chart from "../../src/component/Chart";
import { renderWithRedux, screen } from "../utils/test-helpers";
import "@testing-library/jest-dom";

describe("Chart Component test", () => {
  test("init test", () => {
    renderWithRedux(<Chart />);

    const startButton = screen.getByTestId("start-button");
    const pauseButton = screen.getByTestId("pause-button");
    const stopButton = screen.getByTestId("stop-button");

    expect(startButton).toBeInTheDocument();
    expect(pauseButton).toBeInTheDocument();
    expect(stopButton).toBeInTheDocument();
  });

  /* FIXME
     해당 버튼을 클릭하면 버튼의 onClick Event를 실행시키는 것에 대한
     테스트케이스로 구현하고싶습니다. */

  test("button click test", () => {
    const { getByTestId } = renderWithRedux(<Chart />);

    const startButton = getByTestId("start-button");
  });
});
