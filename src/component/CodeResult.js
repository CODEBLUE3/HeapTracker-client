import styled from "styled-components";

const Terminal = styled.div`
  background-color: black;
  height: 200px;
  margin: 30px;
  padding: 30px;
  border-radius: 20px;
  overflow: scroll;
`;

export default function CodeResult({ result }) {
  return (
    <Terminal style={{ color: result.isError ? "red" : "white" }}>
      code exec success : {result.isError ? "failed" : "ok"}
      <br></br>
      {result.result}
    </Terminal>
  );
}
