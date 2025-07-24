import React, { useState } from "react";
import { Form, Input, Row, Col, message } from "antd";
import { resetPasswordAPI } from "../../apis";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import Preloader from "../../components/Preloader/Preloader";
import "./ResetPassword.css"; // Dùng lại layout Login

const ResetPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const payload = {
        email: values.email,
        otpCode: values.otpCode,
        newPassword: values.newPassword,
      };
      await resetPasswordAPI(payload);
      message.success("Đổi mật khẩu thành công");
      navigate("/login");
    } catch (error) {
      message.error(error?.response?.data?.message || "Đổi mật khẩu thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Preloader fullscreen={true} />}

      <Row className="login-page">
        <Col xs={0} md={12} className="login-left">
          <img
            className="login-image"
            src="/Metro_Login.gif"
            alt="Metro Reset Password"
          />
        </Col>
        <Col xs={24} md={12} className="login-right">
          <div className="login-form-wrapper">
            <img src="/Metro_Logo.png" alt="Metro Logo" className="login-logo" />
            <h2 className="login-title">Đặt lại mật khẩu</h2>
            <Form form={form} layout="vertical" onFinish={onFinish} className="login-form">
              <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: "Vui lòng nhập email" }]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Mã OTP"
                name="otpCode"
                rules={[{ required: true, message: "Vui lòng nhập mã OTP" }]}
              >
                <Input size="large" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu mới"
                name="newPassword"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu mới" }]}
              >
                <Input.Password size="large" />
              </Form.Item>

              <Form.Item>
                <PrimaryButton
                  className="login-button"
                  type="primary"
                  htmlType="submit"
                  size="login"
                >
                  Đặt lại mật khẩu
                </PrimaryButton>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ResetPassword;
