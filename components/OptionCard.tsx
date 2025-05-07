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
    const updatedQuestions = [...(test?.questions || [])];
    const updatedOptions = [
      ...(updatedQuestions[questionIndex]?.options || []),
    ];

    if (key === "isCorrect" && questionType === "SINGLE_CHOICE" && value) {
      updatedOptions.forEach((opt, idx) => {
        opt.isCorrect = idx === optionIndex ? value : false;
      });
    } else {
      updatedOptions[optionIndex] = {
        ...updatedOptions[optionIndex],
        [key]: value,
      };
    }

    updatedQuestions[questionIndex].options = updatedOptions;
    setTest({ ...test, questions: updatedQuestions });
  };

  const deleteOption = () => {
    const updatedQuestions = [...(test?.questions || [])];
    const updatedOptions =
      updatedQuestions[questionIndex].options?.filter(
        (_, index) => index !== optionIndex
      ) || [];
    updatedQuestions[questionIndex].options = updatedOptions.map(
      (opt, index) => ({
        ...opt,
        optionOrder: index + 1,
      })
    );

    setTest({ ...test, questions: updatedQuestions });
  };

  return (
    <div className="mb-2 p-2 border rounded flex flex-row gap-4">
      <Input
        placeholder="Option text"
        value={option.optionText}
        onChange={(e) => updateOption("optionText", e.target.value)}
      />
      <Space>
        <Checkbox
          checked={option.isCorrect}
          onChange={(e) => updateOption("isCorrect", e.target.checked)}
        >
          Correct
        </Checkbox>
        <DeleteOutlined onClick={deleteOption} className="hover:text-red-400" />
      </Space>
    </div>
  );
};

export default OptionCard;
