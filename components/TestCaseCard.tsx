"use client";
import { Input, Space, Button } from "antd";
import { TestCaseProps, TestProps } from "@/utils/utils";

interface TestCaseCardProps {
  testCase: TestCaseProps;
  questionIndex: number;
  testCaseIndex: number;
  test: TestProps | null;
  setTest: (test: TestProps | null) => void;
}

const TestCaseCard = ({
  testCase,
  questionIndex,
  testCaseIndex,
  test,
  setTest,
}: TestCaseCardProps) => {
  const updateTestCase = (key: keyof TestCaseProps, value: any) => {
    const updatedQuestions = [...(test?.questions || [])];
    const updatedTestCases = [
      ...(updatedQuestions[questionIndex]?.testCases || []),
    ];

    updatedTestCases[testCaseIndex] = {
      ...updatedTestCases[testCaseIndex],
      [key]: value,
    };

    updatedQuestions[questionIndex].testCases = updatedTestCases;
    setTest({ ...test, questions: updatedQuestions });
  };

  const deleteTestCase = () => {
    const updatedQuestions = [...(test?.questions || [])];
    const updatedTestCases =
      updatedQuestions[questionIndex].testCases?.filter(
        (_, index) => index !== testCaseIndex
      ) || [];
    updatedQuestions[questionIndex].testCases = updatedTestCases.map(
      (tc, index) => ({
        ...tc,
        testCaseOrder: index + 1,
      })
    );

    setTest({ ...test, questions: updatedQuestions });
  };

  return (
    <div className="mb-2 p-2 border rounded">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Input
          placeholder="Input"
          value={testCase.input || ""}
          onChange={(e) => updateTestCase("input", e.target.value)}
        />
        <Input
          placeholder="Expected Output"
          value={testCase.expectedOutput || ""}
          onChange={(e) => updateTestCase("expectedOutput", e.target.value)}
        />
        <Button danger onClick={deleteTestCase}>
          Delete
        </Button>
      </Space>
    </div>
  );
};

export default TestCaseCard;
