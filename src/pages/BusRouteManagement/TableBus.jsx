import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Space, Table, Tag, Tooltip } from "antd";

const TableBus = ({ data, loading, onEdit, onDelete }) => {
  const columns = [
    {
      title: "Mã xe Bus",
      dataIndex: "busCode",
      key: "busCode",
      width: 120,
      render: (text) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Trạm",
      dataIndex: "busStationName",
      key: "busStationName",
      width: 200,
    },
    {
      title: "Điểm bắt đầu",
      dataIndex: "startLocation",
      key: "startLocation",
      width: 200,
    },
    {
      title: "Điểm kết thúc",
      dataIndex: "endLocation",
      key: "endLocation",
      width: 200,
    },
    {
      title: "Tần suất chạy (phút)",
      dataIndex: "headwayMinutes",
      key: "headwayMinutes",
      width: 180,
      render: (value) => `${value} phút`,
    },
    {
      title: "Khoảng cách tới ga Metro (km)",
      dataIndex: "distanceToStation",
      key: "distanceToStation",
      width: 220,
      render: (value) => `${value} km`,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 120,
      render: (date) => <span style={{ fontSize: "12px" }}>{date}</span>,
    },
    {
      title: "Thao tác",
      key: "actions",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Cập nhật">
            <Button icon={<EditOutlined />} onClick={() => onEdit(record)} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="bus-routes-table">
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 8 }}
        rowKey="id"
      />
    </div>
  );
};

export default TableBus;
