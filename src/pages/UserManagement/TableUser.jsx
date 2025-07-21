import React from "react";
import { Button, Modal, Space, Table, Tooltip, Tag, Popover } from "antd";
import {
  EditOutlined,
  CheckCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";

const { confirm } = Modal;

const TableUser = ({
  dataSource = [],
  loading = false,
  handleEdit,
  handleStatusChange,
  pagination = { current: 1, pageSize: 10, total: 0 },
  onTableChange,
}) => {
  const columns = [
    {
      title: "Họ và tên",
      key: "fullName",
      width: 150,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>
            {record.lastName} {record.firstName}
          </div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {record.username}
          </div>
        </div>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 180,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      width: 120,
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 150,
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "deleted",
      key: "status",
      width: 120,
      align: 'center',
      render: (deleted, record) => {
        const isActive = deleted === 0;
        
        const statusOptions = (
          <div style={{ minWidth: 120 }}>
            <div 
              style={{ 
                padding: '8px 12px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '6px',
                transition: 'background 0.2s',
              }}
              onClick={() => handleStatusChange(record, 0)}
              onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              <CheckCircleOutlined style={{ color: '#52c41a' }} />
              <span>Hoạt động</span>
            </div>
            <div 
              style={{ 
                padding: '8px 12px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                borderRadius: '6px',
                transition: 'background 0.2s',
              }}
              onClick={() => handleStatusChange(record, 1)}
              onMouseEnter={(e) => e.target.style.background = '#f0f0f0'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              <StopOutlined style={{ color: '#ff4d4f' }} />
              <span>Vô hiệu hóa</span>
            </div>
          </div>
        );

        return (
          <Popover 
            content={statusOptions} 
            trigger="click"
            placement="bottom"
            overlayStyle={{ padding: 0 }}
          >
            <Tag 
              color={isActive ? "success" : "error"} 
              style={{ 
                cursor: 'pointer',
                margin: 0,
                padding: '4px 8px',
                borderRadius: '6px',
                fontWeight: 500,
                userSelect: 'none'
              }}
              icon={isActive ? <CheckCircleOutlined /> : <StopOutlined />}
            >
              {isActive ? "Hoạt động" : "Vô hiệu hóa"}
            </Tag>
          </Popover>
        );
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 100,
      align: "center",
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const paginationConfig = {
    current: pagination.current,
    pageSize: pagination.pageSize,
    total: pagination.total,
    showSizeChanger: true,
    showQuickJumper: true,
    pageSizeOptions: ["5", "10", "20", "50"],
    showTotal: (total, range) =>
      `${range[0]}-${range[1]} của ${total} người dùng`,
  };

  return (
    <Table
      dataSource={dataSource}
      columns={columns}
      rowKey="id"
      bordered
      size="middle"
      loading={loading}
      pagination={paginationConfig}
      onChange={onTableChange}
      scroll={{ x: 1200 }}
    />
  );
};

export default TableUser;
