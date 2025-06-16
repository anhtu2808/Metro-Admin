import { Form, Input, notification, Select, Modal } from "antd";

const { Option } = Select;

const ModalCreateUser = (props) => {
  const { isModalOpen, setIsModalOpen } = props;
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      console.log("Dữ liệu submit:", values);
      notification.success({
        message: "Tạo người dùng mới",
        description: "Tạo người dùng thành công",
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
      title="Tạo tài khoản"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
    >
      <Form
        layout="vertical"
        form={form}
        name="register"
        initialValues={{
          prefix: "86",
        }}
        scrollToFirstError
      >
         <Form.Item
          name="username"
          label="Tên người dùng"
          rules={[
            { required: true, message: "Vui lòng nhập tên người dùng!" },
          ]}
        >
          <Input placeholder="Nhập tên người dùng" placeholder="Nhập tên người dùng" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { type: "email", message: "Email không hợp lệ!" },
            { required: true, message: "Vui lòng nhập email!" },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Xác nhận mật khẩu"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Vui lòng xác nhận mật khẩu!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Mật khẩu xác nhận không khớp!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

       

        <Form.Item
          name="role"
          label="Role"
          rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
        >
          <Select placeholder="Chọn vai trò">
            <Option value="Manager">Quản lý</Option>
            <Option value="Staff">Nhân viên</Option>
            <Option value="Customer">Khách hàng</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreateUser;
