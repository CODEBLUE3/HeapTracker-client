import styled from "styled-components";
import { color, style } from "../styles/styleCode";

const Terminal = styled.div`
  background-color: black;
  color: ${color.defaultBoxBackground};
  height: 200px;
  margin: 30px;
  padding: 30px;
  border-radius: ${style.borderRadius};
  overflow: scroll;
`;

export default function CodeResult({ result }) {
  return <Terminal>{result}</Terminal>;
}
