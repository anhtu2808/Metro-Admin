import React from "react";
import { Button, Modal, Space, Table } from "antd";
const { Column, ColumnGroup } = Table;
const data = [
  {
    key: "1",
    firstName: "John",
    lastName: "Brown",
    email: "hao@gmail.com",
    createdDate: "21/09/2023",
  },
  {
    key: "2",
    firstName: "Jim",
    lastName: "Green",
    email: "hao@gmail.com",
    createdDate: "21/09/2023",
  },
  {
    key: "3",
    firstName: "Joe",
    lastName: "Black",
    email: "hao@gmail.com",
    createdDate: "21/09/2023",
  },
];

const TableUser = () => {
  const handleDelete = () => {
    Modal.confirm({
      title: "Are you sure, you want to delete this user?",
    });
  };
  return (
    <Table dataSource={data}>
      <ColumnGroup title="Name">
        <Column title="First Name" dataIndex="firstName" key="firstName" />
        <Column title="Last Name" dataIndex="lastName" key="lastName" />
      </ColumnGroup>
      <Column title="Email" dataIndex="email" key="email" />
      <Column title="Created Date" dataIndex="createdDate" key="createdDate" />
      <Column
        title="Action"
        key="action"
        render={(_, record) => (
          <Space size="middle">
            <Button color="cyan" variant="solid">
              Update
            </Button>
            <Button type="primary" danger onClick={() => handleDelete()}>
              Delete
            </Button>
          </Space>
        )}
      />
    </Table>
  );
};
export default TableUser;
