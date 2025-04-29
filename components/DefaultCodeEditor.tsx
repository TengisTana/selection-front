"use client";
import { useCallback, useState } from "react";
import { Button, Card, Select } from "antd";
import AceEditor from "react-ace";
import { TestProps, DefaultCodeProps } from "@/utils/utils";

// Import necessary Ace editor modes and theme
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";

interface DefaultCodeEditorProps {
  test: TestProps;
  setTest: (test: TestProps) => void;
  questionIndex: number;
}

const languageOptions = [
  { value: "python", label: "Python" },
  { value: "javascript", label: "JavaScript" },
  { value: "java", label: "Java" },
  { value: "c_cpp", label: "C/C++" },
];

const DefaultCodeEditor = ({ test, setTest, questionIndex }: DefaultCodeEditorProps) => {
  const question = test?.Questions?.[questionIndex];
  const [defaultCodes, setDefaultCodes] = useState<DefaultCodeProps[]>(
    question?.DefaultCodes || []
  );

  const addDefaultCode = useCallback(() => {
    const newCode: DefaultCodeProps = {
      CodeLanguage: "python",
      CodeText: "",
      CodeOrder: defaultCodes.length + 1,
    };

    const updatedCodes = [...defaultCodes, newCode];
    setDefaultCodes(updatedCodes);

    const updatedQuestions = [...(test?.Questions || [])];
    updatedQuestions[questionIndex] = {
      ...updatedQuestions[questionIndex],
      DefaultCodes: updatedCodes,
    };

    setTest({ ...test, Questions: updatedQuestions });
  }, [defaultCodes, test, questionIndex, setTest]);

  const updateDefaultCode = useCallback(
    (index: number, field: keyof DefaultCodeProps, value: string) => {
      const updatedCodes = [...defaultCodes];
      updatedCodes[index] = {
        ...updatedCodes[index],
        [field]: value,
      };

      setDefaultCodes(updatedCodes);

      const updatedQuestions = [...(test?.Questions || [])];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        DefaultCodes: updatedCodes,
      };

      setTest({ ...test, Questions: updatedQuestions });
    },
    [defaultCodes, test, questionIndex, setTest]
  );

  const deleteDefaultCode = useCallback(
    (index: number) => {
      const updatedCodes = defaultCodes
        .filter((_, i) => i !== index)
        .map((code, i) => ({
          ...code,
          CodeOrder: i + 1,
        }));

      setDefaultCodes(updatedCodes);

      const updatedQuestions = [...(test?.Questions || [])];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        DefaultCodes: updatedCodes,
      };

      setTest({ ...test, Questions: updatedQuestions });
    },
    [defaultCodes, test, questionIndex, setTest]
  );

  return (
    <div className="mt-4">
      <strong>[Default Code]</strong>
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
              value={code.CodeLanguage || "python"}
              onChange={(value) => updateDefaultCode(index, "CodeLanguage", value)}
              options={languageOptions}
              className="w-32"
            />
          </div>
          <AceEditor
            mode={code.CodeLanguage || "python"}
            theme="monokai"
            value={code.CodeText || ""}
            onChange={(value) => updateDefaultCode(index, "CodeText", value)}
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