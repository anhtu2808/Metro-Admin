import {
  Button,
  Col,
  Form,
  Input,
  message,
  Modal,
  Row,
  Spin,
  Tabs,
} from "antd";
import { useCallback, useEffect, useState } from "react";
import { FaUser, FaUserPlus, FaSearch } from "react-icons/fa";
import TableUser from "./TableUser";
import {
  getUserByRoleAPI,
  createUserAPI,
  updateUserAPI,
  deleteUserAPI,
} from "../../apis/";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import "./UserManagement.css";
import { useDispatch } from "react-redux";
import { setLayoutData } from "../../redux/layoutSlice";
import ModalFormUser from "./ModalFormUser";

const ROLE_TYPES = ["CUSTOMER", "STAFF", "MANAGER"];

const UserManagement = () => {
  const dispatch = useDispatch();
  const [usersByRole, setUsersByRole] = useState({
    CUSTOMER: [],
    STAFF: [],
    MANAGER: [],
  });
  const [filteredUsersByRole, setFilteredUsersByRole] = useState({
    CUSTOMER: [],
    STAFF: [],
    MANAGER: [],
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [activeRoleTab, setActiveRoleTab] = useState("CUSTOMER");
  const [form] = Form.useForm();
  const onChange = (key) => {
    console.log("Đã chọn tab:", key);
  };

  const mapUserResponse = (user) => ({
    id: user.id,
    firstName: user.firstName || "Chưa có tên",
    lastName: user.lastName || "Chưa có họ",
    username: user.username || "Chưa có tên đăng nhập",
    email: user.email || "Không rõ email",
    phone: user.phone || "Không rõ số điện thoại",
    address: user.address || "Không rõ địa chỉ",
    createdAt: user.createAt
      ? new Date(user.createAt).toLocaleDateString("vi-VN")
      : new Date().toLocaleDateString("vi-VN"),
    updatedAt: user.updateAt
      ? new Date(user.updateAt).toLocaleDateString("vi-VN")
      : new Date().toLocaleDateString("vi-VN"),
    avatarUrl: user.avatarUrl || "",
  });

  const loadUsersByRole = async (roleType = "CUSTOMER", isInitial = false) => {
    try {
      isInitial ? setInitialLoading(true) : setLoading(true);
      const response = await getUserByRoleAPI(roleType);
      if (response.code === 200 && Array.isArray(response.result)) {
        const users = response.result.map(mapUserResponse);
        setUsersByRole((prev) => ({ ...prev, [roleType]: users }));
        setFilteredUsersByRole((prev) => ({ ...prev, [roleType]: users }));
      } else {
        throw new Error("API không trả về danh sách hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi khi load người dùng:", error);
      message.error("Không thể tải danh sách người dùng");
    } finally {
      isInitial ? setInitialLoading(false) : setLoading(false);
    }
  };

  const handleCreateOrUpdateUser = async (formValues) => {
    try {
      const isEdit = !!editingUser;
      const payload = {
        ...formValues,
        avatarUrl: formValues.avatarUrl || null,
      };
      delete payload.confirm;

      const response = isEdit
        ? await updateUserAPI(editingUser.id, payload)
        : await createUserAPI(payload);

      if ([200, 201].includes(response?.code)) {
        message.success(`${isEdit ? "Cập nhật" : "Tạo"} người dùng thành công`);
        const updatedUser = mapUserResponse(response.result);

        setUsersByRole((prev) => ({
          ...prev,
          [payload.roleType]: isEdit
            ? prev[payload.roleType].map((user) =>
                user.id === updatedUser.id ? updatedUser : user
              )
            : [updatedUser, ...prev[payload.roleType]],
        }));

        setFilteredUsersByRole((prev) => ({
          ...prev,
          [payload.roleType]: isEdit
            ? prev[payload.roleType].map((user) =>
                user.id === updatedUser.id ? updatedUser : user
              )
            : [updatedUser, ...prev[payload.roleType]],
        }));
      } else {
        throw new Error(response?.message || "Lỗi không xác định");
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Không thể tạo/cập nhật người dùng"
      );
    } finally {
      handleModalCancel();
    }
  };

  const handleDeleteUser = async (user) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa người dùng này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteUserAPI(user.id);
          message.success("Đã xóa người dùng thành công");
          await loadUsersByRole(user.roleType);
        } catch (error) {
          console.error("Lỗi khi xóa người dùng:", error);
          message.error("Không thể xóa người dùng");
        }
      },
    });
  };

  const handleAdd = useCallback(() => {
    setEditingUser(null);
    setIsModalVisible(true);
  }, []);

  const handleEdit = useCallback((user) => {
    setEditingUser(user);
    setIsModalVisible(true);
  }, []);

  const handleModalCancel = useCallback(() => {
    setIsModalVisible(false);
    setEditingUser(null);
  }, []);

  const handleSearch = ({ query }) => {
    const currentUsers = usersByRole[activeRoleTab] || [];
    const lowerQuery = (query || "").toLowerCase();

    const filtered = currentUsers.filter(
      (user) =>
        user.firstName.toLowerCase().includes(lowerQuery) ||
        user.lastName.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery)
    );

    setFilteredUsersByRole((prev) => ({
      ...prev,
      [activeRoleTab]: filtered,
    }));
  };

  const handleTabChange = (key) => {
    const role = ROLE_TYPES[parseInt(key) - 1];
    setActiveRoleTab(role);
  };

  // Set title và icon cho trang
  useEffect(() => {
    dispatch(setLayoutData({ title: "Quản lý người dùng", icon: <FaUser /> }));
    ROLE_TYPES.forEach((role) => loadUsersByRole(role, true));
  }, [dispatch]);

  const items = ROLE_TYPES.map((role, index) => ({
    key: role,
    label:
      role === "CUSTOMER"
        ? "Khách hàng"
        : role === "STAFF"
        ? "Nhân viên"
        : "Quản lý",
    children: (
      <TableUser
        handleEdit={handleEdit}
        handleAdd={handleAdd}
        dataSource={filteredUsersByRole[role]}
        loading={loading}
        handleDelete={handleDeleteUser}
      />
    ),
  }));

  return (
    <div className="manage-user-container">
      <div className="users-content" style={{ marginTop: "20px" }}>
        <Row justify="space-between" align="middle" gutter={[16, 16]}>
          <Col xs={24} md={16}>
            <Form
              form={form}
              layout="inline"
              name="searchForm"
              onFinish={handleSearch}
            >
              <Form.Item name="query" style={{ flex: 1 }}>
                <Input placeholder="Tìm kiếm theo tên hoặc email" allowClear />
              </Form.Item>
              <Form.Item>
                <PrimaryButton
                  type="primary"
                  htmlType="submit"
                  icon={<FaSearch />}
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
              onClick={() => handleAdd()}
            >
              Tạo tài khoản
            </PrimaryButton>
          </Col>
        </Row>

        <div className="table-user" style={{ marginTop: "24px" }}>
          {initialLoading ? (
            <Spin />
          ) : (
            <Tabs
              defaultActiveKey="CUSTOMERS"
              items={items}
              onChange={setActiveRoleTab}
            />
          )}
        </div>

        <ModalFormUser
          onSubmit={handleCreateOrUpdateUser}
          visible={isModalVisible}
          onCancel={handleModalCancel}
          editingUser={editingUser}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default UserManagement;
