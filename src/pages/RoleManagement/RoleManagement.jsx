import React, { useEffect, useState } from "react";
import { Table, Checkbox, message, Modal, Form, Input, Button } from "antd";
import { ReloadOutlined, SearchOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setLayoutData } from "../../redux/layoutSlice";
import { FaLock } from "react-icons/fa";
import {
  createPermissionAPI,
  fetchPermissionsAPI,
  fetchRolesAPI,
  updateRoleAPI,
  updatePermissionAPI,
} from "../../apis";
import "./RoleManagement.css";

const RoleManagement = () => {
  const dispatch = useDispatch();
  const [permissionsData, setPermissionsData] = useState([]);
  const [rolesData, setRolesData] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [editingPermission, setEditingPermission] = useState(null);
  const [editForm] = Form.useForm();

  // Set title và icon cho trang
  useEffect(() => {
    dispatch(
      setLayoutData({
        title: "Role Management",
        icon: <FaLock />,
      })
    );
  }, [dispatch]);

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        const createPermisstion = async (v) => {
          try {
            const response = await createPermissionAPI(v);
            if (response.code === 200) {
              setPermissionsData([...permissionsData, response.result]);
              message.success("Thêm quyền thành công");
            } else {
              message.error("Thêm quyền thất bại");
            }
          } catch (error) {
            message.error(error.message);
          }
        };
        createPermisstion(values);
        setIsModalVisible(false);
        form.resetFields();
      })
      .catch((info) => {
        console.log("Validation failed:", info);
      });
  };

  const fetchData = async () => {
    try {
      const roleResponse = await fetchRolesAPI();
      const roles = (roleResponse.result || []).map(role => ({
        ...role,
        permissionArr: (role.permissions || []).map(p => p.id)
      }));
      setRolesData(roles);
      const permissionResponse = await fetchPermissionsAPI();
      setPermissionsData(permissionResponse.result || []);
    } catch (error) {
      message.error("Failed to fetch data");
    }
  };

  const handleCheckboxChange = (roleName, permissionId) => {
    setRolesData((prev) =>
      prev.map((role) => {
        if (role.name === roleName) {
          if (!role.permissionArr) {
            role.permissionArr = [];
          }
          if (role.permissionArr.includes(permissionId)) {
            role.permissionArr = role.permissionArr.filter(
              (p) => p !== permissionId
            );
          } else {
            role.permissionArr.push(permissionId);
          }
        }
        return role;
      })
    );
  };

  const handleSave = async (roleName) => {
    const role = rolesData.find((role) => role.name === roleName);
    if (!role) {
      message.error(`Role ${roleName} not found`);
      return;
    }
    if (!role.id) {
      message.error(`Role ${roleName} is missing id`);
      return;
    }
    const permissions = role.permissionArr || [];
    const roleRequest = {
      name: roleName,
      permissions: permissions,
    };
    try {
      const response = await updateRoleAPI(role.id, roleRequest);
      if (response.code === 200) {
        message.success("Cập quyền cho role " + roleName + " thành công");
      } else {
        console.log(response);
        message.error("Cập quyền cho role " + roleName + " thất bại");
      }
    } catch (error) {
      message.error(error.result.message);
    }
  };

  const handleEditPermission = (permission) => {
    setEditingPermission(permission);
    editForm.setFieldsValue({
      name: permission.name,
      description: permission.description,
    });
  };

  const handleUpdatePermission = async () => {
    try {
      const values = await editForm.validateFields();
      const response = await updatePermissionAPI(editingPermission.id, values);
      if (response.code === 200) {
        setPermissionsData((prev) =>
          prev.map((p) =>
            p.id === editingPermission.id ? { ...p, ...values } : p
          )
        );
        message.success("Cập nhật quyền thành công");
        setEditingPermission(null);
      } else {
        message.error("Cập nhật quyền thất bại");
      }
    } catch (error) {
      message.error(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const roleColumns = [
    {
      title: "Permission",
      dataIndex: "permission",
      key: "permission",
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search permission"
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => confirm()}
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters()} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
      ),
      onFilter: (value, record) =>
        record.permission.toLowerCase().includes(value.toLowerCase()),
    },
    ...rolesData.map((role) => ({
      title: role.name,
      key: role.name,
      render: (_, record) => {
        const foundRole = rolesData.find((r) => r.name === role.name);
        const hasPermission = foundRole &&
          foundRole.permissionArr &&
          foundRole.permissionArr.includes(record.id);
        return (
          <Checkbox
            checked={hasPermission}
            onChange={() => handleCheckboxChange(role.name, record.id)}
          />
        );
      },
    })),
  ];

  const roleDataSource = permissionsData.map((permission) => ({
    permission: permission.name,
    key: permission.name,
    id: permission.id,
  }));

  const filteredRoleDataSource = roleDataSource.filter((item) =>
    item.permission.toLowerCase().includes(searchText.toLowerCase())
  );

  const permissionColumns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Permission",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button size="small" onClick={() => handleEditPermission(record)}>
          Update
        </Button>
      ),
    },
  ];

  return (
    <div className="role-container">
      <div className="role-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Input
            placeholder="Search permissions"
            prefix={<SearchOutlined />}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 200 }}
            allowClear
          />
          <Button icon={<ReloadOutlined />} onClick={fetchData} />
        </div>
      </div>
      <Table
        dataSource={filteredRoleDataSource}
        columns={roleColumns}
        rowKey="permission"
        bordered
        pagination={false}
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row>
              <Table.Summary.Cell index={0}>Action</Table.Summary.Cell>
              {rolesData.map((role) => (
                <Table.Summary.Cell key={role.name} index={role.name}>
                  <Button
                    size="small"
                    type="primary"
                    onClick={() => handleSave(role.name)}
                  >
                    Save {role.name}
                  </Button>
                </Table.Summary.Cell>
              ))}
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />

      <h1 className="mt-4">Permission Management</h1>
      <Table
        dataSource={permissionsData}
        columns={permissionColumns}
        rowKey="name"
        bordered
        pagination={false}
      />
      <Button className="mt-3" type="primary" onClick={() => setIsModalVisible(true)}>
        Add Permission
      </Button>

      <Modal
        open={isModalVisible}
        title="Add new Permission"
        onCancel={() => setIsModalVisible(false)}
        onOk={handleOk}
        destroyOnClose
      >
        <Form form={form} layout="vertical" name="add_permission">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the permission name!" }]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input the description!" }]}
          >
            <Input placeholder="Description" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        open={!!editingPermission}
        title="Update Permission"
        onCancel={() => setEditingPermission(null)}
        onOk={handleUpdatePermission}
        destroyOnClose
      >
        <Form form={editForm} layout="vertical" name="edit_permission">
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please input the permission name!" }]}
          >
            <Input placeholder="Name" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: "Please input the description!" }]}
          >
            <Input placeholder="Description" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleManagement;
