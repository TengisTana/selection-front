import { OptionProps, TestProps } from "./utils";

export interface TestCase {
  input: string;
  expectedOutput: string;
}

export interface TestResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
}

export interface CompilerProps {
  testCases: TestCase[];
  defaultCode?: {
    javascript?: string;
    python?: string;
    java?: string;
    c_cpp?: string;
  };
}

export interface AnswerCardProps {
  number: number;
  title: string;
  description?: string;
  question?: string;
  content?: any;
  options?: any;
  optionNumber?: string;
  questionType?: any;
  testCases?: TestCase[];
  defaultCode?: {
    javascript?: string;
    python?: string;
    java?: string;
    c_cpp?: string;
  };
}

export interface QuestionCardProps {
  id: number;
  test: TestProps;
  setTest: React.Dispatch<React.SetStateAction<TestProps | null>>;
}

export interface OptionCardProps {
  option: OptionProps;
  questionIndex: number;
  optionIndex: number;
  setTest: React.Dispatch<React.SetStateAction<TestProps | null>>;
  test: TestProps | null;
}

export interface QuestionCardProps {
  id: number;
  test: TestProps;
  setTest: React.Dispatch<React.SetStateAction<TestProps | null>>;
}
