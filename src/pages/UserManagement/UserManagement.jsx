import { Col, Form, Input, message, Modal, Row, Spin, Tabs, Select } from "antd";
import { useCallback, useEffect, useState } from "react";
import { FaUser, FaUserPlus } from "react-icons/fa";
import TableUser from "./TableUser";
import { getAllUsersAPI, createUserAPI, updateUserAPI, deleteUserAPI, unBanUserAPI } from "../../apis/";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import "./UserManagement.css";
import { useDispatch } from "react-redux";
import { setLayoutData } from "../../redux/layoutSlice";
import ModalFormUser from "./ModalFormUser";
import { usePermission } from "../../hooks/usePermission";


const ROLE_TYPES = ["CUSTOMER", "STAFF", "MANAGER"];

const UserManagement = () => {
  const dispatch = useDispatch();

  const isCanManageCustomer = usePermission("CUSTOMER_MANAGE");
  const isCanManageStaff = usePermission("STAFF_MANAGE");
  const isCanManageManager = usePermission("MANAGER_MANAGE");
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

  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    deleted: '0', // 'all', '0' (active), '1' (inactive)
    username: '',
    email: ''
  });

  // Pagination states
  const [paginationByRole, setPaginationByRole] = useState({
    CUSTOMER: { current: 1, pageSize: 10, total: 0 },
    STAFF: { current: 1, pageSize: 10, total: 0 },
    MANAGER: { current: 1, pageSize: 10, total: 0 },
  });


  const mapUserResponse = (user) => ({
    id: user.id,
    firstName: user.firstName || "Chưa có tên",
    lastName: user.lastName || "Chưa có họ",
    username: user.username || "Chưa có tên đăng nhập",
    email: user.email || "Không rõ email",
    phone: user.phone || "Không rõ số điện thoại",
    address: user.address || "Không rõ địa chỉ",
    deleted: user.deleted || 0, // Add deleted status
    createdAt: user.createAt
      ? new Date(user.createAt).toLocaleDateString("vi-VN")
      : new Date().toLocaleDateString("vi-VN"),
    updatedAt: user.updateAt
      ? new Date(user.updateAt).toLocaleDateString("vi-VN")
      : new Date().toLocaleDateString("vi-VN"),
    avatarUrl: user.avatarUrl || "",
  });

  const loadUsersByRole = async (
    roleType = "CUSTOMER",
    isInitial = false,
    customFilters = null,
    customPagination = null
  ) => {
    try {
      isInitial ? setInitialLoading(true) : setLoading(true);

      // Use custom filters or current filters
      const currentFilters = customFilters || filters;
      const currentPagination = customPagination || paginationByRole[roleType];

      // Build API parameters
      const apiParams = {
        page: currentPagination.current,
        size: currentPagination.pageSize,
        sort: 'id',
        role: roleType,
        ...(currentFilters.deleted !== 'all' && { deleted: currentFilters.deleted }),
        ...(currentFilters.search && { search: currentFilters.search }),
        ...(currentFilters.username && { username: currentFilters.username }),
        ...(currentFilters.email && { email: currentFilters.email })
      };

      const response = await getAllUsersAPI(apiParams);
      if (response.code === 200 && response.result) {
        const { data, currentPage, pageSize, totalElements } = response.result;

        if (Array.isArray(data)) {
          const users = data.map(mapUserResponse);
        
          setFilteredUsersByRole((prev) => ({ ...prev, [roleType]: users }));

          // Update pagination state
          setPaginationByRole((prev) => ({
            ...prev,
            [roleType]: {
              current: currentPage,
              pageSize: pageSize,
              total: totalElements
            }
          }));
        } else {
          throw new Error("API không trả về danh sách hợp lệ");
        }
      } else {
        throw new Error("API response error");
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

        // Reload data with current pagination
        const targetRole = payload.roleType;
        const targetPagination = isEdit
          ? paginationByRole[targetRole] // Stay on current page for edit
          : { current: 1, pageSize: paginationByRole[targetRole].pageSize, total: 0 }; // Go to first page for new user

        await loadUsersByRole(targetRole, false, filters, targetPagination);

        // If the target role is not current tab, also update current tab
        if (targetRole !== activeRoleTab) {
          await loadUsersByRole(activeRoleTab, false, filters, paginationByRole[activeRoleTab]);
        }
        handleModalCancel();
      } else {
        throw new Error(response?.message || "Lỗi không xác định");
      }
    } catch (error) {
      message.error(
        error?.response?.data?.message || "Không thể tạo/cập nhật người dùng"
      );
    } finally {

    }
  };

  const handleStatusChange = async (user, newStatus) => {
    const isActivating = newStatus === 0;
    const actionText = isActivating ? "kích hoạt" : "vô hiệu hóa";

    Modal.confirm({
      title: `Xác nhận ${actionText} tài khoản`,
      content: `Bạn có chắc chắn muốn ${actionText} tài khoản "${user.username}"?`,
      okText: isActivating ? "Kích hoạt" : "Vô hiệu hóa",
      okType: isActivating ? "primary" : "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          if (isActivating) {
            await unBanUserAPI(user.id);
            message.success("Đã kích hoạt tài khoản thành công");
          } else {
            await deleteUserAPI(user.id);
            message.success("Đã vô hiệu hóa tài khoản thành công");
          }
          await loadUsersByRole(activeRoleTab, false, filters, paginationByRole[activeRoleTab]);
        } catch (error) {
          console.error(`Lỗi khi ${actionText} tài khoản:`, error);
          message.error(`Không thể ${actionText} tài khoản`);
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

  const handleSearch = async (formValues) => {
    const newFilters = {
      search: formValues.search || '',
      deleted: formValues.deleted || 'all',
      username: formValues.username || '',
      email: formValues.email || ''
    };

    setFilters(newFilters);
    await loadUsersByRole(activeRoleTab, false, newFilters);
  };

  const handleFilterChange = async (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value
    };

    setFilters(newFilters);

    // Reset to page 1 when filtering
    const resetPagination = {
      current: 1,
      pageSize: paginationByRole[activeRoleTab].pageSize,
      total: 0
    };

    // For dropdown selections, call API immediately
    // For text inputs, let debounce effect handle it
    if (filterType === 'deleted') {
      await loadUsersByRole(activeRoleTab, false, newFilters, resetPagination);
    }
  };


  const handleTabChange = async (key) => {
    setActiveRoleTab(key);
    await loadUsersByRole(key, false, filters);
  };

  const handleTableChange = async (pagination) => {
    const newPagination = {
      current: pagination.current,
      pageSize: pagination.pageSize,
      total: paginationByRole[activeRoleTab].total
    };

    await loadUsersByRole(activeRoleTab, false, filters, newPagination);
  };

  // Set title và icon cho trang
  useEffect(() => {
    dispatch(setLayoutData({ title: "Quản lý người dùng", icon: <FaUser /> }));
    // Load data for all roles with default filters and pagination
    ROLE_TYPES.forEach((role) => loadUsersByRole(role, true, {
      search: '',
      deleted: 'all',
      username: '',
      email: ''
    }, {
      current: 1,
      pageSize: 10,
      total: 0
    }));
  }, [dispatch]);

  // Debounce effect for search filters
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Reset to page 1 when searching
      const resetPagination = {
        current: 1,
        pageSize: paginationByRole[activeRoleTab].pageSize,
        total: 0
      };

      // Load data when any text filter changes (including when cleared)
      loadUsersByRole(activeRoleTab, false, filters, resetPagination);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [filters.search, filters.username, filters.email, activeRoleTab]);

  const items = ROLE_TYPES.filter((role) =>( isCanManageCustomer && role === "CUSTOMER") || (isCanManageStaff && role === "STAFF" )|| (isCanManageManager && role === "MANAGER")).map((role, index) => ({
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
        handleStatusChange={handleStatusChange}
        pagination={paginationByRole[role]}
        onTableChange={handleTableChange}
      />
    ),
  }));

  return (
    <>
      <div className="manage-user-container">
        <div className="users-content" style={{ marginTop: "20px" }}>
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col xs={24} md={16}>
              <Form
                form={form}
                layout="inline"
                name="searchForm"
                onFinish={handleSearch}
                initialValues={filters}
              >

                <Form.Item name="search" style={{ minWidth: 200 }}>
                  <Input
                    placeholder="Tìm kiếm chung..."
                    allowClear
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </Form.Item>

                <Form.Item name="username" style={{ minWidth: 150 }}>
                  <Input
                    placeholder="Tên đăng nhập..."
                    allowClear
                    value={filters.username}
                    onChange={(e) => handleFilterChange('username', e.target.value)}
                  />
                </Form.Item>

                <Form.Item name="email" style={{ minWidth: 150 }}>
                  <Input
                    placeholder="Email..."
                    allowClear
                    value={filters.email}
                    onChange={(e) => handleFilterChange('email', e.target.value)}
                  />
                </Form.Item>

                <Form.Item name="deleted" style={{ minWidth: 120 }}>
                  <Select
                    placeholder="Trạng thái"
                    value={filters.deleted}
                    onChange={(value) => handleFilterChange('deleted', value)}
                    defaultValue="0"
                    options={[
                      { value: 'all', label: 'Tất cả' },
                      { value: '0', label: 'Hoạt động' },
                      { value: '1', label: 'Vô hiệu hóa' }
                    ]}
                  />
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
                activeKey={activeRoleTab}
                items={items}
                onChange={handleTabChange}
              />
            )}
          </div>

          <ModalFormUser
            isCanManageCustomer={isCanManageCustomer}
            isCanManageStaff={isCanManageStaff}
            isCanManageManager={isCanManageManager}
            onSubmit={handleCreateOrUpdateUser}
            visible={isModalVisible}
            onCancel={handleModalCancel}
            editingUser={editingUser}
            loading={loading}
          />
        </div>
      </div>
    </>
  );
};

export default UserManagement;
