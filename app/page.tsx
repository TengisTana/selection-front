"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Divider } from "antd";
import AnswerCard from "@/components/AnswerCard";

const testData = {
  title: "Хөгжүүлэгчийн шалгалтын тест",
  time: 30,
  endTitle: "Engineer test",
};

const exampleAnswerCards = [
  {
    number: 1,
    title: "History Trivia",
    description: "Test your knowledge of historical events.",
    question: "Who was the first President of the United States?",
    content: "",
    options: [
      "Abraham Lincoln",
      "George Washington",
      "Thomas Jefferson",
      "John Adams",
    ],
    questionType: "SINGLE_CHOICE",
    testCases: [],
  },
  {
    number: 2,
    title: "Reverse String",
    description: "Write a function to reverse a given string.",
    question: "Complete the function to reverse the input string.",
    content: "",
    options: [],
    questionType: "WRITE_CODE",
    testCases: [
      { input: "hello", expectedOutput: "olleh" },
      { input: "world", expectedOutput: "dlrow" },
      { input: "", expectedOutput: "" },
    ],
    defaultCode: {
      javascript: `function reverseString(str) {\n    return "";\n}`,
      python: `def reverseString(str):\n    return ""`,
      java: `public class Solution {\n    public static String reverseString(String str) {\n        return "";\n    }\n}`,
      c_cpp: `#include <string>\nstd::string reverseString(std::string str) {\n    return "";\n}`,
    },
  },
  {
    number: 3,
    title: "Science Fact",
    description: "Answer a basic science question.",
    question: "What gas do plants primarily use for photosynthesis?",
    content: "",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    questionType: "MULTI_CHOICE",
    optionNumber: "TWO",
    testCases: [],
  },
  {
    number: 4,
    title: "Palindrome Checker",
    description: "Write a function to check if a string is a palindrome.",
    question:
      "Complete the function to return true if the string is a palindrome, false otherwise.",
    content: "",
    options: [],
    questionType: "WRITE_CODE",
    testCases: [
      { input: "racecar", expectedOutput: "true" },
      { input: "hello", expectedOutput: "false" },
      { input: "A man a plan a canal Panama", expectedOutput: "true" },
    ],
    defaultCode: {
      javascript: `function isPalindrome(str) {\n    return false;\n}`,
      python: `def isPalindrome(str):\n    return False`,
      java: `public class Solution {\n    public static boolean isPalindrome(String str) {\n        return false;\n    }\n}`,
      c_cpp: `#include <string>\nbool isPalindrome(std::string str) {\n    return false;\n}`,
    },
  },
  {
    number: 5,
    title: "Short Essay",
    description: "Provide a brief response to the prompt.",
    question: "In a few sentences, explain why recycling is important.",
    content: "",
    options: [],
    questionType: "TEXT",
    testCases: [],
  },
  {
    number: 6,
    title: "Fibonacci Sequence",
    description: "Write a function to generate the nth Fibonacci number.",
    question:
      "Complete the function to return the nth number in the Fibonacci sequence (starting at 0).",
    content: "",
    options: [],
    questionType: "WRITE_CODE",
    testCases: [
      { input: "0", expectedOutput: "0" },
      { input: "1", expectedOutput: "1" },
      { input: "5", expectedOutput: "5" },
      { input: "10", expectedOutput: "55" },
    ],
    defaultCode: {
      javascript: `function fibonacci(n) {\n    return 0;\n}`,
      python: `def fibonacci(n):\n    return 0`,
      java: `public class Solution {\n    public static int fibonacci(int n) {\n        return 0;\n    }\n}`,
      c_cpp: `int fibonacci(int n) {\n    return 0;\n}`,
    },
  },
  {
    number: 7,
    title: "Sum of Array Elements",
    description:
      "Complete the Java method to calculate the sum of an integer array.",
    question:
      "Fill in the missing logic to correctly calculate the sum of all elements in the array.",
    content: `public class ArraySum {
      public static int sumArray(int[] arr) {
          // TODO: implement this
          return 0;
      }
  }`,
    options: [],
    questionType: "WRITE_CODE",
    testCases: [
      { input: "[1, 2, 3, 4, 5]", expectedOutput: "15" },
      { input: "[0, 0, 0]", expectedOutput: "0" },
      { input: "[-1, -2, -3]", expectedOutput: "-6" },
    ],
    defaultCode: {
      javascript: `function sumArray(arr) {\n    return 0;\n}`,
      python: `def sumArray(arr):\n    return 0`,
      java: `public class Solution {\n    public static int sumArray(int[] arr) {\n        return 0;\n    }\n}`,
      c_cpp: `int sumArray(int arr[], int size) {\n    return 0;\n}`,
    },
  },
];

export default function Home() {
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(testData.time * 60);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [step, setStep] = useState<"START" | "TEST" | "END">("START");

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

  const handleAnswerChange = useCallback((number: number, answer: any) => {
    setAnswers((prev) => ({
      ...prev,
      [number]: answer,
    }));
  }, []);

  const startTest = () => {
    setStep("TEST");
    setTimeLeft(testData.time * 60);
    setIsTimerRunning(true);
  };

  const endTest = () => {
    setStep("END");
    setIsTimerRunning(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {step === "START" && (
        <div className="mx-auto mt-10 flex flex-col items-center justify-center text-center p-10 bg-[#424242] rounded">
          <h1 className="fon-bold text-2xl">{testData.title}</h1>
          <Divider className="!border-white"/>
          <div className="flex flex-col gap-4">
            <div>
              <p>Test duration: {testData.time}</p>
              <p>Questions: {exampleAnswerCards.length}</p>
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
              <h1 className="text-lg font-bold">{testData.title}</h1>
              <div className="flex gap-6">
                <span>
                  Attempted: {attemptedCount} / {exampleAnswerCards.length}
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
            {exampleAnswerCards.map((card) => (
              <AnswerCard
                key={card.number}
                {...card}
                onAnswerChange={(answer: any) =>
                  handleAnswerChange(card.number, answer)
                }
              />
            ))}
          </div>
        </div>
      )}

      {step === "END" && (
        <div className="mx-auto mt-10 flex flex-col items-center justify-center text-center p-10 bg-[#424242] rounded gap-4">
          <h1 className="fon-bold text-2xl">{testData.endTitle}</h1>
          <p>Your test has been successfully submitted</p>
        </div>
      )}
    </div>
  );
}
