"use client";
import { useCallback } from "react";
import { Button, Card, Form, Input, Select } from "antd";
import OptionCard from "./OptionCard";
import TestCaseCard from "./TestCaseCard";
import DefaultCodeEditor from "./DefaultCodeEditor";
import { QuestionCardProps } from "@/utils/componentTypes";
import { DefaultCodeProps } from "@/utils/utils";

const { Option } = Select;

const QuestionCard = ({ id, test, setTest }: QuestionCardProps) => {
  const question = test?.Questions?.[id];
  const { Title, Descr, QuestionText, Options, TestCases, DefaultCodes, QuestionType } =
    question || {};

  const updateQuestionType = (value: string) => {
    const updatedQuestions = [...(test?.Questions || [])];
    updatedQuestions[id] = {
      ...updatedQuestions[id],
      QuestionType: value,
      // Reset options' IsCorrect for SINGLE_CHOICE to ensure only one is correct
      Options: value === "SINGLE_CHOICE"
        ? updatedQuestions[id].Options?.map((opt, index) => ({
            ...opt,
            IsCorrect: index === 0 ? opt.IsCorrect : false,
          }))
        : updatedQuestions[id].Options,
    };
    setTest({ ...test, Questions: updatedQuestions });
  };

  const addOption = useCallback(() => {
    const updatedQuestions = [...(test?.Questions || [])];
    const currentOptions = updatedQuestions[id].Options || [];

    updatedQuestions[id].Options = [
      ...currentOptions,
      {
        OptionText: "",
        IsCorrect: false,
        OptionOrder: currentOptions.length + 1,
      },
    ];

    setTest({ ...test, Questions: updatedQuestions });
  }, [test, id, setTest]);

  const addTestCase = useCallback(() => {
    const updatedQuestions = [...(test?.Questions || [])];
    const currentTestCases = updatedQuestions[id].TestCases || [];

    updatedQuestions[id].TestCases = [
      ...currentTestCases,
      {
        Input: "",
        ExpectedOutput: "",
        TestCaseOrder: currentTestCases.length + 1,
      },
    ];

    setTest({ ...test, Questions: updatedQuestions });
  }, [test, id, setTest]);

  const addDefaultCode = useCallback(() => {
    const updatedQuestions = [...(test?.Questions || [])];
    const currentDefaultCodes = updatedQuestions[id].DefaultCodes || [];

    updatedQuestions[id].DefaultCodes = [
      ...currentDefaultCodes,
      {
        CodeLanguage: "python",
        CodeText: "",
        CodeOrder: currentDefaultCodes.length + 1,
      },
    ];

    setTest({ ...test, Questions: updatedQuestions });
  }, [test, id, setTest]);

  const updateDefaultCode = useCallback(
    (codeIndex: number, field: keyof DefaultCodeProps, value: string) => {
      const updatedQuestions = [...(test?.Questions || [])];
      const updatedDefaultCodes = [
        ...(updatedQuestions[id].DefaultCodes || []),
      ];

      updatedDefaultCodes[codeIndex] = {
        ...updatedDefaultCodes[codeIndex],
        [field]: value,
      };

      updatedQuestions[id].DefaultCodes = updatedDefaultCodes;
      setTest({ ...test, Questions: updatedQuestions });
    },
    [test, id, setTest]
  );

  const deleteDefaultCode = useCallback(
    (codeIndex: number) => {
      const updatedQuestions = [...(test?.Questions || [])];
      const updatedDefaultCodes =
        updatedQuestions[id].DefaultCodes?.filter(
          (_, index) => index !== codeIndex
        ) || [];

      updatedQuestions[id].DefaultCodes = updatedDefaultCodes.map(
        (code, index) => ({
          ...code,
          CodeOrder: index + 1,
        })
      );

      setTest({ ...test, Questions: updatedQuestions });
    },
    [test, id, setTest]
  );

  const deleteQuestion = useCallback(() => {
    const updatedQuestions =
      test?.Questions?.filter((_, index) => index !== id) || [];
    const reorderedQuestions = updatedQuestions.map((q, index) => ({
      ...q,
      QuestionOrder: index + 1,
    }));
    setTest({ ...test, Questions: reorderedQuestions });
  }, [test, id, setTest]);

  return (
    <Card
      title={`Question ${id + 1}`}
      extra={
        <Button danger onClick={deleteQuestion}>
          Delete
        </Button>
      }
    >
      <Form.Item label="Question Type">
        <Select
          value={QuestionType || "SINGLE_CHOICE"}
          onChange={updateQuestionType}
          placeholder="Select question type"
        >
          <Option value="SINGLE_CHOICE">Single Choice</Option>
          <Option value="MULTI_CHOICE">Multiple Choice</Option>
          <Option value="CODE">Code</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Question Title">
        <Input
          value={Title || ""}
          onChange={(e) => {
            setTest({
              ...test,
              Questions: test?.Questions?.map((q, index) =>
                index === id ? { ...q, Title: e.target.value } : q
              ),
            });
          }}
          placeholder="Question Title"
        />
      </Form.Item>
      <Form.Item label="Question Description">
        <Input
          value={Descr || ""}
          onChange={(e) => {
            setTest({
              ...test,
              Questions: test?.Questions?.map((q, index) =>
                index === id ? { ...q, Descr: e.target.value } : q
              ),
            });
          }}
          placeholder="Question Description"
        />
      </Form.Item>
      <Form.Item label="Question Text">
        <Input.TextArea
          value={QuestionText || ""}
          onChange={(e) => {
            setTest({
              ...test,
              Questions: test?.Questions?.map((q, index) =>
                index === id ? { ...q, QuestionText: e.target.value } : q
              ),
            });
          }}
          placeholder="Question Text"
        />
      </Form.Item>
      {QuestionType !== "CODE" && (
        <div className="mb-2">
          <strong>Options:</strong>
          {Options?.map((option, index) => (
            <OptionCard
              key={index}
              option={option}
              questionIndex={id}
              optionIndex={index}
              setTest={setTest}
              test={test}
              questionType={QuestionType || "SINGLE_CHOICE"}
            />
          ))}
          <Button onClick={addOption}>Add Option</Button>
        </div>
      )}
      {QuestionType === "CODE" && (
        <>
          <DefaultCodeEditor
            defaultCodes={DefaultCodes || []}
            questionIndex={id}
            addDefaultCode={addDefaultCode}
            updateDefaultCode={updateDefaultCode}
            deleteDefaultCode={deleteDefaultCode}
          />
          <div className="mb-2">
            <strong>Test Cases:</strong>
            {TestCases?.map((testCase, index) => (
              <TestCaseCard
                key={index}
                testCase={testCase}
                questionIndex={id}
                testCaseIndex={index}
                setTest={setTest}
                test={test}
              />
            ))}
            <Button onClick={addTestCase}>Add Test Case</Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default QuestionCard;