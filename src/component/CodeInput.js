import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

export default function CodeInput({ value, onChange }) {
  return (
    <>
      <div>코드 입력</div>
      <CodeMirror
        value={value}
        height="200px"
        extensions={[javascript({ jsx: false })]}
        onChange={onChange}
      />
    </>
  );
}
