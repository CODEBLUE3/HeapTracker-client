import React from "react";
import { Provider, useDispatch } from "react-redux";
import { store } from "../../src/app/store";

import "@testing-library/jest-dom/extend-expect";
import { cleanup, render, screen } from "@testing-library/react";
import ChartModal from "../../src/component/ChartModal";

afterEach(cleanup);

describe("ChartModal Component Test", () => {
  test("모달이 랜더링 됩니다", () => {
    render(
      <Provider store={store}>
        <ChartModal />
      </Provider>,
    );

    const modal = screen.getAllByAltText("th node");
  });
});
