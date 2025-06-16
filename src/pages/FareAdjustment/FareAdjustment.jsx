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
  Modal,
  Form,
  Select,
} from "antd";
import { SearchOutlined, QrcodeOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { Option } = Select;

const FareAdjustment = () => {
  const [code, setCode] = useState("");
  const [ticket, setTicket] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [form] = Form.useForm();

  const mockData = {
    code: "123456",
    id: "00001",
    status: "New",
    createDate: "21/09/2024",
    startStation: "Ben Thanh",
    endStation: "Suoi Tien",
    price: "20000",
  };

  const handleSearch = () => {
    if (code === mockData.code) {
      setTicket({ ...mockData });
    } else {
      setTicket(null);
      message.warning("Không tìm thấy vé.");
    }
  };

  const handleScanQR = () => {
    const scannedCode = "123456";
    setCode(scannedCode);
    setTicket({ ...mockData });
    message.success("Đã quét mã QR thành công!");
  };

  const showDetail = () => setOpenDetail(true);
  const closeDetail = () => setOpenDetail(false);

  const showEdit = () => {
    form.setFieldsValue({
      status: ticket.status,
      startStation: ticket.startStation,
      endStation: ticket.endStation,
      price: ticket.price,
    });
    setOpenEdit(true);
  };

  const handleUpdate = (values) => {
    setTicket({
      ...ticket,
      status: values.status,
      startStation: values.startStation,
      endStation: values.endStation,
      price: values.price,
    });
    message.success("Cập nhật vé thành công!");
    setOpenEdit(false);
  };

  return (
    <div className="staff-container">
      <Card className="staff-header-card">
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={2} style={{ margin: 0, color: "#1677ff" }}>
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
              onClick={handleSearch}
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
                  <Button type="default" onClick={showDetail}>
                    Chi tiết vé
                  </Button>
                  <Button type="primary" danger onClick={showEdit}>
                    Điều chỉnh
                  </Button>
                </Row>
              </Space>
            </Card>
          </Col>
        </Row>
      )}

      {/* Modal Chi tiết vé */}
      <Modal
        open={openDetail}
        onCancel={closeDetail}
        footer={null}
        title={`Chi tiết vé: ${ticket?.code}`}
      >
        <Space direction="vertical" size="middle">
          <Text>
            <strong>ID:</strong> {ticket?.id}
          </Text>
          <Text>
            <strong>Trạng thái:</strong> {ticket?.status}
          </Text>
          <Text>
            <strong>Ngày tạo:</strong> {ticket?.createDate}
          </Text>
          <Text>
            <strong>Ga đi:</strong> {ticket?.startStation}
          </Text>
          <Text>
            <strong>Ga đến:</strong> {ticket?.endStation}
          </Text>
          <Text>
            <strong>Giá:</strong> {ticket?.price} VNĐ
          </Text>
        </Space>
      </Modal>

      {/* Modal Điều chỉnh vé */}
      <Modal
        open={openEdit}
        onCancel={() => setOpenEdit(false)}
        onOk={() => form.submit()}
        title="Điều chỉnh thông tin vé"
        okText="Lưu thay đổi"
      >
        <Form layout="vertical" form={form} onFinish={handleUpdate}>
          <Form.Item name="status" label="Trạng thái">
            <Select>
              <Option value="New">New</Option>
              <Option value="Used">Used</Option>
              <Option value="Canceled">Canceled</Option>
            </Select>
          </Form.Item>
          <Form.Item name="startStation" label="Ga đi">
            <Input />
          </Form.Item>
          <Form.Item name="endStation" label="Ga đến">
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Giá (VNĐ)">
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FareAdjustment;
