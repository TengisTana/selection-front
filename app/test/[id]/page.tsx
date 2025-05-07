"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Button, Divider, Skeleton } from "antd";
import AnswerCard from "@/components/AnswerCard";
import { GetTestForTest } from "@/app/api/action";
import { TestProps } from "@/utils/utils";

export default function TestPage() {
  const params = useParams();
  const id = params.id as string;
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [step, setStep] = useState<"START" | "TEST" | "END">("START");
  const [test, setTest] = useState<TestProps | null>(null);

  console.log(answers);

  const { data, isLoading, error } = useQuery({
    queryKey: ["test", id],
    queryFn: () => GetTestForTest(id),
    enabled: true,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (data) {
      setTest(data);
      if (data.duration) {
        setTimeLeft(data.duration * 60);
      }
    }
  }, [data]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const attemptedCount = Object.keys(answers).length;

  const handleAnswerChange = useCallback((questionId: string, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  }, []);

  const startTest = () => {
    setStep("TEST");
    setTimeLeft((test?.duration ?? 0) * 60);
    setIsTimerRunning(true);
  };

  const endTest = async () => {
    setStep("END");
    setIsTimerRunning(false);
  };

  if (isLoading) {
    return <Skeleton />;
  }

  if (error) {
    return <div>Error</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {step === "START" && (
        <div className="mx-auto mt-10 flex flex-col items-center justify-center text-center p-10 bg-[#424242] rounded">
          <h1 className="fon-bold text-2xl">{test?.title}</h1>
          <Divider className="!border-white" />
          <div className="flex flex-col gap-4">
            <div>
              <p>Test duration: {test?.duration}</p>
              <p>Questions: {test?.questions?.length}</p>
            </div>
            <Button
              onClick={startTest}
              className="!bg-[#262626] !text-white !hover:text-white"
            >
              Start Challenge
            </Button>
          </div>
        </div>
      )}

      {step === "TEST" && (
        <div>
          <div className="fixed top-0 left-0 w-full bg-gray-800 text-white p-4 z-10 shadow-md">
            <div className="mx-auto max-w-7xl flex justify-between items-center">
              <h1 className="text-lg font-bold">{test?.title}</h1>
              <div className="flex gap-6">
                <span>
                  Attempted: {attemptedCount} / {test?.questions?.length}
                </span>
                <span>Time Remaining: {formatTime(timeLeft)}</span>
              </div>
              <Button
                onClick={endTest}
                className="!bg-[#262626] !text-white !hover:text-white"
              >
                I am done with the test
              </Button>
            </div>
          </div>
          <div className="mx-auto max-w-7xl flex flex-col gap-12 min-h-screen my-6 pt-20">
            {test?.questions?.map((card) => (
              <AnswerCard
                key={card.questionId}
                {...card}
                onAnswerChange={(answer: any) =>
                  handleAnswerChange(card.questionId ?? "", answer)
                }
              />
            ))}
          </div>
        </div>
      )}

      {step === "END" && (
        <div className="mx-auto mt-10 flex flex-col items-center justify-center text-center p-10 bg-[#424242] rounded gap-4">
          <p>Your test has been successfully submitted</p>
        </div>
      )}
    </div>
  );
}
