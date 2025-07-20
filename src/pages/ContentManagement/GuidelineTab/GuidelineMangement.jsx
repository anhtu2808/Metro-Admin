import { useState } from "react";
import {
  Typography,
  Spin,
  Alert,
  Card,
  Button,
  Popconfirm,
  message,
  Empty,
  Tag,
  Select,
} from "antd";
import {
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import "./GuidelineManagement.css";
import ModalFormContent from "../ModalFormContent";
import ModalViewContent from "../ModalViewContent";
const { Title, Paragraph, Text } = Typography;

const { Option } = Select;

const GuidelineManagement = ({ data = [], type, loading, handlers, modal }) => {
  const {
    handleDelete,
    handleSubmit,
    showViewModal,
    handleCancel,
    showEditModal,
  } = handlers;
  const {
    isModalVisible,
    currentContent,
    viewModalVisible,
    viewingContent,
    form,
    imageUrl,
    setImageUrl,
  } = modal;

  const [error, setError] = useState(null);

  const handlePublish = async (item) => {
    const result = await handlers.handlePublish(item, type);
    if (!result.success) {
      message.error(result.message || "Đăng thất bại!");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "DRAFT":
        return "default";
      case "PUBLISHED":
        return "green";
      default:
        return "blue";
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "DRAFT":
        return "Bản nháp";
      case "PUBLISHED":
        return "Đã đăng";
      default:
        return status;
    }
  };

  return (
    <div className="guideline-container">
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <div className="guideline-list">
          {data.length === 0 ? (
            <Empty description="Không tìm thấy hướng dẫn" />
          ) : (
            data.map((item) => (
              <Card
                key={item.id}
                className="guideline-card"
                actions={[
                  <Button
                    icon={<EyeOutlined />}
                    onClick={() => showViewModal(item)}
                  >
                    Xem
                  </Button>,
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => showEditModal(item)}
                  >
                    Sửa
                  </Button>,
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa hướng dẫn này?"
                    onConfirm={() => handleDelete(item.id, type)}
                    okText="Có"
                    cancelText="Không"
                    icon={
                      <ExclamationCircleOutlined style={{ color: "red" }} />
                    }
                  >
                    <Button danger icon={<DeleteOutlined />}>
                      Xóa
                    </Button>
                  </Popconfirm>,
                  item.status === "DRAFT" && (
                    <Popconfirm
                      title="Bạn có chắc chắn muốn đăng hướng dẫn này không?"
                      onConfirm={() => handlePublish(item)}
                      okText="Đồng ý"
                      cancelText="Hủy"
                      icon={
                        <ExclamationCircleOutlined style={{ color: "green" }} />
                      }
                    >
                      <Button type="primary">Đăng</Button>,
                    </Popconfirm>
                  ),
                ].filter(Boolean)}
              >
                <div className="guideline-card-content">
                  <Title level={4}>{item.title}</Title>
                  <Text type="secondary" className="guideline-date">
                    <ClockCircleOutlined />{" "}
                    {new Date(item.date).toLocaleString()}
                  </Text>
                  <div className="guideline-image-container">
                    {item.imageUrls?.[0] ? (
                      <img src={item.imageUrls[0]} alt={item.title} />
                    ) : (
                      <span style={{ color: "#999" }}>No Image</span>
                    )}
                  </div>
                  <Paragraph
                    ellipsis={{ rows: 2 }}
                    className="guideline-excerpt"
                  >
                    {item.summary}
                  </Paragraph>
                  <Tag color={getStatusColor(item.status)}>
                    {getStatusLabel(item.status)}
                  </Tag>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Modal thêm/sửa hướng dẫn */}
      <ModalFormContent
        type="GUIDELINE"
        currentContent={currentContent}
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        form={form}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        handleSubmit={(values) => handleSubmit(values, "GUIDELINE")}
      />
      {/* Modal xem chi tiết hướng dẫn */}
      <ModalViewContent
        type="GUIDELINE"
        viewModalVisible={viewModalVisible}
        handleCancel={handleCancel}
        viewingContent={viewingContent}
      />
    </div>
  );
};

export default GuidelineManagement;
