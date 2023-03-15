import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

export default function CodeExecution() {
  return (
    <div>
      <div>코드 실행문 입력</div>
      <CodeMirror
        value="CodeExecution"
        height="100px"
        extensions={[javascript({ jsx: true })]}
      />
    </div>
  );
}
