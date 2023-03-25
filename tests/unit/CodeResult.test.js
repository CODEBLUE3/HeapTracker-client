/**
 * @jest-environment jsdom
 */
import React from "react";
import { cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import CodeResult from "../../src/component/CodeResult";

afterEach(cleanup);

test("CodeResult init", () => {
  const { getByTestId } = render(<CodeResult result="" />);

  const codeResult = getByTestId("code-result");

  expect(codeResult).toHaveTextContent("ready");
});

test("CodeResult success", () => {
  const { getByTestId } = render(
    <CodeResult result={{ isError: false, result: 10 }} />,
  );

  const codeResult = getByTestId("code-result");

  expect(codeResult).toHaveTextContent("success");
  expect(codeResult).toHaveTextContent(10);
});

test("CodeResult failed", () => {
  const { getByTestId } = render(
    <CodeResult result={{ isError: true, result: "try error test" }} />,
  );

  const codeResult = getByTestId("code-result");

  expect(codeResult).toHaveTextContent("code exec failed");
  expect(codeResult).toHaveTextContent("try error test");
});
