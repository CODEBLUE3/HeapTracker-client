import CodeEditor from "./CodeEditor";

export default function CodeInput({ value, onChange }) {
  return (
    <CodeEditor
      value={value}
      onChange={onChange}
      height="450px"
      minHeight="400px"
      testId="codemirror-input"
    />
  );
}
