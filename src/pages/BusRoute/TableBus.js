import { Button, Space, Table } from "antd";
import BusRoutes from "./BusRoutes";

const TableBus = () => {
  const columns = [
    {
      title: "Line",
      dataIndex: "line",
      key: "line",
    },
    {
      title: "Station",
      dataIndex: "station",
      key: "station",
    },
    {
      title: "Bus",
      dataIndex: "bus",
      key: "bus",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button
            color="cyan"
            variant="solid"
            onClick={() => handleUpdate(record)}
          >
            Update
          </Button>
          <Button type="primary" danger onClick={() => handleDelete(record)}>
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  const data = [
    {
      key: "1",
      line: "Suối Tiên - Bến Thành",
      station: "Suối Tiên",
      bus: "69",
    },
  ];

  const handleUpdate = (record) => {
    alert("me");
  };

  const handleDelete = (record) => {
    alert("me");
  };

  return (
    <div className="bus-routes-table">
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
    </div>
  );
};

export default TableBus;
