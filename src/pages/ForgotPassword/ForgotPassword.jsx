import React, { useState } from "react";
import { Form, Input, Row, Col, message } from "antd";
import { forgotPasswordAPI } from "../../apis";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import Preloader from "../../components/Preloader/Preloader";
import "./ForgotPassword.css"; // dùng lại CSS của Login

const ForgotPassword = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await forgotPasswordAPI(values.email);
      message.success("Đã gửi mã OTP. Vui lòng kiểm tra email!");
      navigate("/reset-password", { state: { email: values.email } });
    } catch (err) {
      console.error(err);
      message.error(
        err?.response?.data?.message ||
        "Gửi mã OTP thất bại. Vui lòng thử lại."
      );
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
            alt="Metro Forgot"
          />
        </Col>
        <Col xs={24} md={12} className="login-right">
          <div className="login-form-wrapper">
            <img src="/Metro_Logo.png" alt="Metro Logo" className="login-logo" />
            <h2 className="login-title">Quên mật khẩu</h2>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
              className="login-form"
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: "Vui lòng nhập email" }]}
              >
                <Input type="email" placeholder="Nhập email" size="large" />
              </Form.Item>

              <Form.Item>
                <PrimaryButton
                  className="login-button"
                  type="primary"
                  htmlType="submit"
                  size="login"
                >
                  Gửi mã OTP
                </PrimaryButton>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ForgotPassword;
