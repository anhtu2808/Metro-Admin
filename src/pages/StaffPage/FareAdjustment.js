import React, { useState } from "react";
import {
  Input,
  Button,
  Card,
  Typography,
  Row,
  Col,
  Space,
  message,
  Tooltip,
} from "antd";
import { SearchOutlined, QrcodeOutlined } from "@ant-design/icons";
import "./StaffPage.css";

const { Title, Text } = Typography;
const FareAdjustment = () => {
  const [code, setCode] = useState("");
  const [ticket, setTicket] = useState(null);

  const mockData = {
    code: "123456",
    id: "00001",
    status: "New",
    createDate: "21/09/2024",
    startStation: "Ben Thanh",
    endStation: "Suoi Tien",
    price: "20.000",
  };

  const handleSearch = () => {
    if (code === mockData.code) {
      setTicket(mockData);
    } else {
      setTicket(null);
      message.warning("Không tìm thấy vé.");
    }
  };

  const handleScanQR = () => {
    // Giả lập quét QR, có thể tích hợp camera hoặc WebQR sau này
    
    
  };

  return (
    <div className="staff-container">
      <Card className="staff-header-card">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, color: '#1677ff' }}>
      🎫 Quản lý vé
            </Title>
          </Col>
          <Col>
            <Input
              placeholder="Nhập mã vé..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{ width: 220, marginRight: 8 }}
              onPressEnter={handleSearch}
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              onClick={handleSearch}titi
              style={{ marginRight: 8 }}
            >
              Tra cứu
            </Button>
            <Tooltip title="Quét mã QR">
              <Button
                icon={<QrcodeOutlined />}
                onClick={handleScanQR}
                className="scan-btn"
              />
            </Tooltip>
          </Col>
        </Row>
      </Card>

      {ticket && (
        <Row justify="center" style={{ marginTop: 24 }}>
          <Col xs={24} sm={20} md={16} lg={12}>
            <Card
  title={<Text strong>Mã vé: {ticket.code}</Text>}
  bordered={true}
  className="ticket-card"
  style={{
    borderColor: "#1677ff", // màu xanh Ant Design
    boxShadow: "0 4px 12px rgba(22, 119, 255, 0.2)", // đổ bóng nhẹ xanh
    borderWidth: 2,
  }}
>

              <Space direction="vertical" size="middle">
                <Text>
                  <strong>ID:</strong> {ticket.id}
                </Text>
                <Text>
                  <strong>Trạng thái:</strong> {ticket.status}
                </Text>
                <Text>
                  <strong>Ngày tạo:</strong> {ticket.createDate}
                </Text>
                <Text>
                  <strong>Ga đi:</strong> {ticket.startStation}
                </Text>
                <Text>
                  <strong>Ga đến:</strong> {ticket.endStation}
                </Text>
                <Text>
                  <strong>Giá:</strong> {ticket.price} VNĐ
                </Text>
                <Row justify="space-between">
                  <Button type="default">Cập nhật</Button>
                  <Button type="primary" danger>
                    Điều chỉnh
                  </Button>
                </Row>
              </Space>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default FareAdjustment;
