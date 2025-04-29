export interface TestCaseProps {
  TestCaseId?: string;
  Input?: string;
  ExpectedOutput?: string;
}

export interface DefaultCodeProps {
  DefaultCodeId?: string;
  CodeLanguage?: string;
  CodeText?: string;
}

export interface OptionProps {
  OptionId?: string;
  OptionText?: string;
  OptionOrder?: number;
  IsCorrect?: boolean;
}

export interface QuestionProps {
  QuestionId?: string;
  QuestionOrder?: number;
  Title?: string;
  Descr?: string;
  QuestionText?: string;
  QuestionType?: string;
  Options?: OptionProps[];
  DefaultCodes?: DefaultCodeProps[];
  TestCases?: TestCaseProps[];
}

export interface TestProps {
  TestId?: string;
  Title?: string;
  Duration?: number;
  CreatedAt?: string;
  Questions?: QuestionProps[];
}
