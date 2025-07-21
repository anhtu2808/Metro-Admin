import { CameraOutlined, EnvironmentOutlined } from "@ant-design/icons";
import {Avatar,Form,Input,message,Modal,Select,Upload,Row,Col} from "antd";
import { useEffect, useState } from "react";
import { uploadProfileImageAPI } from "../../apis";
import "./ModalFormUser.css";
import ButtonPrimary from '../../components/PrimaryButton/PrimaryButton'
import DangerButton from "../../components/DangerButton/DangerButton";
const { Option } = Select;

const ModalFormUser = ({
  isCanManageCustomer,
  isCanManageStaff,
  isCanManageManager,
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
      width={800}
    >
      <Form
        form={form}
        layout="vertical"
        name="userForm"
        scrollToFirstError
        autoComplete="off"
      >
        {/* Thông tin cá nhân */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="firstName"
              label="Họ"
              rules={[{ required: true, message: "Vui lòng nhập họ" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item
              name="lastName"
              label="Tên"
              rules={[{ required: true, message: "Vui lòng nhập tên" }]}
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item name="address" label="Địa chỉ">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item name="phone" label="Số điện thoại">
              <Input />
            </Form.Item>
          </Col>
        </Row>

        {/* Tài khoản */}
        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="username"
              label="Tên người dùng"
              rules={[{ required: true, message: "Vui lòng nhập tên người dùng!" }]}
            >
              <Input />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
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
          </Col>
        </Row>

        {/* Chỉ hiển thị khi tạo mới */}
        {!isEdit && (
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item
                name="password"
                label="Mật khẩu"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
                hasFeedback
              >
                <Input.Password />
              </Form.Item>
            </Col>
            <Col xs={24} md={12}>
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
            </Col>
          </Row>
        )}

        <Row gutter={16}>
          <Col xs={24} md={12}>
            <Form.Item
              name="roleType"
              label="Vai trò"
              initialValue="CUSTOMER"
              rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
            >
              <Select disabled={isEdit} >
                {isCanManageCustomer && <Option value="CUSTOMER">Khách hàng</Option>}
                {isCanManageManager && <Option value="MANAGER">Quản lý</Option>} 
                {isCanManageStaff && <Option value="STAFF">Nhân viên</Option>}
              </Select>
            </Form.Item>
          </Col>
        </Row>

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
                <ButtonPrimary
                  icon={<CameraOutlined />}
                  loading={uploadingImage}
                  type="primary"
                  ghost
                >
                  {uploadingImage ? "Đang upload..." : "Chọn ảnh"}
                </ButtonPrimary>
              </Upload>
              {imageUrl && (
                <DangerButton onClick={() => setImageUrl("")} variant="outline">
                  Xóa ảnh
                </DangerButton>
              )}
            </div>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalFormUser;
