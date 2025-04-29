import { Form, Input, Checkbox, Space, Button } from "antd";
import { OptionCardProps } from "@/utils/componentTypes";
import { OptionProps } from "@/utils/utils";

const OptionCard = ({
  option,
  questionIndex,
  optionIndex,
  test,
  setTest,
}: OptionCardProps) => {
  const updateOption = (key: keyof OptionProps, value: any) => {
    const updatedQuestions = [...(test?.Questions || [])];
    const updatedOptions = [
      ...(updatedQuestions[questionIndex]?.Options || []),
    ];

    updatedOptions[optionIndex] = {
      ...updatedOptions[optionIndex],
      [key]: value,
    };

    updatedQuestions[questionIndex].Options = updatedOptions;
    setTest({ ...test, Questions: updatedQuestions });
  };

  const deleteOption = () => {
    const updatedQuestions = [...(test?.Questions || [])];
    const updatedOptions =
      updatedQuestions[questionIndex].Options?.filter(
        (_, index) => index !== optionIndex
      ) || [];
    updatedQuestions[questionIndex].Options = updatedOptions.map(
      (opt, index) => ({
        ...opt,
        OptionOrder: index + 1,
      })
    );

    setTest({ ...test, Questions: updatedQuestions });
  };

  return (
    <div className="mb-2 p-2 border rounded">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Input
          placeholder="Option text"
          value={option.OptionText}
          onChange={(e) => updateOption("OptionText", e.target.value)}
        />
        <Space>
          <Checkbox
            checked={option.IsCorrect}
            onChange={(e) => updateOption("IsCorrect", e.target.checked)}
          >
            Correct
          </Checkbox>
          <Button danger onClick={deleteOption}>
            Delete
          </Button>
        </Space>
      </Space>
    </div>
  );
};

export default OptionCard;
