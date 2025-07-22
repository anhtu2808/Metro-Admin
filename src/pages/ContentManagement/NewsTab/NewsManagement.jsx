import React, { useState } from "react";
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
} from "antd";
import {
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
  CloseSquareOutlined,
  DiffOutlined,
} from "@ant-design/icons";
import ModalFormContent from "../ModalFormContent";
import ModalViewContent from "../ModalViewContent";
import "./NewsManagement.css";

const { Title, Paragraph, Text } = Typography;

const NewsManagement = ({ data = [], type, loading, handlers, modal }) => {
  const {
    handleDelete,
    handleSubmit,
    showViewModal,
    handleCancel,
    showEditModal,
    handlePublish,
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

  const handleToggleStatus = async (item) => {
    const newStatus = item.status === "DRAFT" ? "PUBLISHED" : "DRAFT";
    const payload = {
      ...item,
      status: newStatus,
      publishAt:
        newStatus === "PUBLISHED" ? new Date().toISOString() : item.publishAt,
    };
    const result = await handlePublish(payload, type);
    if (!result.success) {
      message.error(result.message || "Cập nhật trạng thái thất bại!");
    }
  };

  return (
    <div className="news-container">
      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <div className="news-list">
          {data.length === 0 ? (
            <Empty description="Không tìm thấy tin tức" />
          ) : (
            data.map((item) => (
              <Card
                key={item.id}
                className="news-card"
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
                    title="Bạn có chắc chắn muốn xóa tin tức này?"
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
                  <Popconfirm
                    title={`Bạn có chắc chắn muốn ${
                      item.status === "DRAFT" ? "đăng" : "chuyển về bản nháp"
                    } tin tức này không?`}
                    onConfirm={() => handleToggleStatus(item)}
                    okText="Đồng ý"
                    cancelText="Hủy"
                    icon={
                      <ExclamationCircleOutlined style={{ color: "green" }} />
                    }
                  >
                    <Button
                      icon={
                        item.status === "DRAFT" ? (
                          <DiffOutlined />
                        ) : (
                          <CloseSquareOutlined />
                        )
                      }
                      type={item.status === "DRAFT" ? "primary" : "default"}
                    >
                      {item.status === "DRAFT" ? "Đăng" : "Nháp"}
                    </Button>
                  </Popconfirm>,
                ]}
              >
                <div className="news-card-content">
                  <Title level={4}>{item.title}</Title>
                  <Text type="secondary" className="news-date">
                    <ClockCircleOutlined />{" "}
                    {new Date(item.date).toLocaleString()}
                  </Text>

                  <div className="news-image-container">
                    {item.imageUrls?.[0] ? (
                      <img src={item.imageUrls[0]} alt={item.title} />
                    ) : (
                      <span style={{ color: "#999" }}>No Image</span>
                    )}
                  </div>

                  <Paragraph ellipsis={{ rows: 2 }} className="news-excerpt">
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

      <ModalFormContent
        currentContent={currentContent}
        isModalVisible={isModalVisible}
        handleCancel={handleCancel}
        form={form}
        imageUrl={imageUrl}
        setImageUrl={setImageUrl}
        handleSubmit={(values) => handleSubmit(values, "NEWS")}
      />

      <ModalViewContent
        type="NEWS"
        viewModalVisible={viewModalVisible}
        handleCancel={handleCancel}
        viewingContent={viewingContent}
      />
    </div>
  );
};

export default NewsManagement;
