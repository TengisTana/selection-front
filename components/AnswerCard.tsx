import { useState } from "react";
import { Checkbox, Input, Card, Radio } from "antd";
import Compiler from "./Compiler";
import { AnswerCardProps } from "@/utils/componentTypes";

const { TextArea } = Input;

const AnswerCard = ({
  number,
  title,
  question,
  content,
  options,
  optionNumber,
  questionType,
  testCases,
  defaultCode,
  onAnswerChange,
}: AnswerCardProps & { onAnswerChange?: (answer: any) => void }) => {
  const [textValue, setTextValue] = useState<string>("");
  const [checkedValues, setCheckedValues] = useState<number[]>([]);
  const [radioValue, setRadioValue] = useState<number | undefined>(undefined);

  const radioOptions = options
    ? options.map((option: any, index: number) => ({
        label: option,
        value: index,
      }))
    : [];

  const handleCodeChange = (code: string, testResults: any[]) => {
    if (onAnswerChange) {
      onAnswerChange({ code, testResults });
    }
  };

  return (
    <Card
      title={number}
      className="!border-none !text-white hover:scale-101 duration-1000 ease-in-out"
    >
      <div className="flex flex-col gap-4">
        <p className="flex flex-row gap-2 text-xl font-bold">
          <span>{number}.</span>
          <span>{title}</span>
        </p>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <p>{question}</p>
            {content && (
              <pre className="bg-[#262626] p-4 rounded-md text-sm font-mono whitespace-pre-wrap text-white">
                {content}
              </pre>
            )}
            {questionType === "WRITE_CODE" && testCases && (
              <Compiler
                testCases={testCases}
                defaultCode={defaultCode}
                onCodeChange={handleCodeChange}
              />
            )}
            {questionType === "TEXT" && (
              <TextArea
                autoSize
                value={textValue}
                onChange={(e) => {
                  setTextValue(e.target.value);
                  if (onAnswerChange) onAnswerChange(e.target.value);
                }}
              />
            )}
          </div>
          <div>
            {questionType === "MULTI_CHOICE" && options && (
              <div className="flex flex-col gap-2">
                <p>
                  Pick <span className="font-bold">{optionNumber}</span> option
                </p>
                <Checkbox.Group
                  className="flex flex-col gap-2"
                  options={options}
                  value={checkedValues}
                  onChange={(values) => {
                    setCheckedValues(values as number[]);
                    if (onAnswerChange) onAnswerChange(values);
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
                    if (onAnswerChange) onAnswerChange(e.target.value);
                  }}
                  className="!flex !flex-col gap-2"
                >
                  {radioOptions.map((option: any) => (
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
