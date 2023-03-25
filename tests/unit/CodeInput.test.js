import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import CodeInput from "../../src/component/CodeInput";

describe("ChartInput Component Test", () => {
  test("value와 onChange 이벤트 없이 랜더링됩니다", () => {
    render(<CodeInput />);

    const codeMirror = screen.getByTestId("codemirror-input");

    expect(codeMirror).toBeInTheDocument();
  });

  test("value와 onChange props가 있을 때 동작합니다", () => {
    const onChangeMock = jest.fn();
    const inputValue = "new input value";

    render(<CodeInput value={inputValue} onChange={onChangeMock} />);

    const editor = screen.getByTestId("codemirror-input");

    expect(editor).toHaveTextContent("new input value");
  });
});
