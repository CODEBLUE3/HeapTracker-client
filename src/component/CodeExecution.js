import CodeEditor from "./CodeEditor";

export default function CodeExecution({ value, onChange }) {
  return (
    <CodeEditor
      value={value}
      onChange={onChange}
      height="70px"
      width="85%"
      testId="codemirror"
    />
  );
}
