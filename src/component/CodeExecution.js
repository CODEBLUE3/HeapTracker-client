import styled from "styled-components";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { useSelector } from "react-redux";

const CodeContainer = styled.div`
  flex-direction: column;
  width: 85%;
  height: 70px;
  border: 2px solid ${(props) => props.theme.defaultBorder};
`;

export default function CodeExecution({ value, onChange }) {
  const theme = useSelector((state) => state.appGlobal.colorTheme);

  return (
    <CodeContainer>
      <CodeMirror
        value={value}
        height="70px"
        extensions={[javascript({ jsx: false })]}
        onChange={onChange}
        data-testid="codemirror"
        theme={theme}
      />
    </CodeContainer>
  );
}
