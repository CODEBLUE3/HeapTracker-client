//import renderer from "react-test-renderer";
import React from "react";
import { cleanup, render } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import CodeResult from "../component/CodeResult";

afterEach(cleanup);

test("CodeResult success", () => {
  const { getByTestId } = render(
    <CodeResult result={{ isError: false, result: 10 }} />,
  );

  const codeResult = getByTestId("codeResult");
  expect(codeResult).toHaveTextContent("success");
  expect(codeResult).toHaveTextContent(10);
});

test("CodeResult failed", () => {
  const { getByTestId } = render(
    <CodeResult result={{ isError: true, result: "try error test" }} />,
  );

  const codeResult = getByTestId("codeResult");
  expect(codeResult).toHaveTextContent("code exec failed");
  expect(codeResult).toHaveTextContent("try error test");
});
