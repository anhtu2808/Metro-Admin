import React, { useState, useEffect } from 'react';
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
  Tooltip,
  Skeleton,
  Upload,
  Avatar
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  ReloadOutlined,
  ExportOutlined,
  CameraOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setLayoutData } from '../../redux/layoutSlice';
import { FaSubway } from 'react-icons/fa';
import Preloader from '../../components/Preloader/Preloader';
import { 
  getAllStationsAPI, 
  createStationAPI, 
  updateStationAPI, 
  deleteStationAPI,
  uploadStationImageAPI
} from '../../apis';
import './StationManagement.css';

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
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [form] = Form.useForm();
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Pagination state
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} trạm`,
  });

  // Sample data for stations
  const initialStations = [
    {
      id: 1,
      name: 'Bến Thành',
      code: 'BT01',
      lineId: 1,
      lineName: 'M1 Bến xe Suối Tiên - Bến Thành',
      address: '1 Lê Lợi, Quận 1, TP.HCM',
      latitude: 10.7720,
      longitude: 106.6980,
      status: 'active',
      facilities: ['escalator', 'elevator', 'toilet', 'atm'],
      openingHours: '05:00 - 23:00',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Nhà hát TP',
      code: 'NT01',
      lineId: 1,
      lineName: 'M1 Bến xe Suối Tiên - Bến Thành',
      address: '7 Lam Sơn, Quận 1, TP.HCM',
      latitude: 10.7769,
      longitude: 106.7009,
      status: 'active',
      facilities: ['escalator', 'toilet'],
      openingHours: '05:00 - 23:00',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    },
    {
      id: 3,
      name: 'Ba Son',
      code: 'BS01',
      lineId: 1,
      lineName: 'M1 Bến xe Suối Tiên - Bến Thành',
      address: 'Tôn Đức Thắng, Quận 1, TP.HCM',
      latitude: 10.7886,
      longitude: 106.7053,
      status: 'maintenance',
      facilities: ['escalator', 'elevator', 'toilet'],
      openingHours: '05:00 - 23:00',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20'
    },
    {
      id: 4,
      name: 'Thảo Điền',
      code: 'TD01',
      lineId: 2,
      lineName: 'M2 Sài Gòn - Thủ Đức',
      address: 'Xa lộ Hà Nội, Quận 2, TP.HCM',
      latitude: 10.8027,
      longitude: 106.7308,
      status: 'active',
      facilities: ['escalator', 'toilet', 'parking'],
      openingHours: '05:00 - 23:00',
      createdAt: '2024-01-16',
      updatedAt: '2024-01-16'
    },
    {
      id: 5,
      name: 'An Phú',
      code: 'AP01',
      lineId: 2,
      lineName: 'M2 Sài Gòn - Thủ Đức',
      address: 'Đường Hà Nội, Quận 2, TP.HCM',
      latitude: 10.8027,
      longitude: 106.7308,
      status: 'inactive',
      facilities: ['escalator', 'elevator'],
      openingHours: '05:00 - 23:00',
      createdAt: '2024-01-16',
      updatedAt: '2024-01-16'
    }
  ];





  // Load stations from API with pagination
  const loadStations = async (isInitial = false, page = 1, pageSize = 10, searchQuery = '') => {
    try {
      if (isInitial) {
        setInitialLoading(true);
      } else {
        setLoading(true);
      }
      
      // Call API with pagination parameters
      const response = await getAllStationsAPI({
        page,
        size: pageSize,
        search: searchQuery
      });
      
      if (response.code === 200) {
        const { result } = response;
        const { data, currentPage, pageSize: returnedPageSize, totalElements } = result;
        
        // Transform API data to match component format
        const transformedStations = data.map(station => ({
          id: station.id,
          name: station.name || 'Unnamed Station',
          code: station.stationCode || 'N/A',
          address: station.address || 'Chưa có địa chỉ',
          latitude: parseFloat(station.latitude) || 0,
          longitude: parseFloat(station.longitude) || 0,
          status: station.deleted === 0 ? 'active' : 'inactive',
          imageUrl: station.imageUrl,
          createdAt: station.createAt ? new Date(station.createAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN'),
          updatedAt: station.updateAt ? new Date(station.updateAt).toLocaleDateString('vi-VN') : new Date().toLocaleDateString('vi-VN')
        }));
        
        setStations(transformedStations);
        setFilteredStations(transformedStations);
        
        // Update pagination state
        setPagination(prev => ({
          ...prev,
          current: currentPage,
          pageSize: returnedPageSize,
          total: totalElements
        }));
      } else {
        throw new Error('API response error');
      }
    } catch (error) {
      console.error('Error loading stations:', error);
      message.error('Không thể tải dữ liệu trạm');
      
      // Fallback to sample data if API fails (only for initial load)
      if (isInitial) {
        setStations(initialStations);
        setFilteredStations(initialStations);
        setPagination(prev => ({
          ...prev,
          current: 1,
          total: initialStations.length
        }));
      }
    } finally {
      if (isInitial) {
        setInitialLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    dispatch(setLayoutData({
      title: "Quản lý trạm tàu",
      icon: <FaSubway />,
    }));
    
    // Load data from API
    loadStations(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // Handle search with debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Reset to first page when searching
      loadStations(false, 1, pagination.pageSize, searchText);
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText]);

  // Handle status filter
  useEffect(() => {
    // For now, we'll handle status filter on client side
    // You can modify the API to support status filtering if needed
    let filtered = stations;

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(station => station.status === selectedStatus);
    }

    setFilteredStations(filtered);
  }, [stations, selectedStatus]);


  // Handle image upload
  const handleImageUpload = async (file) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await uploadStationImageAPI(formData);
      
      if (response.code === 200) {
        const newImageUrl = response.result;
        setImageUrl(newImageUrl);
        message.success("Upload ảnh thành công!");
      } else {
        message.error("Upload ảnh thất bại!");
      }
    } catch (error) {
      message.error("Upload ảnh thất bại!");
    } finally {
      setUploadingImage(false);
    }
    
    return false; // Prevent default upload behavior
  };

  const handleAdd = () => {
    setEditingStation(null);
    form.resetFields();
    setImageUrl('');
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
      status: station.status
    });
    setImageUrl(station.imageUrl || '');
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteStationAPI(id);
      
      // Calculate if we should go to previous page after deletion
      const remainingItems = pagination.total - 1;
      const totalPages = Math.ceil(remainingItems / pagination.pageSize);
      const currentPage = pagination.current > totalPages && totalPages > 0 ? totalPages : pagination.current;
      
      // Reload data
      await loadStations(false, currentPage, pagination.pageSize, searchText);
      message.success('Xóa trạm thành công');
    } catch (error) {
      console.error('Error deleting station:', error);
      message.error('Xóa trạm thất bại');
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
          imageUrl: imageUrl || null
        };
        
        if (editingStation) {
          // Update existing station
          await updateStationAPI(editingStation.id, payload);
          
          // Reload stations after update
          await loadStations(false, pagination.current, pagination.pageSize, searchText);
          message.success('Cập nhật trạm thành công');
        } else {
          await createStationAPI(payload);
          
          // Reload stations after create  
          await loadStations(false, 1, pagination.pageSize, searchText);
          message.success('Thêm trạm mới thành công');
        }
        
        setIsModalVisible(false);
        form.resetFields();
        setEditingStation(null);
      } catch (error) {
        console.error('Error saving station:', error);
        message.error(editingStation ? 'Cập nhật trạm thất bại' : 'Thêm trạm thất bại');
      } finally {
        setModalLoading(false);
      }
    });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingStation(null);
    setImageUrl('');
  };

  const handleRefresh = async () => {
    try {
      await loadStations(false, pagination.current, pagination.pageSize, searchText);
      message.success('Dữ liệu đã được làm mới');
    } catch (error) {
      message.error('Làm mới dữ liệu thất bại');
    }
  };

  // Handle pagination change
  const handleTableChange = (paginationConfig) => {
    const { current, pageSize } = paginationConfig;
    loadStations(false, current, pageSize, searchText);
  };

  const columns = [
    {
      title: 'Mã trạm',
      dataIndex: 'code',
      key: 'code',
      width: 100,
      render: (code) => <Tag color="blue">{code}</Tag>
    },
    {
      title: 'Tên trạm',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (name, record) => (
        <div>
          <div style={{ fontWeight: 500 }}>{name}</div>
          <div style={{ fontSize: '12px', color: '#8c8c8c' }}>
            {record.code}
          </div>
        </div>
      )
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      key: 'address',
      width: 300,
      ellipsis: {
        showTitle: false,
      },
      render: (address) => (
        <Tooltip placement="topLeft" title={address}>
          {address}
        </Tooltip>
      )
    },
    {
      title: 'Tọa độ',
      key: 'coordinates',
      width: 150,
      render: (_, record) => (
        <div style={{ fontSize: '12px' }}>
          <div>Lat: {record.latitude}</div>
          <div>Lng: {record.longitude}</div>
        </div>
      )
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => (
        <span style={{ fontSize: '12px' }}>{date}</span>
      )
    },
    {
      title: 'Thao tác',
      key: 'actions',
      fixed: 'right',
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
                window.open(`https://www.google.com/maps?q=${record.latitude},${record.longitude}`, '_blank');
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
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      )
    }
  ];



  // Show fullscreen preloader on initial load
  if (initialLoading) {
    return <Preloader fullscreen={true} />;
  }

  return (
    <div className="station-management">
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
              onClick={() => message.info('Xuất dữ liệu')}
            >
              Xuất Excel
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              Thêm trạm
            </Button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ padding: '24px' }}>
            <Skeleton active paragraph={{ rows: 8 }} />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={filteredStations}
            rowKey="id"
            scroll={{ x: 1200 }}
            pagination={pagination}
            onChange={handleTableChange}
            loading={loading}
          />
        )}
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={editingStation ? 'Chỉnh sửa trạm' : 'Thêm trạm mới'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        width={800}
        okText={editingStation ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
        confirmLoading={modalLoading}
      >
        <Form
          form={form}
          layout="vertical"
        >
          {/* Upload Image Section */}
          <Form.Item label="Hình ảnh trạm">
            <div className="station-image-upload">
              <div className="image-preview">
                <Avatar
                  size={120}
                  src={imageUrl}
                  icon={<EnvironmentOutlined />}
                  shape="square"
                />
              </div>
              <div className="upload-controls">
                <Upload
                  name="stationImage"
                  beforeUpload={handleImageUpload}
                  showUploadList={false}
                  accept="image/*"
                >
                  <Button 
                    icon={<CameraOutlined />} 
                    loading={uploadingImage}
                    type="primary"
                    ghost
                  >
                    {uploadingImage ? "Đang upload..." : "Chọn ảnh"}
                  </Button>
                </Upload>
                {imageUrl && (
                  <Button 
                    onClick={() => setImageUrl('')}
                    danger
                    type="text"
                  >
                    Xóa ảnh
                  </Button>
                )}
              </div>
            </div>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên trạm"
                rules={[{ required: true, message: 'Vui lòng nhập tên trạm' }]}
              >
                <Input placeholder="Nhập tên trạm" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="Mã trạm"
                rules={[{ required: true, message: 'Vui lòng nhập mã trạm' }]}
              >
                <Input placeholder="VD: ST01" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="Địa chỉ"
            rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
          >
            <Input.TextArea rows={2} placeholder="Nhập địa chỉ đầy đủ" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="latitude"
                label="Vĩ độ (Latitude)"
                rules={[
                  { required: true, message: 'Vui lòng nhập vĩ độ' },
                  { 
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const num = parseFloat(value);
                      if (isNaN(num) || num < -90 || num > 90) {
                        return Promise.reject(new Error('Vĩ độ phải từ -90 đến 90'));
                      }
                      return Promise.resolve();
                    }
                  }
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
                  { required: true, message: 'Vui lòng nhập kinh độ' },
                  { 
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();
                      const num = parseFloat(value);
                      if (isNaN(num) || num < -180 || num > 180) {
                        return Promise.reject(new Error('Kinh độ phải từ -180 đến 180'));
                      }
                      return Promise.resolve();
                    }
                  }
                ]}
              >
                <Input type="number" step="any" placeholder="106.6980" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default StationManagement; 