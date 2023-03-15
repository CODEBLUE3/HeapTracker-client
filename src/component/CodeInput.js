import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

export default function CodeInput() {
  return (
    <div>
      <div>코드 입력</div>
      <CodeMirror
        value="CodeInput"
        height="200px"
        extensions={[javascript({ jsx: true })]}
      />
    </div>
  );
}
