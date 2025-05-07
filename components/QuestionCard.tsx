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
  const question = test?.questions?.[id];
  const {
    title,
    descr,
    questionText,
    options,
    testCases,
    defaultCodes,
    questionType,
  } = question || {};

  const updateQuestionType = (value: string) => {
    const updatedQuestions = [...(test?.questions || [])];
    updatedQuestions[id] = {
      ...updatedQuestions[id],
      questionType: value,
      options:
        value === "SINGLE_CHOICE"
          ? updatedQuestions[id].options?.map((opt, index) => ({
              ...opt,
              isCorrect: index === 0 ? opt.isCorrect : false,
            }))
          : updatedQuestions[id].options,
    };
    setTest({ ...test, questions: updatedQuestions });
  };

  const addOption = useCallback(() => {
    const updatedQuestions = [...(test?.questions || [])];
    const currentOptions = updatedQuestions[id].options || [];

    updatedQuestions[id].options = [
      ...currentOptions,
      {
        optionText: "",
        isCorrect: false,
        optionOrder: currentOptions.length + 1,
      },
    ];

    setTest({ ...test, questions: updatedQuestions });
  }, [test, id, setTest]);

  const addTestCase = useCallback(() => {
    const updatedQuestions = [...(test?.questions || [])];
    const currentTestCases = updatedQuestions[id].testCases || [];

    updatedQuestions[id].testCases = [
      ...currentTestCases,
      {
        input: "",
        expectedOutput: "",
        testCaseOrder: currentTestCases.length + 1,
      },
    ];

    setTest({ ...test, questions: updatedQuestions });
  }, [test, id, setTest]);

  const addDefaultCode = useCallback(() => {
    const updatedQuestions = [...(test?.questions || [])];
    const currentDefaultCodes = updatedQuestions[id].defaultCodes || [];

    updatedQuestions[id].defaultCodes = [
      ...currentDefaultCodes,
      {
        codeLanguage: "python",
        codeText: "",
        defaultCodeOrder: currentDefaultCodes.length + 1,
      },
    ];

    setTest({ ...test, questions: updatedQuestions });
  }, [test, id, setTest]);

  const updateDefaultCode = useCallback(
    (codeIndex: number, field: keyof DefaultCodeProps, value: string) => {
      const updatedQuestions = [...(test?.questions || [])];
      const updatedDefaultCodes = [
        ...(updatedQuestions[id].defaultCodes || []),
      ];

      updatedDefaultCodes[codeIndex] = {
        ...updatedDefaultCodes[codeIndex],
        [field]: value,
      };

      updatedQuestions[id].defaultCodes = updatedDefaultCodes;
      setTest({ ...test, questions: updatedQuestions });
    },
    [test, id, setTest]
  );

  const deleteDefaultCode = useCallback(
    (codeIndex: number) => {
      const updatedQuestions = [...(test?.questions || [])];
      const updatedDefaultCodes =
        updatedQuestions[id].defaultCodes?.filter(
          (_, index) => index !== codeIndex
        ) || [];

      updatedQuestions[id].defaultCodes = updatedDefaultCodes.map(
        (code, index) => ({
          ...code,
          defaultCodeOrder: index + 1,
        })
      );

      setTest({ ...test, questions: updatedQuestions });
    },
    [test, id, setTest]
  );

  const deleteQuestion = useCallback(() => {
    const updatedQuestions =
      test?.questions?.filter((_, index) => index !== id) || [];
    const reorderedQuestions = updatedQuestions.map((q, index) => ({
      ...q,
      questionOrder: index + 1,
    }));
    setTest({ ...test, questions: reorderedQuestions });
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
          value={questionType || "SINGLE_CHOICE"}
          onChange={updateQuestionType}
          placeholder="Select question type"
        >
          <Option value="SINGLE_CHOICE">Single Choice</Option>
          <Option value="MULTI_CHOICE">Multiple Choice</Option>
          <Option value="CODE">Code</Option>
          <Option value="TEXT">Text</Option>
        </Select>
      </Form.Item>
      <Form.Item label="Question Title">
        <Input
          value={title || ""}
          onChange={(e) => {
            setTest({
              ...test,
              questions: test?.questions?.map((q, index) =>
                index === id ? { ...q, title: e.target.value } : q
              ),
            });
          }}
          placeholder="Question Title"
        />
      </Form.Item>
      <Form.Item label="Question Description">
        <Input
          value={descr || ""}
          onChange={(e) => {
            setTest({
              ...test,
              questions: test?.questions?.map((q, index) =>
                index === id ? { ...q, descr: e.target.value } : q
              ),
            });
          }}
          placeholder="Question Description"
        />
      </Form.Item>
      <Form.Item label="Question Text">
        <Input.TextArea
          value={questionText || ""}
          onChange={(e) => {
            setTest({
              ...test,
              questions: test?.questions?.map((q, index) =>
                index === id ? { ...q, questionText: e.target.value } : q
              ),
            });
          }}
          placeholder="Question Text"
        />
      </Form.Item>
      {questionType === "TEXT" && <div>aa</div>}
      {(questionType === "MULTI_CHOICE" ||
        questionType === "SINGLE_CHOICE") && (
        <div className="mb-2">
          <strong>Options:</strong>
          {options?.map((option, index) => (
            <OptionCard
              key={index}
              option={option}
              questionIndex={id}
              optionIndex={index}
              setTest={setTest}
              test={test}
              questionType={questionType || "SINGLE_CHOICE"}
            />
          ))}
          <Button onClick={addOption}>Add Option</Button>
        </div>
      )}
      {questionType === "CODE" && (
        <>
          <DefaultCodeEditor
            defaultCodes={defaultCodes || []}
            questionIndex={id}
            addDefaultCode={addDefaultCode}
            updateDefaultCode={updateDefaultCode}
            deleteDefaultCode={deleteDefaultCode}
          />
          <div className="mb-2">
            <strong>Test Cases:</strong>
            {testCases?.map((testCase, index) => (
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
