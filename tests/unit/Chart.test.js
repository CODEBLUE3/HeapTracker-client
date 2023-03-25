import React from "react";
import Chart from "../../src/component/Chart";
import { fireEvent, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Provider } from "react-redux";
import { store } from "../../src/app/store";

describe("Chart Component 테스트", () => {
  test("시작, 일시정지, 종료 버튼이 있는가?", () => {
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

  /* FIXME
     해당 버튼을 클릭하면 버튼의 onClick Event를 실행시키는 것에 대한
     테스트케이스로 구현하고싶습니다. */
  test("버튼을 누르면 onClick event를 실행하는가?", () => {
    render(
      <Provider store={store}>
        <Chart />
      </Provider>,
    );
    const startButton = screen.getByTestId("start-button");
    const pauseButton = screen.getByTestId("pause-button");
    const stopButton = screen.getByTestId("stop-button");

    fireEvent.click(startButton);
    expect(startButton).toBeCalledTimes(1);
    fireEvent.click(pauseButton);
    expect(pauseButton).toBeCalledTimes(1);
    fireEvent.click(stopButton);
    expect(stopButton).toBeCalledTimes(1);
  });
});
