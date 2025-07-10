import React, { useState, useEffect, useCallback } from 'react';
import { Tabs, Table, Tag, Space, Input, Select, DatePicker, Button, message, Form } from 'antd';
import { SearchOutlined, ReloadOutlined, QrcodeOutlined, EyeOutlined } from '@ant-design/icons';
import './TicketManagement.css';
import { useDispatch } from 'react-redux';
import { setLayoutData } from '../../redux/layoutSlice';
import { FaTicketAlt } from 'react-icons/fa';
import { ORDER_STATUS } from '../../utils/constants';
import { getTicketOrderByTokenAPI, updateTicketOrderAPI, getAllTicketOrdersAPI } from '../../apis';
import QRScanner from '../../components/QRScanner/QRScanner';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import ModalTicketDetail from '../../components/ModalTicketDetail';


const { Option } = Select;
const { RangePicker } = DatePicker;



const TicketManagement = () => {
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [dateRange, setDateRange] = useState([]);
  
  // API Data states
  const [ticketData, setTicketData] = useState({ data: [], totalElements: 0, totalPages: 0, currentPage: 0 });
  const [pagination, setPagination] = useState({ page: 1, size: 10 });
  const [activeTab, setActiveTab] = useState('static');

  // QR Scanner and Edit Modal states
  const [isQRScannerVisible, setIsQRScannerVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isViewDetailModalVisible, setIsViewDetailModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [editForm] = Form.useForm();
  const [viewForm] = Form.useForm();

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to page 1 when switching tabs
  };

  // Status tag colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'green';
      case 'EXPIRED': return 'red';
      case 'USED': return 'blue';
      case 'UNPAID': return 'orange';
      case 'CANCELLED': return 'red';
      default: return 'default';
    }
  };

  const dispatch = useDispatch();
  
  // Fetch ticket data from API
  const fetchTicketData = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      
      // Determine isStatic based on active tab
      const isStatic = activeTab === 'static' ? true : activeTab === 'single' ? false : undefined;
      
      const response = await getAllTicketOrdersAPI({
        page: pagination.page,
        size: pagination.size,
        search: searchText,
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        isStatic,
        ...params
      });

      if (response.code === 200) {
        setTicketData({
          data: response.result.data,
          totalElements: response.result.totalElements,
          totalPages: response.result.totalPages,
          currentPage: response.result.currentPage
        });
      }
    } catch (error) {
      message.error("Lỗi khi tải danh sách vé: " + (error.message || "Có lỗi xảy ra"));
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.size, searchText, statusFilter, activeTab]);

  useEffect(() => {
    dispatch(setLayoutData({
      title: "Quản lý đặt vé",
      icon: <FaTicketAlt />,
    }));
  }, [dispatch]);

  // Initial data fetch
  useEffect(() => {
    fetchTicketData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle tab change - immediate fetch
  useEffect(() => {
    fetchTicketData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // Debounced search for other filters
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTicketData();
    }, 500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, statusFilter, pagination.page, pagination.size]);

  // Status tag text
  const getStatusText = (status) => {
    switch (status) {
      case ORDER_STATUS.ACTIVE: return 'Đã kích hoạt';
      case ORDER_STATUS.EXPIRED: return 'Hết hạn';
      case ORDER_STATUS.INACTIVE: return 'Chưa sử dụng';
      case ORDER_STATUS.UNPAID: return 'Chưa thanh toán';
      case ORDER_STATUS.USING: return 'Đang sử dụng';
      default: return status;
    }
  };

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleString('vi-VN');
  };

  // Common table columns
  const getColumns = (ticketType) => [
    {
      title: 'Mã vé',
      dataIndex: 'ticketCode',
      key: 'ticketCode',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'Khách hàng',
      key: 'user',
      width: 150,
      render: (_, record) => (
        <div>
          <div>{record.user?.firstName && record.user?.lastName ? 
            `${record.user.firstName} ${record.user.lastName}` : 
            record.user?.username || '—'}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.user?.phone || record.user?.email || '—'}
          </div>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
      filters: [
        { text: 'Đã kích hoạt', value: ORDER_STATUS.ACTIVE },
        { text: 'Hết hạn', value: ORDER_STATUS.EXPIRED },
        { text: 'Chưa kích hoạt', value: ORDER_STATUS.INACTIVE },
        { text: 'Chưa thanh toán', value: ORDER_STATUS.UNPAID },
        { text: 'Đang sử dụng', value: ORDER_STATUS.USING },
      ],
      onFilter: (value, record) => record.status === value,
    },
    ...(ticketType !== 'STATIC' ? [{
      title: 'Tuyến đường',
      key: 'route',
      width: 200,
      render: (_, record) => {
        if (!record.startStation || !record.endStation) {
          return <div style={{ color: '#999', fontStyle: 'italic' }}>Chưa có thông tin tuyến</div>;
        }

        return (
          <div className="route-display">
            <div style={{ fontWeight: 500, fontSize: '13px' }}>
              {record.startStation.stationCode} - {record.startStation.name}
            </div>
            <div className="route-arrow">↓</div>
            <div style={{ fontWeight: 500, fontSize: '13px' }}>
              {record.endStation.stationCode} - {record.endStation.name}
            </div>
          </div>
        );
      },
    }] : []),
    {
      title: 'Giá vé',
      dataIndex: 'price',
      key: 'price',
      width: 120,
      render: (price) => formatPrice(price),
      sorter: (a, b) => a.price - b.price,
    },
    {
      title: 'Ngày mua',
      dataIndex: 'purchaseDate',
      key: 'purchaseDate',
      width: 150,
      render: formatDate,
      sorter: (a, b) => new Date(a.purchaseDate || 0) - new Date(b.purchaseDate || 0),
    },
    ...(ticketType === 'STATIC' ? [{
      title: 'Hạn sử dụng',
      dataIndex: 'validUntil',
      key: 'validUntil',
      width: 150,
      render: formatDate,
      sorter: (a, b) => new Date(a.validUntil || 0) - new Date(b.validUntil || 0),
    }] : []),
    {
      title: 'Mã giao dịch',
      dataIndex: 'transactionId',
      key: 'transactionId',
      width: 120,
      render: (txnId) => txnId || '—',
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            style={{
              borderRadius: '6px',
              border: '1px solid #d9d9d9',
              backgroundColor: '#fafafa'
            }}
          />
        </Space>
      ),
    },
  ];

  const handleRefresh = () => {
    fetchTicketData();
  };

  // QR Scanner function
  const handleScanQR = () => {
    setIsQRScannerVisible(true);
  };

  // Handle QR scan result
  const handleQRScanResult = async (scannedToken) => {
    setIsQRScannerVisible(false);

    if (!scannedToken) {
      return;
    }

    try {
      setLoading(true);
      const response = await getTicketOrderByTokenAPI(scannedToken);

      if (response.code === 200) {
        const ticketData = response.result;
        setSelectedTicket(ticketData);

        // Populate edit form
        editForm.setFieldsValue({
          ticketCode: ticketData.ticketCode,
          status: ticketData.status,
          price: ticketData.price,
          validUntil: ticketData.validUntil,
          purchaseDate: ticketData.purchaseDate,
          transactionId: ticketData.transactionId
        });

        setIsEditModalVisible(true);
        message.success("Đã quét QR thành công! Có thể chỉnh sửa thông tin vé.");
      } else {
        message.error("Không tìm thấy vé với mã QR này.");
      }
    } catch (error) {
      message.error("Lỗi khi quét QR: " + (error.message || "Có lỗi xảy ra"));
    } finally {
      setLoading(false);
    }
  };

  // Handle view detail
  const handleViewDetail = (record) => {
    setSelectedTicket(record);
    
    // Populate view form (read-only)
    viewForm.setFieldsValue({
      ticketCode: record.ticketCode,
      status: record.status,
      price: record.price,
      validUntil: record.validUntil,
      purchaseDate: record.purchaseDate,
      transactionId: record.transactionId
    });

    setIsViewDetailModalVisible(true);
  };

  // Handle edit ticket
  const handleEditTicket = async (values) => {
    try {
      setLoading(true);
      const response = await updateTicketOrderAPI(selectedTicket.id, values);

      if (response.code === 200) {
        message.success("Cập nhật vé thành công!");
        setIsEditModalVisible(false);
        setSelectedTicket(null);
        editForm.resetFields();
        handleRefresh(); // Refresh data
      } else {
        message.error("Cập nhật vé thất bại.");
      }
    } catch (error) {
      message.error("Lỗi khi cập nhật vé: " + (error.message || "Có lỗi xảy ra"));
    } finally {
      setLoading(false);
    }
  };

  // Close edit modal
  const handleCloseEditModal = () => {
    setIsEditModalVisible(false);
    setSelectedTicket(null);
    editForm.resetFields();
  };

  // Close view detail modal
  const handleCloseViewDetailModal = () => {
    setIsViewDetailModalVisible(false);
    setSelectedTicket(null);
    viewForm.resetFields();
  };

  const tabItems = [
    {
      key: 'static',
      label: `Vé tháng/cố định`,
      children: (
        <Table
          dataSource={ticketData.data}
          columns={getColumns('STATIC')}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            current: pagination.page,
            pageSize: pagination.size,
            total: ticketData.totalElements,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} vé`,
            onChange: (page, size) => {
              setPagination({ page, size });
            },
          }}
        />
      ),
    },
    {
      key: 'single',
      label: `Vé lượt`,
      children: (
        <Table
          dataSource={ticketData.data}
          columns={getColumns('SINGLE')}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            current: pagination.page,
            pageSize: pagination.size,
            total: ticketData.totalElements,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} của ${total} vé`,
            onChange: (page, size) => {
              setPagination({ page, size });
            },
          }}
        />
      ),
    },
  ];

  return (
    <div className="ticket-management">
      <div className="ticket-management-header">
        

        <div className="ticket-management-filters">
          <Space size="middle">
            <Input
              placeholder="Tìm kiếm mã vé, tên khách hàng..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
            />

            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 150 }}
            >
              <Option value="ALL">Tất cả trạng thái</Option>
              <Option value="ACTIVE">Đã kích hoạt</Option>
              <Option value="EXPIRED">Hết hạn</Option>
              <Option value="INACTIVE">Chưa kích hoạt</Option>
              <Option value="UNPAID">Chưa thanh toán</Option>
              <Option value="USING">Đang sử dụng</Option>
              <Option value="CANCELLED">Đã hủy</Option>
            </Select>

            <RangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              format="DD/MM/YYYY"
              value={dateRange}
              onChange={setDateRange}
            />

            <PrimaryButton
              icon={<QrcodeOutlined />}
              onClick={handleScanQR}
              type="primary"

            >
              Scan QR
            </PrimaryButton>

            <Button
              icon={<ReloadOutlined />}
              onClick={handleRefresh}
              loading={loading}
            >
              Làm mới
            </Button>
          </Space>
        </div>
      </div>

      <div className="ticket-management-content">
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          size="large"
        />
      </div>

      {/* Edit Ticket Modal */}
      <ModalTicketDetail
        visible={isEditModalVisible}
        onCancel={handleCloseEditModal}
        onSubmit={handleEditTicket}
        loading={loading}
        selectedTicket={selectedTicket}
        form={editForm}
      />

      {/* View Detail Modal */}
      <ModalTicketDetail
        visible={isViewDetailModalVisible}
        onCancel={handleCloseViewDetailModal}
        onSubmit={() => {}} // No submit for view mode
        loading={false}
        selectedTicket={selectedTicket}
        form={viewForm}
        readOnly={false}
      />

      {/* QR Scanner Modal */}
      <QRScanner
        visible={isQRScannerVisible}
        onCancel={() => setIsQRScannerVisible(false)}
        onScanResult={handleQRScanResult}
      />
    </div>
  );
};

export default TicketManagement;