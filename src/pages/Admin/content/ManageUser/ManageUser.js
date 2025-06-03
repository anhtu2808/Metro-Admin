import { Col, Divider, Form, Input, Menu, Row, Tabs } from "antd";
import { Button } from "antd";
import ModalCreateUser from "./ModalCreateUser";
import "./ManageUser.css";
import { useState } from "react";
import TableUser from "./TableUser";
import { FaUser } from "react-icons/fa";
import LoginPage from "../../../Login/LoginPage";

const onChange = (key) => {
  console.log(key);
};
const items = [
  {
    key: "1",
    label: "Client",
    children: <TableUser />,
  },
  {
    key: "2",
    label: "Staff",
    children: "Content of Tab Pane 2",
  },
];

const ManageUser = () => {
  const [showModalCreateUser, setShowModalCreateUser] = useState(false);

  return (
    <div className="manage-user-container">
      <div className="title">
        {" "}
        <FaUser />
        Manage User
      </div>
      <Divider></Divider>
      <div className="users-content">
        <Row>
          <Col md={18}>
            <Form
              layout="inline"
              name="searchForm"
              // onFinish={this.handleSearch}
              style={{ marginLeft: "120px" }}
            >
              <Button type="primary" htmlType="submit">
                Search
              </Button>
              <Form.Item name="query" style={{ width: "75%" }}>
                <Input></Input>
              </Form.Item>
            </Form>
          </Col>
          <Col md={6}>
            <Button type="primary" onClick={() => setShowModalCreateUser(true)}>
              Add new users
            </Button>
          </Col>
        </Row>
        <div class="tabs">
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />;
        </div>
        <ModalCreateUser
          isModalOpen={showModalCreateUser}
          setIsModalOpen={setShowModalCreateUser}
        />
        <div></div>
      </div>
    </div>
  );
};

export default ManageUser;
