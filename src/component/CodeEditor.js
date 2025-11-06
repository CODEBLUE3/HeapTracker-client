import { useSelector } from "react-redux";
import styled from "styled-components";
import { javascript } from "@codemirror/lang-javascript";
import CodeMirror from "@uiw/react-codemirror";

/**
 * CodeEditor - Reusable code editor component
 *
 * A unified CodeMirror wrapper component that can be configured
 * with different dimensions and settings.
 *
 * @param {string} value - The code content
 * @param {function} onChange - Callback when code changes
 * @param {string} height - Editor height (default: "450px")
 * @param {string} minHeight - Minimum editor height (optional)
 * @param {string} width - Editor width (default: "100%")
 * @param {string} testId - Test ID for testing (optional)
 */
export default function CodeEditor({
  value,
  onChange,
  height = "450px",
  minHeight,
  width = "100%",
  testId,
}) {
  const theme = useSelector((state) => state.appTheme.colorTheme);

  return (
    <CodeContainer width={width} height={height}>
      <CodeMirror
        data-testid={testId}
        value={value}
        height={height}
        minHeight={minHeight}
        extensions={[javascript({ jsx: false })]}
        onChange={onChange}
        theme={theme}
      />
    </CodeContainer>
  );
}

const CodeContainer = styled.div`
  flex-direction: column;
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  box-shadow: 0 0 10px ${(props) => props.theme.defaultBorder};
`;
