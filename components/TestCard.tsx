import { Card, Popconfirm } from "antd";
import Meta from "antd/es/card/Meta";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { TestCardProps } from "@/utils/componentTypes";

const TestCard = ({
  testId,
  createdAt,
  title,
  duration,
  onEdit,
  onDelete,
}: TestCardProps) => {
  const handleEdit = () => {
    onEdit(testId);
  };

  const handleDelete = () => {
    onDelete(testId);
  };

  return (
    <Card
      actions={[
        <span key="edit" onClick={handleEdit}>
          <EditOutlined />
        </span>,
        <Popconfirm
          key="delete"
          title="Are you sure you want to delete this test?"
          onConfirm={handleDelete}
          okText="Yes"
          cancelText="No"
        >
          <span>
            <DeleteOutlined />
          </span>
        </Popconfirm>,
      ]}
    >
      <Meta
        title={title}
        description={
          <div>
            <p>Created At: {new Date(createdAt).toISOString().split("T")[0]}</p>
            <p>Duration: {duration} minutes</p>
          </div>
        }
      />
    </Card>
  );
};

export default TestCard;
