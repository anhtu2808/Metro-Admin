import React, { useState, useEffect } from "react";
import { 
  Form, 
  Input, 
  Button, 
  Card,
  Typography,
  message,
  Space
} from "antd";
import { 
  LockOutlined,
  ArrowLeftOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLayoutData } from "../../redux/layoutSlice";
import "./ChangePassword.css";

const { Title, Text } = Typography;

const ChangePassword = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Set page title and icon
  useEffect(() => {
    dispatch(
      setLayoutData({
        title: "Đổi mật khẩu",
        icon: <LockOutlined />,
      })
    );
  }, [dispatch]);

  // Handle form submission
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      // TODO: Call change password API
      console.log("Change password values:", values);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      message.success("Đổi mật khẩu thành công!");
      form.resetFields();
      navigate(-1); // Go back to previous page
    } catch (error) {
      console.error("Change password error:", error);
      message.error("Đổi mật khẩu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  // Validate confirm password
  const validateConfirmPassword = (_, value) => {
    if (!value || form.getFieldValue('newPassword') === value) {
      return Promise.resolve();
    }
    return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
  };

  return (
    <div className="change-password-page">
      <div className="change-password-header">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="back-button"
        >
          Quay lại
        </Button>
      </div>

      <div className="change-password-container">
        <Card className="change-password-card">
          <div className="change-password-title">
            <LockOutlined className="title-icon" />
            <Title level={3}>Đổi mật khẩu</Title>
            <Text type="secondary">
              Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            className="change-password-form"
            autoComplete="off"
          >
            <Form.Item
              label="Mật khẩu hiện tại"
              name="currentPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu hiện tại!" }
              ]}
            >
              <Input.Password
                placeholder="Nhập mật khẩu hiện tại"
                size="large"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              label="Mật khẩu mới"
              name="newPassword"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                {
                  pattern: /^(?=.*[A-Za-z])(?=.*\d)/,
                  message: "Mật khẩu phải chứa ít nhất 1 chữ cái và 1 số!"
                }
              ]}
            >
              <Input.Password
                placeholder="Nhập mật khẩu mới"
                size="large"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item
              label="Xác nhận mật khẩu mới"
              name="confirmPassword"
              dependencies={['newPassword']}
              rules={[
                { required: true, message: "Vui lòng xác nhận mật khẩu mới!" },
                { validator: validateConfirmPassword }
              ]}
            >
              <Input.Password
                placeholder="Nhập lại mật khẩu mới"
                size="large"
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              />
            </Form.Item>

            <Form.Item className="form-buttons">
              <Space size="middle">
                <Button 
                  onClick={() => navigate(-1)} 
                  size="large"
                >
                  Hủy
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  size="large"
                >
                  Đổi mật khẩu
                </Button>
              </Space>
            </Form.Item>
          </Form>

          <div className="password-tips">
            <Title level={5}>Lưu ý về mật khẩu:</Title>
            <ul>
              <li>Mật khẩu phải có ít nhất 6 ký tự</li>
              <li>Bao gồm ít nhất 1 chữ cái và 1 số</li>
              <li>Không nên sử dụng thông tin cá nhân dễ đoán</li>
              <li>Thay đổi mật khẩu định kỳ để bảo mật tài khoản</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChangePassword; 