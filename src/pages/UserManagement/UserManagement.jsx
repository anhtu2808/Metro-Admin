import { Col, Form, Input, Row, Tabs } from "antd";
import { useEffect, useState } from "react";
import { FaUser, FaUserPlus, FaSearch } from "react-icons/fa";
import ModalCreateUser from "./ModalCreateUser";
import TableUser from "./TableUser";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import "./UserManagement.css";
import { useDispatch } from "react-redux";
import { setLayoutData } from "../../redux/layoutSlice";

const UserManagement = () => {
  const [showModalCreateUser, setShowModalCreateUser] = useState(false);
  const dispatch = useDispatch();
  const onChange = (key) => {
    console.log("Đã chọn tab:", key);
  };

  const items = [
    {
      key: "1",
      label: "Khách hàng",
      children: <TableUser />,
    },
    {
      key: "2",
      label: "Nhân viên",
      children: "Nội dung tab Nhân viên (đang cập nhật...)",
    },
  ];
  // Set title và icon cho trang
  useEffect(() => {
    dispatch(setLayoutData({
      title: "Quản lý người dùng",
      icon: <FaUser />,
    }));
  }, [dispatch]);

  return (
    <div className="manage-user-container">

      <div className="users-content" style={{ marginTop: "20px" }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Form layout="inline" name="searchForm">
              <Form.Item name="query" style={{ flex: 1 }}>
                <Input
                  placeholder="Tìm kiếm theo tên hoặc email"
                  allowClear
                />
              </Form.Item>
              <Form.Item>
                <PrimaryButton 
                  htmlType="submit" 
                  icon={<FaSearch />}
                  size="medium"
                >
                  Tìm kiếm
                </PrimaryButton>
              </Form.Item>
            </Form>
          </Col>

          <Col xs={24} md={8} style={{ textAlign: "right" }}>
            <PrimaryButton
              icon={<FaUserPlus />}
              style={{
                borderRadius: 8,
                padding: "8px 16px",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: 8,
                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
              }}
              onClick={() => setShowModalCreateUser(true)}
            >
              Tạo tài khoản
            </PrimaryButton>
          </Col>
        </Row>

        <div className="table-user" style={{ marginTop: "24px" }}>
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>

        <ModalCreateUser
          isModalOpen={showModalCreateUser}
          setIsModalOpen={setShowModalCreateUser}
        />
      </div>
    </div>
  );
};

export default UserManagement;
