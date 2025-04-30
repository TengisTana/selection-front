"use client";
import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, InputNumber, message } from "antd";
import QuestionCard from "@/components/QuestionCard";
import { CreateTest } from "@/app/api/action";
import { TestProps, QuestionProps } from "@/utils/utils";

const EditorPage = () => {
  const [form] = Form.useForm();
  const [test, setTest] = useState<TestProps | null>(null);
  const queryClient = useQueryClient();

  // Mutation for creating a test
  const createTestMutation = useMutation({
    mutationFn: (testData: TestProps) => CreateTest(testData),
    onSuccess: (data) => {
      message.success("Test created successfully!");
      queryClient.invalidateQueries({ queryKey: ["tests"] }); // Invalidate test-related queries
      form.resetFields(); // Reset the form
      setTest(null); // Clear the local test state
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message ||
          "Failed to create test. Please try again."
      );
    },
  });

  // Handle adding a new question
  const addQuestion = useCallback(() => {
    setTest((prevTest) => ({
      ...prevTest,
      Questions: [
        ...(prevTest?.Questions || []),
        {
          Title: "",
          QuestionOrder: (prevTest?.Questions?.length || 0) + 1,
          QuestionType: "MULTI_CHOICE", // Default to MULTI_CHOICE as per example
        },
      ],
    }));
  }, []);

  // Handle form submission to create the test
  const handleCreateTest = () => {
    if (!test?.Title) {
      message.error("Please provide a test title.");
      return;
    }

    // Prepare the request body based on TestProps and example structure
    const testData: TestProps = {
      Title: test.Title,
      Duration: test.Duration,
      Questions: test.Questions?.map((question: QuestionProps) => {
        // Initialize the question object with required fields
        const questionData: Partial<QuestionProps> = {
          QuestionOrder: question.QuestionOrder,
          Title: question.Title,
          QuestionType: question.QuestionType || "MULTI_CHOICE",
        };

        // Only include Options if it exists and is not empty
        if (question.Options && question.Options.length > 0) {
          questionData.Options = question.Options;
        }

        // Only include DefaultCodes if it exists and is not empty
        if (question.DefaultCodes && question.DefaultCodes.length > 0) {
          questionData.DefaultCodes = question.DefaultCodes;
        }

        // Only include TestCases if it exists and is not empty
        if (question.TestCases && question.TestCases.length > 0) {
          questionData.TestCases = question.TestCases;
        }

        return questionData;
      }),
    };

    // Trigger the mutation
    createTestMutation.mutate(testData);
  };

  return (
    <div className="w-[70%] mx-auto bg-[#444] p-4">
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
        <div className="flex gap-2 mt-4">
          <Button onClick={addQuestion}>Add Question</Button>
          <Button
            type="primary"
            onClick={handleCreateTest}
            loading={createTestMutation.isPending}
            disabled={createTestMutation.isPending}
          >
            Create Test
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditorPage;
