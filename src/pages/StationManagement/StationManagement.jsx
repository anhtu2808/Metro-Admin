import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Select,
  Tag,
  Popconfirm,
  message,
  Card,
  Row,
  Col,
  Statistic,
  Tooltip,
  Badge,
  Skeleton,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  ReloadOutlined,
  ExportOutlined,
} from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { setLayoutData } from "../../redux/layoutSlice";
import { FaSubway } from "react-icons/fa";
import Preloader from "../../components/Preloader/Preloader";
import {
  getAllStationsAPI,
  createStationAPI,
  updateStationAPI,
  deleteStationAPI,
} from "../../apis";
import "./StationManagement.css";

const { Search } = Input;
const { Option } = Select;

const StationManagement = () => {
  const dispatch = useDispatch();
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [form] = Form.useForm();

  // Sample data for stations
  const initialStations = [
    {
      id: 1,
      name: "Bến Thành",
      code: "BT01",
      lineId: 1,
      lineName: "M1 Bến xe Suối Tiên - Bến Thành",
      address: "1 Lê Lợi, Quận 1, TP.HCM",
      latitude: 10.772,
      longitude: 106.698,
      status: "active",
      facilities: ["escalator", "elevator", "toilet", "atm"],
      openingHours: "05:00 - 23:00",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: 2,
      name: "Nhà hát TP",
      code: "NT01",
      lineId: 1,
      lineName: "M1 Bến xe Suối Tiên - Bến Thành",
      address: "7 Lam Sơn, Quận 1, TP.HCM",
      latitude: 10.7769,
      longitude: 106.7009,
      status: "active",
      facilities: ["escalator", "toilet"],
      openingHours: "05:00 - 23:00",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-15",
    },
    {
      id: 3,
      name: "Ba Son",
      code: "BS01",
      lineId: 1,
      lineName: "M1 Bến xe Suối Tiên - Bến Thành",
      address: "Tôn Đức Thắng, Quận 1, TP.HCM",
      latitude: 10.7886,
      longitude: 106.7053,
      status: "maintenance",
      facilities: ["escalator", "elevator", "toilet"],
      openingHours: "05:00 - 23:00",
      createdAt: "2024-01-15",
      updatedAt: "2024-01-20",
    },
    {
      id: 4,
      name: "Thảo Điền",
      code: "TD01",
      lineId: 2,
      lineName: "M2 Sài Gòn - Thủ Đức",
      address: "Xa lộ Hà Nội, Quận 2, TP.HCM",
      latitude: 10.8027,
      longitude: 106.7308,
      status: "active",
      facilities: ["escalator", "toilet", "parking"],
      openingHours: "05:00 - 23:00",
      createdAt: "2024-01-16",
      updatedAt: "2024-01-16",
    },
    {
      id: 5,
      name: "An Phú",
      code: "AP01",
      lineId: 2,
      lineName: "M2 Sài Gòn - Thủ Đức",
      address: "Đường Hà Nội, Quận 2, TP.HCM",
      latitude: 10.8027,
      longitude: 106.7308,
      status: "inactive",
      facilities: ["escalator", "elevator"],
      openingHours: "05:00 - 23:00",
      createdAt: "2024-01-16",
      updatedAt: "2024-01-16",
    },
  ];

  const facilityOptions = [
    { value: "escalator", label: "Thang cuốn", icon: "🔼" },
    { value: "elevator", label: "Thang máy", icon: "🛗" },
    { value: "toilet", label: "Nhà vệ sinh", icon: "🚻" },
    { value: "atm", label: "ATM", icon: "🏧" },
    { value: "parking", label: "Bãi đỗ xe", icon: "🅿️" },
    { value: "shop", label: "Cửa hàng", icon: "🏪" },
    { value: "wifi", label: "WiFi", icon: "📶" },
  ];

  // Load stations from API
  const loadStations = async (isInitial = false) => {
    try {
      if (isInitial) {
        setInitialLoading(true);
      } else {
        setLoading(true);
      }

      const response = await getAllStationsAPI();
      const stationsData = response.result?.data || response.data || response;

      // Transform API data to match component format
      const transformedStations = stationsData.map((station) => ({
        id: station.id,
        name: station.name || "Unnamed Station",
        code: station.stationCode || "N/A",
        address: station.address || "Chưa có địa chỉ",
        latitude: parseFloat(station.latitude) || 0,
        longitude: parseFloat(station.longitude) || 0,
        status: station.deleted === 0 ? "active" : "inactive",
        imageUrl: station.imageUrl,
        createdAt: station.createAt
          ? new Date(station.createAt).toLocaleDateString("vi-VN")
          : new Date().toLocaleDateString("vi-VN"),
        updatedAt: station.updateAt
          ? new Date(station.updateAt).toLocaleDateString("vi-VN")
          : new Date().toLocaleDateString("vi-VN"),
      }));

      setStations(transformedStations);
      setFilteredStations(transformedStations);
    } catch (error) {
      console.error("Error loading stations:", error);
      message.error("Không thể tải dữ liệu trạm");
      // Fallback to sample data if API fails
      setStations(initialStations);
      setFilteredStations(initialStations);
    } finally {
      if (isInitial) {
        setInitialLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    dispatch(
      setLayoutData({
        title: "Quản lý trạm tàu",
        icon: <FaSubway />,
      })
    );

    // Load data from API
    loadStations(true);
  }, [dispatch]);

  // Filter stations based on search and filters
  useEffect(() => {
    let filtered = stations;

    // Search filter
    if (searchText) {
      filtered = filtered.filter(
        (station) =>
          station.name.toLowerCase().includes(searchText.toLowerCase()) ||
          station.code.toLowerCase().includes(searchText.toLowerCase()) ||
          station.address.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Status filter
    if (selectedStatus !== "all") {
      filtered = filtered.filter(
        (station) => station.status === selectedStatus
      );
    }

    setFilteredStations(filtered);
  }, [stations, searchText, selectedStatus]);

  const getStatusColor = (status) => {
    const colors = {
      active: "success",
      inactive: "default",
      maintenance: "warning",
      construction: "processing",
    };
    return colors[status] || "default";
  };

  const getStatusText = (status) => {
    const texts = {
      active: "Hoạt động",
      inactive: "Không hoạt động",
      maintenance: "Bảo trì",
      construction: "Xây dựng",
    };
    return texts[status] || status;
  };

  const getFacilityIcon = (facility) => {
    const option = facilityOptions.find((opt) => opt.value === facility);
    return option ? option.icon : "📍";
  };

  const getFacilityLabel = (facility) => {
    const option = facilityOptions.find((opt) => opt.value === facility);
    return option ? option.label : facility;
  };

  const handleAdd = () => {
    setEditingStation(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (station) => {
    setEditingStation(station);
    form.setFieldsValue({
      name: station.name,
      code: station.code,
      address: station.address,
      latitude: station.latitude,
      longitude: station.longitude,
      status: station.status,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteStationAPI(id);
      setStations(stations.filter((station) => station.id !== id));
      message.success("Xóa trạm thành công");
    } catch (error) {
      console.error("Error deleting station:", error);
      message.error("Xóa trạm thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleModalOk = () => {
    form.validateFields().then(async (values) => {
      try {
        setModalLoading(true);

        // Prepare payload for API
        const payload = {
          name: values.name,
          stationCode: values.code,
          address: values.address,
          latitude: values.latitude.toString(),
          longitude: values.longitude.toString(),
          imageUrl: values.imageUrl || null,
        };

        if (editingStation) {
          // Update existing station
          const response = await updateStationAPI(editingStation.id, payload);

          // Reload stations after update
          await loadStations();
          message.success("Cập nhật trạm thành công");
        } else {
          // Add new station
          const response = await createStationAPI(payload);

          // Reload stations after create
          await loadStations();
          message.success("Thêm trạm mới thành công");
        }

        setIsModalVisible(false);
        form.resetFields();
        setEditingStation(null);
      } catch (error) {
        console.error("Error saving station:", error);
        message.error(
          editingStation ? "Cập nhật trạm thất bại" : "Thêm trạm thất bại"
        );
      } finally {
        setModalLoading(false);
      }
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingStation(null);
  };

  const handleRefresh = async () => {
    try {
      await loadStations();
      message.success("Dữ liệu đã được làm mới");
    } catch (error) {
      message.error("Làm mới dữ liệu thất bại");
    }
  };

  const columns = [
    {
      title: "Mã trạm",
      dataIndex: "code",
      key: "code",
      width: 100,
      render: (code) => <Tag color="blue">{code}</Tag>,
    },
    {
      title: "Tên trạm",
      dataIndex: "name",
      key: "name",
      width: 200,
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <div style={{ fontSize: "12px", color: "#8c8c8c" }}>
            {record.code}
          </div>
        </div>
      ),
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      key: "address",
      width: 300,
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
      title: "Tọa độ",
      key: "coordinates",
      width: 150,
      render: (_, record) => (
        <div style={{ fontSize: "12px" }}>
          <div>Lat: {record.latitude}</div>
          <div>Lng: {record.longitude}</div>
        </div>
      ),
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
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>
          <Tooltip title="Xem vị trí">
            <Button
              type="text"
              icon={<EnvironmentOutlined />}
              onClick={() => {
                window.open(
                  `https://www.google.com/maps?q=${record.latitude},${record.longitude}`,
                  "_blank"
                );
              }}
            />
          </Tooltip>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa trạm này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Tooltip title="Xóa">
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const getStatistics = () => {
    const total = stations.length;
    const active = stations.filter((s) => s.status === "active").length;
    const maintenance = stations.filter(
      (s) => s.status === "maintenance"
    ).length;
    const inactive = stations.filter((s) => s.status === "inactive").length;

    return { total, active, maintenance, inactive };
  };

  const stats = getStatistics();

  // Show fullscreen preloader on initial load
  if (initialLoading) {
    return <Preloader fullscreen={true} />;
  }

  return (
    <div className="station-management">
      {/* Statistics Cards */}
      <Row gutter={16} className="statistics-row">
        <Col xs={24} sm={12} md={6}>
          <Card>
            {loading ? (
              <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
              <Statistic
                title="Tổng số trạm"
                value={stats.total}
                prefix={<FaSubway />}
                valueStyle={{ color: "#1890ff" }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            {loading ? (
              <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
              <Statistic
                title="Đang hoạt động"
                value={stats.active}
                valueStyle={{ color: "#52c41a" }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            {loading ? (
              <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
              <Statistic
                title="Bảo trì"
                value={stats.maintenance}
                valueStyle={{ color: "#faad14" }}
              />
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            {loading ? (
              <Skeleton active paragraph={{ rows: 1 }} />
            ) : (
              <Statistic
                title="Không hoạt động"
                value={stats.inactive}
                valueStyle={{ color: "#8c8c8c" }}
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Main Content */}
      <Card className="main-card">
        {/* Header Actions */}
        <div className="header-actions">
          <div className="filters">
            <Search
              placeholder="Tìm kiếm trạm..."
              allowClear
              style={{ width: 250 }}
              onChange={(e) => setSearchText(e.target.value)}
            />

            <Select
              placeholder="Trạng thái"
              style={{ width: 150 }}
              value={selectedStatus}
              onChange={setSelectedStatus}
            >
              <Option value="all">Tất cả</Option>
              <Option value="active">Hoạt động</Option>
              <Option value="maintenance">Bảo trì</Option>
              <Option value="inactive">Không hoạt động</Option>
            </Select>
          </div>
          <div className="actions">
            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              Làm mới
            </Button>
            <Button
              icon={<ExportOutlined />}
              onClick={() => message.info("Xuất dữ liệu")}
            >
              Xuất Excel
            </Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Thêm trạm
            </Button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ padding: "24px" }}>
            <Skeleton active paragraph={{ rows: 8 }} />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredStations}
            rowKey="id"
            scroll={{ x: 1200 }}
            pagination={{
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} của ${total} trạm`,
            }}
          />
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingStation ? "Chỉnh sửa trạm" : "Thêm trạm mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText={editingStation ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
        confirmLoading={modalLoading}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên trạm"
                rules={[{ required: true, message: "Vui lòng nhập tên trạm" }]}
              >
                <Input placeholder="Nhập tên trạm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Mã trạm"
                rules={[{ required: true, message: "Vui lòng nhập mã trạm" }]}
              >
                <Input placeholder="VD: ST01" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: "Vui lòng nhập địa chỉ" }]}
          >
            <Input.TextArea rows={2} placeholder="Nhập địa chỉ đầy đủ" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="latitude"
                label="Vĩ độ (Latitude)"
                rules={[
                  { required: true, message: "Vui lòng nhập vĩ độ" },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const num = parseFloat(value);
                      if (isNaN(num) || num < -90 || num > 90) {
                        return Promise.reject(
                          new Error("Vĩ độ phải từ -90 đến 90")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input type="number" step="any" placeholder="10.7720" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="longitude"
                label="Kinh độ (Longitude)"
                rules={[
                  { required: true, message: "Vui lòng nhập kinh độ" },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const num = parseFloat(value);
                      if (isNaN(num) || num < -180 || num > 180) {
                        return Promise.reject(
                          new Error("Kinh độ phải từ -180 đến 180")
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input type="number" step="any" placeholder="106.6980" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="imageUrl" label="URL hình ảnh (tùy chọn)">
            <Input placeholder="https://example.com/image.jpg" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StationManagement;
