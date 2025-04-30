"use client";
import { useState, useCallback, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button, Form, Input, InputNumber, message } from "antd";
import { useParams } from "next/navigation";
import QuestionCard from "@/components/QuestionCard";
import { CreateTest, GetTestById, UpdateTestById } from "@/app/api/action";
import { TestProps, QuestionProps } from "@/utils/utils";

const EditorPage = () => {
  const [form] = Form.useForm();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";
  const queryClient = useQueryClient();

  // Initialize test state
  const [test, setTest] = useState<TestProps | null>(
    isNew ? { title: "", duration: undefined, questions: [] } : null
  );

  console.log(test);

  // Fetch test data if editing an existing test
  const {
    data: fetchedTest,
    isLoading,
    error,
  } = useQuery<TestProps>({
    queryKey: ["test", id],
    queryFn: () => GetTestById(id),
    enabled: !isNew,
  });

  // Handle fetched test data
  useEffect(() => {
    if (fetchedTest) {
      setTest(fetchedTest);
      form.setFieldsValue({
        Title: fetchedTest.title,
        Duration: fetchedTest.duration,
      });
    }
  }, [fetchedTest, form]);

  // Handle fetch error
  useEffect(() => {
    if (error) {
      message.error(
        (error as any).response?.data?.message ||
          "Failed to fetch test. Please try again."
      );
    }
  }, [error]);

  // Mutation for creating a test
  const createTestMutation = useMutation({
    mutationFn: (testData: TestProps) => CreateTest(testData),
    onSuccess: () => {
      message.success("Test created successfully!");
      queryClient.invalidateQueries({ queryKey: ["tests"] });
      form.resetFields();
      setTest({ title: "", duration: undefined, questions: [] });
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message ||
          "Failed to create test. Please try again."
      );
    },
  });

  // Mutation for updating a test
  const updateTestMutation = useMutation({
    mutationFn: (testData: TestProps) => UpdateTestById(id, testData),
    onSuccess: () => {
      message.success("Test updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["test", id] });
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message ||
          "Failed to update test. Please try again."
      );
    },
  });

  // Handle adding a new question
  const addQuestion = useCallback(() => {
    setTest((prevTest) => ({
      ...prevTest,
      questions: [
        ...(prevTest?.questions || []),
        {
          title: "",
          questionOrder: (prevTest?.questions?.length || 0) + 1,
          questionType: "MULTI_CHOICE",
        },
      ],
    }));
  }, []);

  // Handle form submission (create or update)
  const handleSubmit = () => {
    if (!test?.title) {
      message.error("Please provide a test title.");
      return;
    }

    // Prepare the request body
    const testData: TestProps = {
      title: test.title,
      duration: test.duration,
      questions: test.questions?.map((question: QuestionProps) => {
        const questionData: Partial<QuestionProps> = {
          questionId: question.questionId,
          questionOrder: question.questionOrder,
          title: question.title,
          descr: question.descr,
          questionText: question.questionText,
          questionType: question.questionType || "MULTI_CHOICE",
        };

        if (question.options && question.options.length > 0) {
          questionData.options = question.options;
        }

        if (question.defaultCodes && question.defaultCodes.length > 0) {
          questionData.defaultCodes = question.defaultCodes;
        }

        if (question.testCases && question.testCases.length > 0) {
          questionData.testCases = question.testCases;
        }

        return questionData;
      }),
    };

    // Trigger create or update mutation
    if (isNew) {
      createTestMutation.mutate(testData);
    } else {
      updateTestMutation.mutate(testData);
    }
  };

  // Show loading state while fetching data
  if (!isNew && isLoading) {
    return <div>Loading test data...</div>;
  }

  return (
    <div className="w-[70%] mx-auto bg-[#444] p-4">
      <h2>{isNew ? "Create New Test" : "Edit Test"}</h2>
      <Form form={form} layout="vertical">
        <Form.Item label="Test Title" name="Title">
          <Input
            value={test?.title}
            onChange={(e) =>
              setTest({
                ...test,
                title: e.target.value,
              })
            }
            placeholder="Test title"
          />
        </Form.Item>
        <Form.Item label="Duration" name="Duration">
          <InputNumber
            value={test?.duration}
            onChange={(value) =>
              setTest({
                ...test,
                duration: value ?? undefined,
              })
            }
            placeholder="Duration"
          />
        </Form.Item>
        <div className="flex flex-col gap-2">
          {(test?.questions?.length ?? 0) > 0 &&
            (test?.questions ?? []).map((question, index) => (
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
            onClick={handleSubmit}
            loading={
              createTestMutation.isPending || updateTestMutation.isPending
            }
            disabled={
              createTestMutation.isPending || updateTestMutation.isPending
            }
          >
            {isNew ? "Create Test" : "Update Test"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default EditorPage;
