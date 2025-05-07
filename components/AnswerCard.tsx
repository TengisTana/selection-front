import { useState } from "react";
import { Checkbox, Input, Card, Radio } from "antd";
import Compiler from "./Compiler";
import { AnswerCardProps } from "@/utils/componentTypes";

const { TextArea } = Input;

const AnswerCard = ({
  questionId,
  questionOrder,
  title,
  descr,
  questionText,
  questionType,
  options,
  testCases,
  defaultCodes,
  onAnswerChange,
}: AnswerCardProps & { onAnswerChange?: (answer: any) => void }) => {
  const [textValue, setTextValue] = useState<string>("");
  const [checkedValues, setCheckedValues] = useState<number[]>([]);
  const [radioValue, setRadioValue] = useState<number | undefined>(undefined);

  const radioOptions = options
    ? options.map((option, index) => ({
        label: option.optionText || "",
        value: index,
        optionId: option.optionId,
      }))
    : [];

  const handleCodeChange = (code: string, testResults: any[]) => {
    if (onAnswerChange) {
      onAnswerChange({ code, testResults });
    }
  };

  return (
    <Card
      title={questionOrder ? `Question ${questionOrder}` : ""}
      className="!border-none !text-white hover:scale-101 duration-1000 ease-in-out"
    >
      <div className="flex flex-col gap-4">
        <p className="flex flex-row gap-2 text-xl font-bold">
          <span>{questionOrder}.</span>
          <span>{title}</span>
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <p>{descr}</p>
            {questionText && (
              <pre className="bg-[#262626] p-4 rounded-md text-sm font-mono whitespace-pre-wrap text-white">
                {questionText}
              </pre>
            )}
            {questionType === "CODE" && testCases && (
              <Compiler
                testCases={testCases}
                defaultCodes={defaultCodes}
                onCodeChange={handleCodeChange}
              />
            )}
            {questionType === "TEXT" && (
              <TextArea
                autoSize
                value={textValue}
                onChange={(e) => {
                  setTextValue(e.target.value);
                  if (onAnswerChange) {
                    onAnswerChange({ textAnswer: e.target.value });
                  }
                }}
              />
            )}
          </div>
          <div>
            {questionType === "MULTI_CHOICE" && options && (
              <div className="flex flex-col gap-2">
                <p>
                  Pick <span className="font-bold">{options.length}</span>{" "}
                  option
                </p>
                <Checkbox.Group
                  className="flex flex-col gap-2"
                  options={options.map((option, index) => ({
                    label: option.optionText || "",
                    value: index,
                  }))}
                  value={checkedValues}
                  onChange={(values) => {
                    setCheckedValues(values as number[]);
                    if (onAnswerChange) {
                      const selectedOptionIds = values.map((index: number) => ({
                        optionId: options[index].optionId,
                      }));
                      onAnswerChange({ optionIds: selectedOptionIds });
                    }
                  }}
                />
              </div>
            )}
            {questionType === "SINGLE_CHOICE" && options && (
              <div className="flex flex-col gap-2">
                <p>
                  Pick <span className="font-bold">ONE</span> option
                </p>
                <Radio.Group
                  value={radioValue}
                  onChange={(e) => {
                    setRadioValue(e.target.value);
                    if (onAnswerChange) {
                      const selectedOptionId = [
                        { optionId: options[e.target.value].optionId },
                      ];
                      onAnswerChange({ optionIds: selectedOptionId });
                    }
                  }}
                  className="!flex !flex-col gap-2"
                >
                  {radioOptions.map((option) => (
                    <Radio key={option.value} value={option.value}>
                      {option.label}
                    </Radio>
                  ))}
                </Radio.Group>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AnswerCard;
