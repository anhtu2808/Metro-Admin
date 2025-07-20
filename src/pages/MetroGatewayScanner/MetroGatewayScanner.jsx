import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Typography, Space, message, Alert, Tag, Button, Modal } from 'antd';
import { ScanOutlined, EnvironmentOutlined, LineOutlined, SettingOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setLayoutData } from '../../redux/layoutSlice';
import { getAllLinesAPI, getStationsByLineIdAPI, validateTicketAPI } from '../../apis';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import './MetroGatewayScanner.css';
import QRScanner from '../../components/QRScanner/QRScanner';

const { Title, Text } = Typography;
const { Option } = Select;

// Hàm lấy cấu hình đã lưu từ localStorage
const getInitialConfigs = () => {
  const savedConfigs = localStorage.getItem('scannerConfigs');
  try {
    return savedConfigs ? JSON.parse(savedConfigs) : { scanner1: null, scanner2: null };
  } catch (e) {
    return { scanner1: null, scanner2: null };
  }
};


// ===================================================================
// Component Modal Cấu hình (Đã sửa lỗi và tối ưu)
// ===================================================================
const ScannerConfigModal = ({ visible, onCancel, onConfigComplete, lines, initialConfigs }) => {
  // State cho cấu hình của 2 máy quét
  const [scanner1Config, setScanner1Config] = useState(initialConfigs.scanner1);
  const [scanner2Config, setScanner2Config] = useState(initialConfigs.scanner2);

  // State riêng cho danh sách trạm và trạng thái loading của mỗi máy
  const [scanner1Stations, setScanner1Stations] = useState([]);
  const [scanner2Stations, setScanner2Stations] = useState([]);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  // Hàm tải danh sách trạm dựa trên ID của tuyến
  const fetchStationsForLine = async (lineId, scannerKey) => {
    const setLoading = scannerKey === 'scanner1' ? setLoading1 : setLoading2;
    const setStations = scannerKey === 'scanner1' ? setScanner1Stations : setScanner2Stations;
    
    setLoading(true);
    try {
      const response = await getStationsByLineIdAPI(lineId);
      if (response.code === 200) {
        setStations(response.result || []);
      } else {
        message.error(`Không tải được danh sách trạm cho ${scannerKey}.`);
      }
    } catch (error) {
      message.error(`Lỗi API khi tải trạm cho ${scannerKey}.`);
    } finally {
      setLoading(false);
    }
  };

  // Xử lý khi người dùng thay đổi lựa chọn
  const handleSelectChange = (scannerKey, field, value, option) => {
    const isScanner1 = scannerKey === 'scanner1';
    const config = isScanner1 ? scanner1Config : scanner2Config;
    const setConfig = isScanner1 ? setScanner1Config : setScanner2Config;

    const newConfig = { ...config, [field]: value };
    
    // Nếu chọn tên trạm, lưu lại tên để hiển thị
    if (field === 'stationId' && option) {
        newConfig.stationName = option.children;
    }
    // Nếu chọn tên tuyến, lưu lại tên
    if (field === 'lineId' && option) {
        newConfig.lineName = option.children;
    }

    // Nếu người dùng chọn một tuyến mới
    if (field === 'lineId') {
      newConfig.stationId = null; // Reset trạm đã chọn
      newConfig.stationName = null;
      if (isScanner1) setScanner1Stations([]);
      else setScanner2Stations([]);
      
      if (value) {
        fetchStationsForLine(value, scannerKey);
      }
    }
    
    setConfig(newConfig);
  };

  // Xử lý khi lưu
  const handleSave = () => {
    if (!scanner1Config?.stationId || !scanner2Config?.stationId) {
      message.warning('Vui lòng cấu hình đầy đủ cho cả hai máy quét.');
      return;
    }
    onConfigComplete({ scanner1: scanner1Config, scanner2: scanner2Config });
  };

  // Component render form cho mỗi máy quét
  const renderConfigForm = (scannerKey, config, stationsList, isLoading) => (
    <Card title={<Title level={5}>Cấu hình {scannerKey === 'scanner1' ? "Máy 1 (Vào ga)" : "Máy 2 (Ra ga)"}</Title>} style={{ marginBottom: 16 }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        {/* Chọn Tuyến */}
        <Select
          placeholder="1. Chọn tuyến"
          value={config?.lineId}
          onChange={(value, option) => handleSelectChange(scannerKey, 'lineId', value, option)}
          style={{ width: '100%' }}
        >
          {lines.map(line => <Option key={line.id} value={line.id}>{line.name}</Option>)}
        </Select>
        {/* Chọn Trạm */}
        <Select
          placeholder="2. Chọn trạm"
          value={config?.stationId}
          onChange={(value, option) => handleSelectChange(scannerKey, 'stationId', value, option)}
          style={{ width: '100%' }}
          disabled={!config?.lineId || isLoading}
          loading={isLoading}
        >
          {stationsList.map(station => <Option key={station.id} value={station.id}>{station.name}</Option>)}
        </Select>
      </Space>
    </Card>
  );

  return (
    <Modal
      title={<><SettingOutlined /> Cấu hình máy quét độc lập</>}
      open={visible}
      onCancel={onCancel}
      width={700}
      footer={[
        <Button key="back" onClick={onCancel}>Hủy</Button>,
        <Button key="submit" type="primary" onClick={handleSave}>Lưu cấu hình</Button>
      ]}
    >
      <Row gutter={16}>
        <Col span={12}>{renderConfigForm('scanner1', scanner1Config, scanner1Stations, loading1)}</Col>
        <Col span={12}>{renderConfigForm('scanner2', scanner2Config, scanner2Stations, loading2)}</Col>
      </Row>
      <Alert message="Lưu ý: Máy 1 dùng cho Check-in, Máy 2 dùng cho Check-out." type="info" showIcon />
    </Modal>
  );
};


// ===================================================================
// Component Trang Chính
// ===================================================================
const MetroGatewayScanner = () => {
  const dispatch = useDispatch();
  const [scannerConfigs, setScannerConfigs] = useState(getInitialConfigs());
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false);
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isQRScannerVisible, setIsQRScannerVisible] = useState(false);
  const [activeScannerType, setActiveScannerType] = useState(null);
  const [validationResult, setValidationResult] = useState(null);
  const [gateOpen, setGateOpen] = useState(false);

  useEffect(() => {
    dispatch(setLayoutData({ title: "Metro Gateway Scanner", icon: <ScanOutlined /> }));
    // Chỉ tải danh sách tuyến khi component được mount
    const loadLines = async () => {
        setLoading(true);
        try {
            const linesResponse = await getAllLinesAPI({ page: 1, size: 100 });
            if (linesResponse.code === 200) {
                setLines(linesResponse.result.data || []);
            }
        } catch (error) {
            message.error('Không thể tải dữ liệu tuyến');
        } finally {
            setLoading(false);
        }
    };
    loadLines();
  }, [dispatch]);

  const handleConfigComplete = (configs) => {
    setScannerConfigs(configs);
    setIsConfigModalVisible(false);
    message.success("Đã lưu cấu hình máy quét!");
    localStorage.setItem('scannerConfigs', JSON.stringify(configs));
  };
  
  const handleScanQR = (type) => {
    if (!scannerConfigs.scanner1 || !scannerConfigs.scanner2) {
      message.error("Vui lòng cấu hình máy quét trước khi sử dụng!");
      return;
    }
    setActiveScannerType(type);
    setIsQRScannerVisible(true);
  };

  const handleQRScanResult = async (token) => {
    setIsQRScannerVisible(false);
    if (token) await validateTicket(token);
  };

  const openGate = () => {
    setGateOpen(true);
    setTimeout(() => setGateOpen(false), 3000);
  };

  const validateTicket = async (token) => {
    const isCheckIn = activeScannerType === 'checkIn';
    const config = isCheckIn ? scannerConfigs.scanner1 : scannerConfigs.scanner2;

    if (!config?.stationId) {
      message.error("Cấu hình máy quét không hợp lệ.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        lineId: config.lineId,
        stationId: config.stationId,
        ticketOrderToken: token,
        isCheckIn: isCheckIn
      };
      const response = await validateTicketAPI(payload);
      const resultData = {
        success: response.code === 200,
        message: response.message || (response.code === 200 ? 'Thành công' : 'Thất bại'),
        data: response.result,
        timestamp: new Date()
      };
      setValidationResult(resultData);
      if (resultData.success) {
        message.success(`${isCheckIn ? 'Check-in' : 'Check-out'} thành công!`);
        openGate();
      } else {
        message.error(`Lỗi: ${resultData.message}`);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Có lỗi xảy ra';
      setValidationResult({ success: false, message: errorMessage, timestamp: new Date() });
      message.error(`Lỗi: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Component hiển thị tóm tắt cấu hình
  const ConfigSummary = ({ title, config, type }) => (
    <Card title={title} size="small">
      <Space direction="vertical" style={{ width: '100%' }}>
        {config ? (
          <div>
            <Text><LineOutlined /> Tuyến: {config.lineName || `Line ${config.lineId}`}</Text>
            <br />
            <Text><EnvironmentOutlined /> Trạm: {config.stationName || `Station ${config.stationId}`}</Text>
          </div>
        ) : (
          <Text type="secondary">Chưa cấu hình</Text>
        )}
  
        <PrimaryButton
          icon={<ScanOutlined />}
          onClick={() => handleScanQR(type)}
          disabled={!config}
          block
        >
          Quét {type === 'checkIn' ? 'Vào' : 'Ra'}
        </PrimaryButton>
      </Space>
    </Card>
  );
  

  return (
    <div className="metro-gateway-scanner">
      <Row gutter={[24, 24]}>
        <Col xs={24}>
          <Card title="🎯 Trạng thái máy quét">
            <Button
              type="primary"
              icon={<SettingOutlined />}
              onClick={() => setIsConfigModalVisible(true)}
              style={{ marginBottom: 24 }}
            >
              Cấu hình máy quét
            </Button>
            <Row gutter={16}>
              <Col xs={24} md={12}>
                <ConfigSummary title="🟢 Máy Quét 1 (Check-in)" config={scannerConfigs.scanner1} type="checkIn" />
              </Col>
              <Col xs={24} md={12}>
                <ConfigSummary title="🟡 Máy Quét 2 (Check-out)" config={scannerConfigs.scanner2} type="checkOut" />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24}>
          <div className="gate-visualization">
            <Title level={5} style={{ textAlign: 'center', color: '#888' }}>Mô phỏng cổng vào/ra</Title>
            <div className="gate-wrapper">
              <div className="gate-post" />
              <div className={`gate-bar ${gateOpen ? 'open' : ''}`} />
              <div className="gate-post" />
            </div>
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <Tag color={gateOpen ? 'green' : 'red'}>{gateOpen ? 'ĐÃ MỞ' : 'ĐÃ ĐÓNG'}</Tag>
            </div>
          </div>
        </Col>

        {validationResult && (
          <Col xs={24}>
            <Card title="Kết quả xác thực">
              <Alert message={validationResult.message} type={validationResult.success ? 'success' : 'error'} showIcon />
              
            </Card>
          </Col>
        )}
      </Row>

      <ScannerConfigModal
        visible={isConfigModalVisible}
        onCancel={() => setIsConfigModalVisible(false)}
        onConfigComplete={handleConfigComplete}
        lines={lines}
        initialConfigs={scannerConfigs}
      />

      <QRScanner
        visible={isQRScannerVisible}
        onCancel={() => setIsQRScannerVisible(false)}
        onScanResult={handleQRScanResult}
      />
    </div>
  );
};

export default MetroGatewayScanner;