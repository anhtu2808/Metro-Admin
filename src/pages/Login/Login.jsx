import { Button, Divider, Form, Input, Row, Col, message } from "antd";
import "./Login.css";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { loginAPI } from "../../apis";
import { useDispatch } from "react-redux";
import { setIsAuthorized, resetUser } from "../../redux/userSlice";
import { useEffect } from "react";

const Login = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("accessToken");
    dispatch(resetUser());
    dispatch(setIsAuthorized(false));
  }, [dispatch]);

  const handleLogin = async () => {
    try {
      const values = await form.validateFields();
      const { username, password } = values;

      const res = await loginAPI(username, password);
      if (res.code === 200) {
        localStorage.setItem("accessToken", res.result.token);
        dispatch(setIsAuthorized(true));
        message.success("Đăng nhập thành công");
        navigate("/");
      }
    } catch (error) {
      if (error.response?.status === 401) {
        message.error("Tài khoản hoặc mật khẩu không đúng");
      } else if (error.errorFields) {
        // Form validation errors
      }
    }
  };

  return (
    <Row justify="center" className="login-row">
      <Col xs={24} md={16} lg={8}>
        <fieldset className="login-fieldset">
          <legend className="login-legend">Login</legend>
          <Form
            form={form}
            name="basic"
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Username"
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleLogin}>
                Login
              </Button>
            </Form.Item>
          </Form>
          <Link to="/">
            <ArrowLeftOutlined /> Back HomePage
          </Link>
          <Divider />
          <div className="login-register">
            No account yet? <Link to="/register">Register</Link>
          </div>
        </fieldset>
      </Col>
    </Row>
  );
};

export default Login;
