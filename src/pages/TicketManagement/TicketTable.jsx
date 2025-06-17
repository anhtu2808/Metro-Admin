import React from "react";
import { Button, Modal, Space, Table, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";


const data = [
  {
    id: "1",
    ticketCode: "T001",
    ticketName: "Vé 1 ngày",
    description: "Vé di chuyển không giới hạn trong 1 ngày",
    price: "40.000 đ",
    validationDays: 1,
  },
  {
    id: "2",
    ticketCode: "T002",
    ticketName: "Vé 3 ngày",
    description: "Vé di chuyển không giới hạn trong 3 ngày",
    price: "90.000 đ",
    validationDays: 3,
  },
  {
    id: "3",
    ticketCode: "T003",
    ticketName: "Vé tháng",
    description: "Vé di chuyển không giới hạn trong 1 tháng",
    price: "300.000 đ",
    validationDays: 30,
  },
  {
    id: "4",
    ticketCode: "T004",
    ticketName: "Vé tháng HSSV",
    description: "Vé ưu đãi dành cho học sinh sinh viên",
    price: "150.000 đ",
    validationDays: 30,
  }
];

const TicketTable = () => {
  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa vé "${record.ticketName}"?`,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        console.log("Deleting ticket:", record);
        // Add delete logic here
      },
    });
  };

  const handleUpdate = (record) => {
    console.log("Updating ticket:", record);
    // Add update logic here
  };

  return (
    <Table dataSource={data} pagination={false}>
      <Table.Column
        title="ID"
        dataIndex="id"
        key="id"
        width={120}
      />
      <Table.Column
        title="Code"
        dataIndex="ticketCode"
        key="ticketCode"
        width={200}
      />
      <Table.Column
        title="Tên vé"
        dataIndex="ticketName"
        key="ticketName"
        width={200}
      />
      <Table.Column
        title="Mô tả"
        dataIndex="description"
        key="description"
        ellipsis={{
          showTitle: false,
        }}
        render={(description) => (
          <Tooltip placement="topLeft" title={description}>
            {description}
          </Tooltip>
        )}
      />
      <Table.Column
        title="Giá vé"
        dataIndex="price"
        key="price"
        width={120}
        align="center"
      />
      <Table.Column
        title="Hạn sử dụng"
        dataIndex="validationDays"
        key="validationDays"
        width={140}
        align="center"
        render={(days) => `${days} ngày`}
      />
      <Table.Column
        title="Action"
        key="action"
        width={120}
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

export default TicketTable;
