import styled from "styled-components";
import { style } from "../styles/styleCode";

const Terminal = styled.div`
  height: 7vh;
  padding: 10px;
  box-shadow: 0 0 10px ${(props) => props.theme.defaultBorder};

  color: ${(props) => props.theme.defaultFont};
  background-color: ${(props) => props.theme.boxBackground};

  word-break: break-all;
`;

export default function CodeResult({ result }) {
  return (
    <Terminal
      data-testid="code-result"
      style={{ color: result.isError && "red" }}
    >
      {result.result
        ? `code exec ${result.isError ? "failed" : "success"}`
        : "ready..."}
      <br />
      {result.result}
    </Terminal>
  );
}
