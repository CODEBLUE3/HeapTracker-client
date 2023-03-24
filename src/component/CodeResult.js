import styled from "styled-components";
import { color, style } from "../styles/styleCode";

const Terminal = styled.div`
  background-color: black;
  color: ${color.defaultBoxBackground};
  height: 10%;
  margin: ${style.defaultComponentMargin};
  margin-top: 15px;
  padding: 5px;
  word-break: break-all;
`;

export default function CodeResult({ result }) {
  return (
    <Terminal
      data-testid="code-result"
      style={{ color: result.isError ? "red" : "white" }}
    >
      {result.result
        ? `code exec ${result.isError ? "failed" : "success"}`
        : "ready..."}
      <br />
      {result.result}
    </Terminal>
  );
}
