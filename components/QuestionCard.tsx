"use client";
import { useCallback } from "react";
import { Button, Card, Form, Input } from "antd";
import OptionCard from "./OptionCard";
import DefaultCodeEditor from "./DefaultCodeEditor";
import { QuestionCardProps } from "@/utils/componentTypes";

const QuestionCard = ({ id, test, setTest }: QuestionCardProps) => {
  const question = test?.Questions?.[id];
  const { Title, Descr, Options } = question || {};

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
      <Form.Item>
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
        />
      </Form.Item>
      <Form.Item>
        <Input.TextArea
          value={Descr || ""}
          onChange={(e) => {
            setTest({
              ...test,
              Questions: test?.Questions?.map((q, index) =>
                index === id ? { ...q, Descr: e.target.value } : q
              ),
            });
          }}
        />
      </Form.Item>

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
          />
        ))}
        <Button onClick={addOption}>Add Option</Button>
      </div>

      <DefaultCodeEditor test={test} setTest={setTest} questionIndex={id} />
    </Card>
  );
};

export default QuestionCard;