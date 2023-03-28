import styled from "styled-components";
import { style } from "../styles/styleCode";

const Terminal = styled.div`
  height: 7vh;

  margin: ${style.defaultComponentMargin};
  margin-top: 15px;
  padding: 5px;
  border: 2px solid ${(props) => props.theme.defaultBorder};

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
