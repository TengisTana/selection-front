"use client";
import { useState, useCallback } from "react";
import { Button, Form, Input, InputNumber } from "antd";
import QuestionCard from "@/components/QuestionCard";
import { TestProps } from "@/utils/utils";

const EditorPage = () => {
  const [form] = Form.useForm();
  const [test, setTest] = useState<TestProps | null>(null);

  const addQuestion = useCallback(() => {
    setTest((prevTest) => ({
      ...prevTest,
      Questions: [
        ...(prevTest?.Questions || []),
        {
          Title: "",
          QuestionOrder: (prevTest?.Questions?.length || 0) + 1,
        },
      ],
    }));
  }, []);

  return (
    <div className="w-[70%] mx-auto">
      <Form form={form} layout="vertical">
        <Form.Item label="Test Title">
          <Input
            value={test?.Title}
            onChange={(e) =>
              setTest({
                ...test,
                Title: e.target.value,
              })
            }
            placeholder="Test title"
          />
        </Form.Item>
        <Form.Item label="Duration">
          <InputNumber
            value={test?.Duration}
            onChange={(e) =>
              setTest({
                ...test,
                Duration: e ?? undefined,
              })
            }
            placeholder="Duration"
          />
        </Form.Item>
        <div className="flex flex-col gap-2">
          {(test?.Questions?.length ?? 0) > 0 &&
            (test?.Questions ?? []).map((question, index) => (
              <QuestionCard
                key={index}
                id={index}
                test={test!}
                setTest={setTest}
              />
            ))}
        </div>
        <Button onClick={addQuestion}>Add Question</Button>
      </Form>
    </div>
  );
};

export default EditorPage;
