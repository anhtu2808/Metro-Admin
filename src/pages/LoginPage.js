import { Button, Divider, Form, Input, Row, Col, notification } from "antd";
import "./Login.css";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { postLogin } from "../apis";

const LoginPage = () => {
  const login = async (values) => {
    const { email, password } = values;

    try {
      const res = await postLogin(email, password);

      if (res) {
        localStorage.setItem("accessToken", res.data.accessToken);
        notification.success({
          message: "LOGIN USER",
          description: "Đăng nhập thành công",
        });
      }
    } catch (error) {
      if (error.response?.status === 401) {
        notification.error({
          message: "LOGIN USER",
          description: "Tài khoản hoặc mật khẩu không đúng",
        });
      }
    }
  };

  return (
    <Row justify="center" className="login-row">
      <Col xs={24} md={16} lg={8}>
        <fieldset className="login-fieldset">
          <legend className="login-legend">Login</legend>
          <Form
            name="basic"
            onFinish={login}
            autoComplete="off"
            layout="vertical"
          >
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  type: "email",
                  message: "Please input your email!",
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
              <Button type="primary" htmlType="submit">
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

export default LoginPage;
