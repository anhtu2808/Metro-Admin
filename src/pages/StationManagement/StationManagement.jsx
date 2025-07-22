import React, { useState, useEffect } from 'react';
import {
  Table,
  Input,
  Space,
  Tag,
  Popconfirm,
  message,
  Card,
  Tooltip,
  Skeleton,
  Avatar,
  Button,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setLayoutData } from '../../redux/layoutSlice';
import { FaSubway } from 'react-icons/fa';
import Preloader from '../../components/Preloader/Preloader';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import StationModal from './StationModal';
import { 
  getAllStationsAPI, 
  deleteStationAPI
} from '../../apis';
import './StationManagement.css';

// Removed Search component, using regular Input instead

const StationManagement = () => {
  const dispatch = useDispatch();
  const [stations, setStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [searchText, setSearchText] = useState('');
  
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
        search: searchQuery,
        sort: 'id'
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
          status: 'active', // Assuming all returned stations are active since deleted ones won't be returned
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
    if (searchText) {
      const timeoutId = setTimeout(() => {
        loadStations(false, 1, pagination.pageSize, searchText);
      }, 500);
  
      return () => clearTimeout(timeoutId);
    }
  }, [searchText]);







  const handleAdd = () => {
    setEditingStation(null);
    setIsModalVisible(true);
  };

  const handleEdit = (station) => {
    setEditingStation(station);
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

  const handleModalSuccess = async () => {
    setIsModalVisible(false);
    setEditingStation(null);
    
    // Reload stations after success
    if (editingStation) {
      // For edit, stay on current page
      await loadStations(false, pagination.current, pagination.pageSize, searchText);
    } else {
      // For create, go to first page
      await loadStations(false, 1, pagination.pageSize, searchText);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setEditingStation(null);
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
      title: 'Hình ảnh',
      dataIndex: 'imageUrl',
      key: 'image',
      width: 100,
      render: (url) => (
        <Avatar shape="square" size={48} src={url} icon={<FaSubway />} />
      )
    },
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
            <Input
              placeholder="Tìm kiếm trạm..."
              allowClear
              style={{ width: 300 }}
              onChange={(e) => setSearchText(e.target.value)}
              value={searchText}
            />

          </div>
          <div className="actions">
            <PrimaryButton
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
              type="button"
            >
              Làm mới
            </PrimaryButton>
            <PrimaryButton
              icon={<PlusOutlined />}
              onClick={handleAdd}
              type="button"
            >
              Thêm trạm
            </PrimaryButton>
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

      {/* Station Modal */}
      <StationModal
        visible={isModalVisible}
        onCancel={handleModalCancel}
        onSuccess={handleModalSuccess}
        editingStation={editingStation}
        loading={loading}
      />
    </div>
  );
};

export default StationManagement; 