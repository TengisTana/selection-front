export interface TestProps {
  testId?: string;
  title?: string;
  duration?: number;
  createdAt?: string;
  questions?: QuestionProps[];
}

export interface QuestionProps {
  questionId?: string;
  questionOrder?: number;
  title?: string;
  descr?: string;
  questionText?: string;
  questionType?: string;
  options?: OptionProps[];
  defaultCodes?: DefaultCodeProps[];
  testCases?: TestCaseProps[];
}

export interface TestCaseProps {
  testCaseId?: string;
  input?: string;
  expectedOutput?: string;
  testCaseOrder?: number;
}

export interface DefaultCodeProps {
  defaultCodeId?: string;
  codeLanguage?: string;
  codeText?: string;
  defaultCodeOrder?: number;
}

export interface OptionProps {
  optionId?: string;
  optionText?: string;
  optionOrder?: number;
  isCorrect?: boolean;
}




