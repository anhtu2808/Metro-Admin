import { Form, Input, notification, Select, Modal } from "antd";

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

const ModalCreateUser = (props) => {
  const { isModalOpen, setIsModalOpen } = props;

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = async () => {
    try {
      const values = await form.validateFields(); // ✅ Lấy dữ liệu form
      console.log("Dữ liệu submit:", values);
      notification.success({
        message: "Create new user",
        description: "Create User successed",
      });
      setIsModalOpen(false); // Đóng modal nếu submit thành công
      form.resetFields();
    } catch (errorInfo) {
      console.log("Lỗi form:", errorInfo);
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
        title="Create New User"
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
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="username"
            label="UserName"
            rules={[
              {
                required: true,
                message: "Please input your username!",
                whitespace: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Role"
            rules={[{ required: true, message: "Please select Role!" }]}
          >
            <Select placeholder="select your role">
              <Option value="Manager">Manger</Option>
              <Option value="Staff">Staff</Option>
              <Option value="Customer">Customer</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ModalCreateUser;
