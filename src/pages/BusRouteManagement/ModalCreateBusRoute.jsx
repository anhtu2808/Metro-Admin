import { Form, Input, notification, Select, Modal, InputNumber } from "antd";

const { Option } = Select;

const ModalCreateBusRoute = ({ isModalOpen, setIsModalOpen }) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("🚌 Dữ liệu tuyến xe buýt:", values);
      notification.success({
        message: "Tạo tuyến xe buýt",
        description: "Tuyến xe buýt đã được tạo thành công",
      });
      setIsModalOpen(false);
      form.resetFields();
    } catch (errorInfo) {
      console.log("Lỗi form:", errorInfo);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  return (
    <Modal
      title="Tạo tuyến xe buýt kết nối Metro"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
    >
      <Form
        layout="vertical"
        form={form}
        name="formCreateBusRoute"
        style={{ maxWidth: 600 }}
        scrollToFirstError
      >
        <Form.Item
          name="metroStationId"
          label="Ga Metro kết nối"
          rules={[{ required: true, message: "Vui lòng chọn ga Metro!" }]}
        >
          <Select placeholder="Chọn một ga Metro">
            <Option value="M1-TSN">Ga Tân Sơn Nhất (Tuyến M1)</Option>
            <Option value="M2-BXMD">Ga Bến xe Miền Đông (Tuyến M2)</Option>
            <Option value="M3-BXMT">Ga Bến xe Miền Tây (Tuyến M3)</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="busRouteCode"
          label="Mã tuyến xe buýt"
          rules={[{ required: true, message: "Vui lòng nhập mã tuyến!" }]}
        >
          <Input placeholder="VD: B22, B35, ..." />
        </Form.Item>

        <Form.Item
          name="startLocation"
          label="Điểm bắt đầu"
          rules={[{ required: true, message: "Vui lòng nhập điểm bắt đầu!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="endLocation"
          label="Điểm kết thúc"
          rules={[{ required: true, message: "Vui lòng nhập điểm kết thúc!" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="headwayMinutes"
          label="Tần suất chạy (phút)"
          rules={[{ required: true, message: "Vui lòng nhập tần suất chạy!" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="distanceToMetro"
          label="Khoảng cách đến ga Metro (km)"
          rules={[{ required: true, message: "Vui lòng nhập khoảng cách!" }]}
        >
          <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateBusRoute;
