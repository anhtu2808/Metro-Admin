import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLayoutData } from "../../redux/layoutSlice";
import {
  Table,
  Input,
  Tag,
  Button,
  Tabs,
  Space,
  Image,
  message,
  Modal,
  Descriptions,
} from "antd";
import {
  SearchOutlined,
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
} from "@ant-design/icons";

import {
  getAllStudentVerificationsAPI,
  updateStudentVerificationStatusAPI,
  getStudentVerificationByIdAPI,
} from "../../apis";

const StudentVerificationManagement = () => {
  const dispatch = useDispatch();
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    dispatch(setLayoutData({ title: "Quản lý xác thực sinh viên" }));
    fetchStudentVerifications();
  }, [dispatch]);

  const fetchStudentVerifications = async () => {
    try {
      const res = await getAllStudentVerificationsAPI();
      if (res.code === 200 && Array.isArray(res.result?.data)) {
        setData(res.result.data);
      } else {
        setData([]);
        message.warning("Không có dữ liệu xác thực sinh viên.");
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      message.error("Không thể tải danh sách xác thực sinh viên");
      setData([]);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateStudentVerificationStatusAPI(id, { status: newStatus });
      setData((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus } : item
        )
      );
      message.success(
        `Đã ${newStatus === "APPROVED" ? "duyệt" : "từ chối"} sinh viên ID ${id}`
      );
    } catch (error) {
      message.error("Cập nhật trạng thái thất bại");
    }
  };

  const showDetails = async (record) => {
    try {
      const res = await getStudentVerificationByIdAPI(record.id);
      if (res.code === 200) {
        setSelectedRecord(res.result);
        setIsModalVisible(true);
      } else {
        message.error("Không thể lấy chi tiết xác thực");
      }
    } catch (error) {
      message.error("Không thể tải chi tiết xác thực");
    }
  };

  const filteredData = data.filter((item) => {
    const matchStatus = statusFilter === "ALL" || item.status === statusFilter;
    const matchSearch = item.schoolName
      ?.toLowerCase()
      .includes(searchValue.toLowerCase());
    return matchStatus && matchSearch;
  });

  const columns = [
    {
      title: "Trường",
      dataIndex: "schoolName",
      render: (text, record) => (
        <Space>
          <Image
            src={record.imageUrl || "https://via.placeholder.com/40"}
            width={40}
            height={40}
            style={{ objectFit: "cover", borderRadius: 4 }}
          />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: "Ngày tốt nghiệp",
      dataIndex: "graduateDate",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        const color =
          status === "PENDING"
            ? "orange"
            : status === "APPROVED"
            ? "green"
            : "red";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Hành động",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => showDetails(record)}
            size="small"
          >
            Xem
          </Button>
          {record.status === "PENDING" ? (
            <>
              <Button
                icon={<CheckOutlined />}
                type="primary"
                size="small"
                onClick={() => handleUpdateStatus(record.id, "APPROVED")}
              >
                Duyệt
              </Button>
              <Button
                icon={<CloseOutlined />}
                danger
                size="small"
                onClick={() => handleUpdateStatus(record.id, "REJECTED")}
              >
                Từ chối
              </Button>
            </>
          ) : (
            <Tag color="blue">Đã xử lý</Tag>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Tabs
        defaultActiveKey="ALL"
        onChange={(key) => setStatusFilter(key)}
        items={[
          { label: "Tất cả", key: "ALL" },
          { label: "Chờ duyệt", key: "PENDING" },
          { label: "Đã duyệt", key: "APPROVED" },
          { label: "Từ chối", key: "REJECTED" },
        ]}
        style={{ marginBottom: 16 }}
      />
      <Input
        placeholder="Tìm kiếm theo trường"
        prefix={<SearchOutlined />}
        style={{ width: 300, marginBottom: 16 }}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
      />
      <Table
        rowKey="id"
        dataSource={filteredData}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Chi tiết xác thực sinh viên"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedRecord && (
          <Descriptions bordered column={2}>
            <Descriptions.Item label="Trường học">
              {selectedRecord.schoolName}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tốt nghiệp">
              {selectedRecord.graduateDate}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag>{selectedRecord.status}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ảnh giấy tờ">
              <Image
                src={selectedRecord.imageUrl || "https://via.placeholder.com/150"}
                width={100}
              />
            </Descriptions.Item>
            <Descriptions.Item label="Họ tên" span={2}>
              {selectedRecord.user?.firstName} {selectedRecord.user?.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedRecord.user?.email}
            </Descriptions.Item>
            <Descriptions.Item label="SĐT">
              {selectedRecord.user?.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {selectedRecord.user?.address}
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              {selectedRecord.user?.role}
            </Descriptions.Item>
            <Descriptions.Item label="Đã xác thực?">
              {selectedRecord.user?.isStudentVerified ? "✔️" : "❌"}
            </Descriptions.Item>
            <Descriptions.Item label="Quyền">
              {(selectedRecord.user?.permissions || []).join(", ")}
            </Descriptions.Item>
            <Descriptions.Item label="Ảnh đại diện" span={2}>
              <Image
                src={
                  selectedRecord.user?.avatarUrl ||
                  "https://via.placeholder.com/80"
                }
                width={80}
              />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default StudentVerificationManagement;
