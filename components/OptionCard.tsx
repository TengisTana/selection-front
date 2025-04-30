import { Input, Checkbox, Space } from "antd";
import { OptionCardProps } from "@/utils/componentTypes";
import { OptionProps } from "@/utils/utils";
import { DeleteOutlined } from "@ant-design/icons";

const OptionCard = ({
  option,
  questionIndex,
  optionIndex,
  test,
  setTest,
  questionType,
}: OptionCardProps & { questionType: string }) => {
  const updateOption = (key: keyof OptionProps, value: any) => {
    const updatedQuestions = [...(test?.Questions || [])];
    const updatedOptions = [
      ...(updatedQuestions[questionIndex]?.Options || []),
    ];

    if (key === "IsCorrect" && questionType === "SINGLE_CHOICE" && value) {
      // For SINGLE_CHOICE, only one option can be correct
      updatedOptions.forEach((opt, idx) => {
        opt.IsCorrect = idx === optionIndex ? value : false;
      });
    } else {
      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        [key]: value,
      };
    }

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
    <div className="mb-2 p-2 border rounded flex flex-row gap-4">
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
        <DeleteOutlined onClick={deleteOption} className="hover:text-red-400" />
      </Space>
    </div>
  );
};

export default OptionCard;
