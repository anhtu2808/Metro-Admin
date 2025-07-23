import {
  Form,
  Input,
  Row,
  Col,
  message,
} from "antd";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { loginAPI } from "../../apis";
import { useDispatch } from "react-redux";
import { setIsAuthorized, resetUser } from "../../redux/userSlice";
import { useEffect, useState } from "react";
import "./Login.css";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import Preloader from "../../components/Preloader/Preloader";

const Login = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    localStorage.removeItem("accessToken");
    dispatch(resetUser());
    dispatch(setIsAuthorized(false));
  }, [dispatch]);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();
      const { username, password } = values;

      const res = await loginAPI(username, password);
      if (res.code === 200) {
        localStorage.setItem("accessToken", res.result.token);
        dispatch(setIsAuthorized(true));
        // Decode token để lấy scope
      const decoded = jwtDecode(res.result.token);
      const scope = decoded.scope || "";
        message.success("Đăng nhập thành công");
        if (scope.includes("ROLE_MANAGER")) {
          navigate("/");
        } else if (scope.includes("ROLE_STAFF")) {
          navigate("/ticket-management");
        } else {
          message.warning("Bạn không có quyền hợp lệ");
        }
      }
    } catch (error) {
      if (error.response?.status === 401) {
        message.error("Tài khoản hoặc mật khẩu không đúng");
      } else if (error.errorFields) {
        // Form validation error
      } else {
        message.error("Đăng nhập thất bại, có lỗi xảy ra");
      } 
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading && <Preloader fullscreen={true} />}

      <Row className="login-page">
        <Col xs={0} md={12} className="login-left">
          <img
            className="login-image"
            src="/Metro_Login.gif"
            alt="Metro Login"
          />
        </Col>
        <Col xs={24} md={12} className="login-right">
          <div className="login-form-wrapper">
            <img src="/Metro_Logo.png" alt="Metro Logo" className="login-logo" />
            <Form form={form} layout="vertical" className="login-form" onFinish={handleLogin}>
              <Form.Item
                name="username"
                className="username-input"
                rules={[{ required: true, message: "Vui lòng nhập tên đăng nhập!" }]}
              >
                <Input size="large" placeholder="Tên đăng nhập" />
              </Form.Item>
              <Form.Item
                name="password"
                className="password-input"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password size="large" placeholder="Mật khẩu" />
              </Form.Item>
              <Form.Item>
                <PrimaryButton className="login-button" type="primary" htmlType="submit" size="login">Đăng nhập</PrimaryButton>
              </Form.Item>
            </Form>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default Login;
