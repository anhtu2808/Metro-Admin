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

// ✅ Import API từ src/apis
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
      const list = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];

      if (!Array.isArray(list) || list.length === 0) {
        message.warning("Không có dữ liệu xác thực sinh viên.");
      }

      setData(list);
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      message.error("Lỗi khi lấy danh sách xác thực sinh viên");
      setData([]); // fallback an toàn
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
      const detail = await getStudentVerificationByIdAPI(record.id);
      setSelectedRecord(detail);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Không thể tải chi tiết xác thực");
    }
  };

  const filteredData = Array.isArray(data)
    ? data.filter((item) => {
        const matchStatus =
          statusFilter === "ALL" || item.status === statusFilter;
        const matchSearch = item.schoolName
          ?.toLowerCase()
          .includes(searchValue.toLowerCase());
        return matchStatus && matchSearch;
      })
    : [];

  const columns = [
    {
      title: "Trường",
      dataIndex: "schoolName",
      render: (text, record) => (
        <Space>
          <Image
            src={record.imageUrl}
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
        <Space wrap>
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
              <Image src={selectedRecord.imageUrl} width={100} />
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
              <Image src={selectedRecord.user?.avatarUrl} width={80} />
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default StudentVerificationManagement;
