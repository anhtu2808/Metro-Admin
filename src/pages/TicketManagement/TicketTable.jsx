import React from "react";
import { Button, Modal, Space, Table, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const TicketTable = ({ ticketData, loading = false, handleOpenModal, handleDelete }) => {
  const onDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa vé "${record.name}"?`,
      okText: "Xóa",
      cancelText: "Hủy",
      onOk: () => {
        handleDelete(record);
      },
    });
  };

  const handleUpdate = (record) => {
    console.log("Updating ticket:", record);
    // Add update logic here
  };

  // Check if ticket is a single-use ticket (vé lượt)
  const isSingleUseTicket = (record) => {
    return record.validityDays === 0 || record.name.toLowerCase().includes("vé lượt");
  };

  return (
    <Table 
      dataSource={ticketData} 
      pagination={false} 
      rowKey="id"
      loading={loading}
    >
      <Table.Column
        title="ID"
        dataIndex="id"
        key="id"
        width={120}
      />
      <Table.Column
        title="Tên vé"
        dataIndex="name"
        key="name"
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
        render={(price) => price === 0 ? "Động" : `${price.toLocaleString()} VND`}
      />
      <Table.Column
        title="Hạn sử dụng"
        dataIndex="validityDays"
        key="validityDays"
        width={140}
        align="center"
        render={(days) => days === 0 ? "1 lượt" : `${days} ngày`}
      />
      <Table.Column
        title="Action"
        key="action"
        width={120}
        align="center"
        render={(_, record) => (
          <Space>
            <Tooltip title="Cập nhật">
              <Button icon={<EditOutlined />} onClick={() => handleOpenModal(record)} />
            </Tooltip>
            <Tooltip title={isSingleUseTicket(record) ? "Không thể xóa vé lượt" : "Xóa"}>
              <Button 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => onDelete(record)}
                disabled={isSingleUseTicket(record)}
              />
            </Tooltip>
          </Space>
        )}
      />
    </Table>
  );
};

export default TicketTable;
