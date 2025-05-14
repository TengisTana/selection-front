"use client";

import { useState, useEffect } from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/theme-monokai";
import { Button, Select } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { CompilerProps, TestResult } from "@/utils/componentTypes";

type Language = "javascript" | "python" | "java" | "c_cpp";

const Compiler = ({
  testCases,
  defaultCodes,
  onCodeChange,
}: CompilerProps & {
  onCodeChange?: (answer: { codeSubmission: string; codeLanguage: string; testResults: { testCaseId: string; ActualOutput: string; Passed: boolean }[] }) => void;
}) => {
  const [code, setCode] = useState<string>("");
  const [language, setLanguage] = useState<Language>("javascript");
  const [testResults, setTestResults] = useState<{ testCaseId: string; ActualOutput: string; Passed: boolean }[]>([]);

  const languages: Language[] = ["javascript", "python", "java", "c_cpp"];

  useEffect(() => {
    if (defaultCodes) {
      const selectedCode = defaultCodes.find(
        (code) => code.codeLanguage === language
      );
      setCode(selectedCode?.codeText || "");
    } else {
      setCode("");
    }
  }, [language, defaultCodes]);

  const handleRun = async () => {
    const response = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        language,
        testCases,
      }),
    });
    const results: TestResult[] = await response.json();
    const formattedResults = results.map((result, index) => ({
      testCaseId: testCases[index]?.testCaseId || `test-${index + 1}`, // Fallback to index-based ID if testCaseId is not provided
      ActualOutput: result.actualOutput,
      Passed: result.passed,
    }));
    setTestResults(formattedResults);
    if (onCodeChange) {
      onCodeChange({
        codeSubmission: code,
        codeLanguage: language,
        testResults: formattedResults,
      });
    }
  };

  return (
    <div className="p-5 flex flex-col gap-4 border rounded-xl mt-5">
      <div>
        <Select
          value={language}
          onChange={(value: Language) => setLanguage(value)}
          suffixIcon={<DownOutlined style={{ color: "white" }} />}
        >
          {languages.map((lang) => (
            <Select.Option key={lang} value={lang}>
              {lang}
            </Select.Option>
          ))}
        </Select>
      </div>
      <AceEditor
        mode={language}
        theme="monokai"
        value={code}
        onChange={(newCode) => {
          setCode(newCode);
          if (onCodeChange) {
            onCodeChange({
              codeSubmission: newCode,
              codeLanguage: language,
              testResults,
            });
          }
        }}
        width="100%"
        height="400px"
        setOptions={{ fontSize: "14px" }}
      />
      <div>
        <Button
          onClick={handleRun}
          className="!bg-[#262626] !text-white !text-semibold"
        >
          Run tests
        </Button>
      </div>
      {testResults.length > 0 && (
        <div className="mt-4">
          <h3>Test Results:</h3>
          <div className="flex flex-col gap-2">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`${
                  result.Passed ? "bg-green-400" : "bg-red-400"
                } p-4 rounded-xl`}
              >
                <p>
                  <strong>Test Case {index + 1}</strong>
                </p>
                <p>Test Case ID: {result.testCaseId}</p>
                <p>Actual Output: {result.ActualOutput}</p>
                <p>Status: {result.Passed ? "Passed" : "Failed"}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Compiler;