import styled from "styled-components";

const Div = styled.div`
  background-color: black;
  color: white;
  height: 200px;
  margin: 30px;
  padding: 30px;
  border-radius: 20px;
  overflow: scroll;
`;

export default function CodeResult() {
  return <Div>함수 실행 결과</Div>;
}
