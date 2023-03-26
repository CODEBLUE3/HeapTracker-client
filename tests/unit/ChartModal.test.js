import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";

// import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import ChartModal from "../../src/component/ChartModal";

describe("ChartModal Component Test", () => {
  test("초기 모달이 렌더링 됩니다", () => {
    const initialState = {
      chartModal: {
        data: {
          codeCount: 0,
          codeType: "",
          codePosition: "",
          usedMemory: "",
          timeStamp: "",
        },
        styles: {
          visibility: false,
          top: 0,
          left: 0,
        },
      },
    };
    const mockStore = configureMockStore();
    const store = mockStore(initialState);

    render(
      <Provider store={store}>
        <ChartModal />
      </Provider>,
    );

    const modal = screen.getByTestId("chartModal");

    expect(modal).toBeInTheDocument();
    expect(modal).toHaveStyle("visibility: hidden");
  });

  test("리덕스의 내용이 변경되면 모달의 styles가 변경됩니다", () => {
    const visibilityTest = {
      chartModal: {
        data: {
          codeCount: 0,
          codeType: "",
          codePosition: "",
          usedMemory: "",
          timeStamp: "",
        },
        styles: {
          visibility: true,
          top: 150,
          left: 150,
        },
      },
    };
    const mockStore = configureMockStore();
    const store = mockStore(visibilityTest);

    render(
      <Provider store={store}>
        <ChartModal />
      </Provider>,
    );

    const modal = screen.getByTestId("chartModal");

    expect(modal).toHaveStyle("visibility: visible");
    expect(modal).toHaveStyle("top: 150px");
    expect(modal).toHaveStyle("left: 150px");
  });

  test("리덕스의 내용이 변경되면 모달의 data가 변경됩니다", () => {
    const moalDataTest = {
      chartModal: {
        data: {
          codeCount: 10,
          codeType: "forStatement",
          codePosition: "10",
          usedMemory: "1000",
          timeStamp: "20",
        },
        styles: {
          visibility: true,
          top: 0,
          left: 0,
        },
      },
    };

    const mockStore = configureMockStore();
    const store = mockStore(moalDataTest);

    render(
      <Provider store={store}>
        <ChartModal />
      </Provider>,
    );

    expect(screen.getByText("10th node")).toBeInTheDocument();
    expect(screen.getByText("Type: for")).toBeInTheDocument();
    expect(screen.getByText("Used Memory: 1000")).toBeInTheDocument();
    expect(screen.getByText("Time: 0.02 us")).toBeInTheDocument();
  });

  test("state에 type이 없다면, position이 랜더링됩니다", () => {
    const moalDataTest = {
      chartModal: {
        data: {
          codeCount: 10,
          codeType: "",
          codePosition: "10",
          usedMemory: "1000",
          timeStamp: "20",
        },
        styles: {
          visibility: true,
          top: 0,
          left: 0,
        },
      },
    };

    const mockStore = configureMockStore();
    const store = mockStore(moalDataTest);

    render(
      <Provider store={store}>
        <ChartModal />
      </Provider>,
    );

    expect(screen.getByText("Code Position: 10")).toBeInTheDocument();
  });
});
