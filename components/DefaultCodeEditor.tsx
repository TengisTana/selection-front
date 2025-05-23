"use client";
import AceEditor from "react-ace";
import { Card, Select, Button } from "antd";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import { DefaultCodeProps } from "@/utils/utils";

interface DefaultCodeEditorProps {
  defaultCodes: DefaultCodeProps[];
  questionIndex: number;
  addDefaultCode: () => void;
  updateDefaultCode: (
    codeIndex: number,
    field: keyof DefaultCodeProps,
    value: string
  ) => void;
  deleteDefaultCode: (codeIndex: number) => void;
}

const languageOptions = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
  { value: "c_cpp", label: "C/C++" },
];

const DefaultCodeEditor = ({
  defaultCodes,
  addDefaultCode,
  updateDefaultCode,
  deleteDefaultCode,
}: DefaultCodeEditorProps) => {
  return (
    <div className="mt-4">
      <strong>Default Code</strong>
      {defaultCodes.map((code, index) => (
        <Card
          key={index}
          title={`Default Code ${index + 1}`}
          className="mt-2"
          extra={
            <Button danger onClick={() => deleteDefaultCode(index)}>
              Delete
            </Button>
          }
        >
          <div className="mb-2">
            <Select
              value={code.codeLanguage || "python"}
              onChange={(value) =>
                updateDefaultCode(index, "codeLanguage", value)
              }
              options={languageOptions}
              className="w-32"
            />
          </div>
          <AceEditor
            mode={code.codeLanguage || "python"}
            theme="monokai"
            value={code.codeText || ""}
            onChange={(value) => updateDefaultCode(index, "codeText", value)}
            name={`code-editor-${index}`}
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2,
            }}
            style={{ width: "100%", height: "200px" }}
          />
        </Card>
      ))}
      <Button onClick={addDefaultCode} className="mt-2">
        Add Default Code
      </Button>
    </div>
  );
};

export default DefaultCodeEditor;
