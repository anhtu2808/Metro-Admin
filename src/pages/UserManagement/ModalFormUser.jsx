import { CameraOutlined, EnvironmentOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { uploadProfileImageAPI } from "../../apis";
import "./ModalFormUser.css";
const { Option } = Select;

const ModalFormUser = ({
  visible,
  onCancel,
  editingUser,
  loading = false,
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const isEdit = !!editingUser;
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    if (visible) {
      if (editingUser) {
        form.setFieldsValue(editingUser);
        setImageUrl(editingUser.avatarUrl || "");
      }
    } else {
      form.resetFields();
      setImageUrl("");
    }
  }, [visible, editingUser, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        avatarUrl: imageUrl || "", // Thêm avatar từ state
      };
      onSubmit(payload);
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  // Handle image upload
  const handleImageUpload = async (file) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadProfileImageAPI(formData);

      if (response.code === 200) {
        const newImageUrl = response.result;
        setImageUrl(newImageUrl);
        message.success("Upload ảnh thành công!");
      } else {
        message.error("Upload ảnh thất bại!");
      }
    } catch (error) {
      message.error("Upload ảnh thất bại!");
    } finally {
      setUploadingImage(false);
    }

    return false; // Prevent default upload behavior
  };

  // Handle modal cancel
  const handleCancel = () => {
    form.resetFields();
    setImageUrl("");
    onCancel?.();
  };

  return (
    <Modal
      open={visible}
      title={isEdit ? "Cập nhật người dùng" : "Tạo người dùng mới"}
      onCancel={handleCancel}
      onOk={handleOk}
      okText={isEdit ? "Cập nhật" : "Tạo mới"}
      confirmLoading={loading}
      maskClosable={false}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        name="userForm"
        scrollToFirstError
        autoComplete="off"
      >
        {/* Thông tin cá nhân */}
        <Form.Item
          name="firstName"
          label="Họ"
          rules={[{ required: true, message: "Vui lòng nhập họ" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Tên"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item name="address" label="Địa chỉ">
          <Input />
        </Form.Item>

        <Form.Item name="phone" label="Số điện thoại">
          <Input />
        </Form.Item>

        {/* Tài khoản */}
        <Form.Item
          name="username"
          label="Tên người dùng"
          rules={[{ required: true, message: "Vui lòng nhập tên người dùng!" }]}
        >
          <Input />
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

        {/* Chỉ hiển thị khi tạo mới */}
        {!isEdit && (
          <>
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
          </>
        )}

        {/* Vai trò mặc định và disabled */}
        <Form.Item
          name="roleType"
          label="Vai trò"
          initialValue="CUSTOMER"
          rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
        >
          <Select disabled>
            <Option value="CUSTOMER">Khách hàng</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Hình ảnh người dùng">
          <div className="user-image-upload">
            <div className="image-preview">
              <Avatar
                size={120}
                src={imageUrl}
                icon={<EnvironmentOutlined />}
                shape="square"
              />
            </div>
            <div className="upload-controls">
              <Upload
                name="userImage"
                beforeUpload={handleImageUpload}
                showUploadList={false}
                accept="image/*"
              >
                <Button
                  icon={<CameraOutlined />}
                  loading={uploadingImage}
                  type="primary"
                  ghost
                >
                  {uploadingImage ? "Đang upload..." : "Chọn ảnh"}
                </Button>
              </Upload>
              {imageUrl && (
                <Button onClick={() => setImageUrl("")} danger type="text">
                  Xóa ảnh
                </Button>
              )}
            </div>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalFormUser;
