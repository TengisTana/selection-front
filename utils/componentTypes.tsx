import {
  DefaultCodeProps,
  OptionProps,
  TestCaseProps,
  TestProps,
} from "./utils";

export interface TestBasicProps {
  testId: string;
  createdAt: string;
  title: string;
  duration: number;
}

export interface TestCardProps {
  testId: string;
  createdAt: string;
  title: string;
  duration: number;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface TestResult {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
}

export interface CompilerProps {
  testCases: TestCaseProps[];
  defaultCodes?: DefaultCodeProps[];
}

export interface AnswerCardProps {
  questionId?: string;
  questionOrder?: number;
  title?: string;
  descr?: string;
  questionText?: string;
  questionType?: string;
  options?: OptionProps[];
  testCases?: TestCaseProps[];
  defaultCodes?: DefaultCodeProps[];
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
