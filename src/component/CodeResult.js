import styled from "styled-components";

const Terminal = styled.div`
  background-color: black;
  color: white;
  height: 200px;
  margin: 30px;
  padding: 30px;
  border-radius: 20px;
  overflow: scroll;
`;

export default function CodeResult({ result }) {
  return <Terminal>{result}</Terminal>;
}
