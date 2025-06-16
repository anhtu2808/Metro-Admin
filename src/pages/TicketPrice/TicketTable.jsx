import React from "react";
import { Button, Modal, Space, Table } from "antd";

const data = [
  {
    key: "1",
    ticketType: "Vé 1 ngày",
    price: "40.000 đ",
  },
  {
    key: "2",
    ticketType: "Vé 3 ngày",
    price: "90.000 đ",
  },
  {
    key: "3",
    ticketType: "Vé tháng",
    price: "300.000 đ",
  },
  {
    key: "4",
    ticketType: "Vé tháng HSSV",
    price: "150.000 đ",
  },
  {
    key: "5",
    ticketType: "Bến xe Suối Tiên - Đại học Quốc Gia",
    price: "6.000 đ",
  },
  {
    key: "6",
    ticketType: "Bến xe Suối Tiên - Khu Công Nghệ Cao",
    price: "6.000 đ",
  },
];

const TicketTable = () => {
  const handleDelete = () => {
    Modal.confirm({
      title: "Are you sure you want to delete this ticket?",
    });
  };

  const handleUpdate = () => {
    alert("me");
  };

  return (
    <Table dataSource={data} pagination={false}>
      <Table.Column
        title="Ticket Type"
        dataIndex="ticketType"
        key="ticketType"
      />
      <Table.Column title="Price" dataIndex="price" key="price" />
      <Table.Column
        title="Action"
        key="action"
        render={(_, record) => (
          <Space size="middle">
            <Button color="cyan" variant="solid" onClick={() => handleUpdate()}>
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

export default TicketTable;
