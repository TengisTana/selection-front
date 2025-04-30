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
    const updatedQuestions = [...(test?.Questions || [])];
    const updatedTestCases = [
      ...(updatedQuestions[questionIndex]?.TestCases || []),
    ];

    updatedTestCases[testCaseIndex] = {
      ...updatedTestCases[testCaseIndex],
      [key]: value,
    };

    updatedQuestions[questionIndex].TestCases = updatedTestCases;
    setTest({ ...test, Questions: updatedQuestions });
  };

  const deleteTestCase = () => {
    const updatedQuestions = [...(test?.Questions || [])];
    const updatedTestCases =
      updatedQuestions[questionIndex].TestCases?.filter(
        (_, index) => index !== testCaseIndex
      ) || [];
    updatedQuestions[questionIndex].TestCases = updatedTestCases.map(
      (tc, index) => ({
        ...tc,
        TestCaseOrder: index + 1,
      })
    );

    setTest({ ...test, Questions: updatedQuestions });
  };

  return (
    <div className="mb-2 p-2 border rounded">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Input
          placeholder="Input"
          value={testCase.Input || ""}
          onChange={(e) => updateTestCase("Input", e.target.value)}
        />
        <Input
          placeholder="Expected Output"
          value={testCase.ExpectedOutput || ""}
          onChange={(e) => updateTestCase("ExpectedOutput", e.target.value)}
        />
        <Button danger onClick={deleteTestCase}>
          Delete
        </Button>
      </Space>
    </div>
  );
};

export default TestCaseCard;
