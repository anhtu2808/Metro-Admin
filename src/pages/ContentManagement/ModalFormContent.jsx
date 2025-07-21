import { Button, DatePicker, Form, Input, Modal, Space } from "antd";
import moment from "moment";
const { TextArea } = Input;

const getTypeLabel = (type) => {
  switch (type) {
    case "NEWS":
      return "Tin tức";
    case "GUIDELINE":
      return "Hướng dẫn";
    default:
      return "Nội dung";
  }
};
const ContentFormModal = ({
  currentContent,
  isModalVisible,
  handleCancel,
  form,
  handleSubmit,
}) => {
  const type = currentContent?.type || "NEWS";
  const label = getTypeLabel(type);
  const isEdit = !!currentContent?.id;
  return (
    <Modal
      title={isEdit ? `Chỉnh sửa ${label}` : `Thêm ${label} mới`}
      open={isModalVisible}
      onCancel={handleCancel}
      footer={null}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          date: moment(),
        }}
      >
        <Form.Item
          name="title"
          label="Tiêu đề"
          rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
        >
          <Input placeholder={`Nhập tiêu đề ${label}`} />
        </Form.Item>

        <Form.Item
          name="date"
          label="Ngày đăng"
          rules={[{ required: true, message: "Vui lòng chọn ngày đăng!" }]}
        >
          <DatePicker
            showTime
            format="DD/MM/YYYY HH:mm:ss"
            style={{ width: "100%" }}
          />
        </Form.Item>

        <Form.Item
          name="content"
          label="Nội dung"
          rules={[{ required: true, message: "Vui lòng nhập nội dung!" }]}
        >
          <TextArea rows={6} placeholder={`Nhập nội dung ${label}`} />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {isEdit ? "Cập nhật" : "Thêm mới"}
            </Button>
            <Button onClick={handleCancel}>Hủy</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ContentFormModal;
