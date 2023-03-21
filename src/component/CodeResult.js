import styled from "styled-components";
import { color, style } from "../styles/styleCode";

const Terminal = styled.div`
  background-color: black;
  color: ${color.defaultBoxBackground};
  height: 10%;
  margin: 10px;
  padding: 5px;
  overflow: scroll;
`;

export default function CodeResult({ result }) {
  return (
    <Terminal style={{ color: result.isError ? "red" : "white" }}>
      {result.result
        ? `code exec ${result.isError ? "failed" : "success"}`
        : "ready..."}
      <br />
      {result.result}
    </Terminal>
  );
}
