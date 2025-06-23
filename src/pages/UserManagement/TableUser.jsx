import React from "react";
import { Button, Modal, Space, Table, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const { Column } = Table;
const { confirm } = Modal;

const data = [
  {
    key: "1",
    firstName: "John",
    lastName: "Brown",
    username: "john_brown",
    email: "hao@gmail.com",
    createdDate: "21/09/2023",
  },
  {
    key: "2",
    firstName: "Jim",
    lastName: "Green",
    username: "jim_green",
    email: "hao@gmail.com",
    createdDate: "21/09/2023",
  },
  {
    key: "3",
    firstName: "Joe",
    lastName: "Black",
    username: "joe_black",
    email: "hao@gmail.com",
    createdDate: "21/09/2023",
  },
];

const TableUser = () => {
  const handleDelete = (record) => {
    confirm({
      title: `Bạn có chắc chắn muốn xóa người dùng "${record.firstName} ${record.lastName}" không?`,
      icon: <ExclamationCircleOutlined />,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        console.log("Xóa:", record);
        // TODO: Call API để xóa
      },
    });
  };

  const handleUpdate = (record) => {
    console.log("Cập nhật:", record);
    // TODO: Show form/modal update
  };

  return (
    <Table dataSource={data} bordered size="middle" pagination={{ pageSize: 5 }}>
  <Column
    title="Họ và Tên"
    key="fullName"
    render={(_, record) => `${record.firstName} ${record.lastName}`}
  />
  <Column title="Tên đăng nhập" dataIndex="username" key="username" />
  <Column title="Email" dataIndex="email" key="email" />
  <Column title="Ngày tạo" dataIndex="createdDate" key="createdDate" />
  <Column
    title="Hành động"
    key="action"
    align="center"
    render={(_, record) => (
      <Space>
        <Tooltip title="Cập nhật">
          <Button icon={<EditOutlined />} onClick={() => handleUpdate(record)} />
        </Tooltip>
        <Tooltip title="Xóa">
          <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)} />
        </Tooltip>
      </Space>
    )}
  />
</Table>

  );
};

export default TableUser;
