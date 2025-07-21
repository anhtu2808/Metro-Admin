import React from "react";
import { Modal, Typography, Divider, Button } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import "./ModalViewContent.css";

const { Title, Paragraph, Text } = Typography;

const getTypeLabel = (type) => {
  switch (type) {
    case "NEWS":
      return "Tin tức";
    case "GUIDE":
    case "GUIDELINE":
      return "Hướng dẫn";
    default:
      return "Nội dung";
  }
};

const ContentViewModal = ({
  viewModalVisible,
  handleCancel,
  viewingContent,
}) => {
  const type = viewingContent?.type;
  const label = getTypeLabel(type);
  return (
    <Modal
      title={`Chi tiết ${label}`}
      open={viewModalVisible}
      onCancel={handleCancel}
      footer={[
        <Button key="back" onClick={handleCancel}>
          Đóng
        </Button>,
      ]}
      width={700}
    >
      {viewingContent && (
        <div className="content-detail">
          <Title level={3}>{viewingContent.title}</Title>
          <Text type="secondary" className="content-date-detail">
            <ClockCircleOutlined />{" "}
            {moment(viewingContent.date).format("HH:mm:ss - DD/MM/YYYY")}
          </Text>
          <Divider />
          <div
            className="content-content-detail"
            dangerouslySetInnerHTML={{ __html: viewingContent.content }}
          />
        </div>
      )}
    </Modal>
  );
};

export default ContentViewModal;
