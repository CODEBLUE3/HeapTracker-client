import React from "react";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import CodeExecution from "../../src/component/CodeExecution";

describe("CodeExecution Component Test", () => {
  test("value와 onChange 이벤트 없이 렌더링됩니다", () => {
    render(<CodeExecution />);
    expect(screen.getByTestId("codemirror")).toBeInTheDocument();
  });

  test("value와 onChange props가 있을 때 동작합니다", () => {
    const onChangeMock = jest.fn();
    const { rerender } = render(<CodeExecution />);

    rerender(<CodeExecution value="new value" onChange={onChangeMock} />);

    expect(screen.getByTestId("codemirror")).toHaveTextContent(/new value/);
  });
});
