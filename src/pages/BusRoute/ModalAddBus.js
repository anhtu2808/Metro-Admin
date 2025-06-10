import { Form, Input, notification, Select, Modal, InputNumber } from "antd";

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};

const { Option } = Select;

const ModalAddBus = (props) => {
  const { isModalOpen, setIsModalOpen } = props;

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("🚍 Dữ liệu Bus submit:", values);
      notification.success({
        message: "Create new bus route",
        description: "Bus route created successfully",
      });

      setIsModalOpen(false);
      form.resetFields();
    } catch (errorInfo) {
      console.log("Form error:", errorInfo);
    }
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };
  const [form] = Form.useForm();

  return (
    <>
      <Modal
        title="Create New Bus"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        maskClosable={false}
      >
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          initialValues={{
            prefix: "86",
          }}
          style={{ maxWidth: 600 }}
          scrollToFirstError
        >
          <Form.Item
            name="station_id"
            label="Station"
            rules={[{ required: true, message: "Please select station!" }]}
          >
            <Select placeholder="Select station">
              <Option value="BXMD">Bến xe miền Đông</Option>
              <Option value="BXMT">Bến xe miền Tây</Option>
              <Option value="TSN">Sân bay Tân Sơn Nhất</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="bus_code"
            label="Bus Code"
            rules={[{ required: true, message: "Please input bus code!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="start_location"
            label="Start Location"
            rules={[
              { required: true, message: "Please input start location!" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="end_location"
            label="End Location"
            rules={[{ required: true, message: "Please input end location!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="headway_minutes"
            label="Headway (minutes)"
            rules={[
              { required: true, message: "Please input headway minutes!" },
            ]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
          <Form.Item
            name="distance_to_station"
            label="Distance to Station (km)"
            rules={[{ required: true, message: "Please input distance!" }]}
          >
            <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalAddBus;
