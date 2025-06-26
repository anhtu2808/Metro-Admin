import React, { useEffect, useState } from "react";
import {
  Typography,
  Spin,
  Alert,
  Card,
  Button,
  Input,
  Modal,
  Form,
  Space,
  Popconfirm,
  DatePicker,
  message,
  Row,
  Col,
  Divider,
  Empty,
  Tag,
  Select,
} from "antd";
import {
  ClockCircleOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import ModalFormContent from "../ModalFormContent";
import ModalViewContent from "../ModalViewContent";
import "./NewsManagement.css";

const { Title, Paragraph, Text } = Typography;

const { Option } = Select;

const NewsManagement = ({
  data = [],
  type,
  transformContent,
  contentData,
  loading,
  handlers,
  modal,
}) => {
  const {
    handleDelete,
    handleSubmit,
    showViewModal,
    handleCancel,
    showAddModal,
    showEditModal,
  } = handlers;
  const {
    isModalVisible,
    currentContent,
    viewModalVisible,
    viewingContent,
    form,
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
                  item.status === "DRAFT" && (
                    <Popconfirm
                      title="Bạn có chắc chắn muốn đăng tin tức này không?"
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
                <div className="news-card-content">
                  <Title level={4}>{item.title}</Title>
                  <Text type="secondary" className="news-date">
                    <ClockCircleOutlined />{" "}
                    {new Date(item.date).toLocaleString()}
                  </Text>
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
