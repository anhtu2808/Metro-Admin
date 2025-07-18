import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Select, Switch, Button, Typography, Space, message, Alert, Tag, Divider } from 'antd';
import { ScanOutlined, EnvironmentOutlined, LineOutlined, CheckCircleOutlined, CloseCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { setLayoutData } from '../../redux/layoutSlice';
import { getAllLinesAPI, getAllStationsAPI, validateTicketAPI } from '../../apis';
import QRScanner from '../../components/QRScanner/QRScanner';
import PrimaryButton from '../../components/PrimaryButton/PrimaryButton';
import './MetroGatewayScanner.css';

const { Title, Text } = Typography;
const { Option } = Select;

const MetroGatewayScanner = () => {
  const dispatch = useDispatch();
  
  // Scanner configuration state
  const [selectedLineId, setSelectedLineId] = useState(1);
  const [selectedStationId, setSelectedStationId] = useState(0);
  const [isCheckIn, setIsCheckIn] = useState(true);
  const [scannedToken, setScannedToken] = useState('');
  
  // Data state
  const [lines, setLines] = useState([]);
  const [stations, setStations] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Scanner state
  const [isQRScannerVisible, setIsQRScannerVisible] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [lastValidationTime, setLastValidationTime] = useState(null);

  useEffect(() => {
    dispatch(setLayoutData({
      title: "Metro Gateway Scanner",
      icon: <ScanOutlined />,
    }));
    
    loadInitialData();
  }, [dispatch]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load lines and stations in parallel
      const [linesResponse, stationsResponse] = await Promise.all([
        getAllLinesAPI({ page: 1, size: 100 }),
        getAllStationsAPI({ page: 1, size: 100 })
      ]);
      
      if (linesResponse.code === 200) {
        setLines(linesResponse.result.data || []);
      }
      
      if (stationsResponse.code === 200) {
        setStations(stationsResponse.result.data || []);
      }
      
    } catch (error) {
      console.error('Error loading data:', error);
      message.error('Không thể tải dữ liệu lines và stations');
    } finally {
      setLoading(false);
    }
  };

  const handleScanQR = () => {
    setIsQRScannerVisible(true);
  };

  const handleQRScanResult = async (token) => {
    setIsQRScannerVisible(false);
    
    if (!token) {
      return;
    }
    
    setScannedToken(token);
    await validateTicket(token);
  };

  const validateTicket = async (token) => {
    try {
      setLoading(true);
      setValidationResult(null);
      
      const payload = {
        lineId: selectedLineId,
        stationId: selectedStationId,
        ticketOrderToken: token,
        isCheckIn: isCheckIn
      };
      
      console.log('Validating ticket with payload:', payload);
      
      const response = await validateTicketAPI(payload);
      
      if (response.code === 200) {
        setValidationResult({
          success: true,
          message: response.message || 'Validation thành công',
          data: response.result,
          timestamp: new Date()
        });
        setLastValidationTime(new Date());
        message.success(`${isCheckIn ? 'Check-in' : 'Check-out'} thành công!`);
      } else {
        setValidationResult({
          success: false,
          message: response.message || 'Validation thất bại',
          data: response.result,
          timestamp: new Date()
        });
        message.error(`${isCheckIn ? 'Check-in' : 'Check-out'} thất bại: ${response.message}`);
      }
      
    } catch (error) {
      console.error('Error validating ticket:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Có lỗi xảy ra';
      
      setValidationResult({
        success: false,
        message: errorMessage,
        timestamp: new Date()
      });
      
      message.error(`Lỗi ${isCheckIn ? 'check-in' : 'check-out'}: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleManualValidation = () => {
    if (!scannedToken.trim()) {
      message.warning('Vui lòng scan QR hoặc nhập token trước!');
      return;
    }
    
    validateTicket(scannedToken);
  };

  const handleReset = () => {
    setScannedToken('');
    setValidationResult(null);
    setLastValidationTime(null);
    message.info('Đã reset scanner');
  };

  const getSelectedLineName = () => {
    const line = lines.find(l => l.id === selectedLineId);
    return line ? (line.lineCode || line.name || `Line ${selectedLineId}`) : `Line ${selectedLineId}`;
  };

  const getSelectedStationName = () => {
    const station = stations.find(s => s.id === selectedStationId);
    return station ? station.name : `Station ${selectedStationId}`;
  };

  return (
    <div className="metro-gateway-scanner">
      <Row gutter={[24, 24]}>
        {/* Scanner Configuration */}
        <Col xs={24} lg={12}>
          <Card title="🎯 Cấu hình Gateway Scanner" className="scanner-config-card">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              
              {/* Line Selection */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  <LineOutlined /> Chọn tuyến tàu (Line ID):
                </Text>
                <Select
                  value={selectedLineId}
                  onChange={setSelectedLineId}
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="Chọn tuyến tàu"
                  loading={loading}
                >
                  {lines.map(line => (
                    <Option key={line.id} value={line.id}>
                      {line.lineCode || line.name || `Line ${line.id}`}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Station Selection */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  <EnvironmentOutlined /> Chọn ga (Station ID):
                </Text>
                <Select
                  value={selectedStationId}
                  onChange={setSelectedStationId}
                  style={{ width: '100%' }}
                  size="large"
                  placeholder="Chọn ga"
                  loading={loading}
                >
                  <Option value={0}>Station 0 (Default)</Option>
                  {stations.map(station => (
                    <Option key={station.id} value={station.id}>
                      {station.stationCode || `S${station.id}`} - {station.name}
                    </Option>
                  ))}
                </Select>
              </div>

              {/* Check-in/Check-out Switch */}
              <div>
                <Text strong style={{ display: 'block', marginBottom: 8 }}>
                  Loại thao tác:
                </Text>
                <div style={{ 
                  padding: '12px 16px', 
                  background: isCheckIn ? '#f6ffed' : '#fff2e8',
                  border: `1px solid ${isCheckIn ? '#b7eb8f' : '#ffd591'}`,
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <Space>
                    <Text strong style={{ color: isCheckIn ? '#52c41a' : '#fa8c16' }}>
                      {isCheckIn ? '🟢 CHECK-IN' : '🟡 CHECK-OUT'}
                    </Text>
                    <Text type="secondary">
                      ({isCheckIn ? 'Vào ga' : 'Ra ga'})
                    </Text>
                  </Space>
                  <Switch
                    checked={isCheckIn}
                    onChange={setIsCheckIn}
                    size="default"
                    checkedChildren="IN"
                    unCheckedChildren="OUT"
                  />
                </div>
              </div>

              <Divider />

              {/* Current Configuration Display */}
              <Alert
                message="Cấu hình hiện tại"
                description={
                  <div>
                    <Text strong>Line ID:</Text> {selectedLineId} ({getSelectedLineName()})<br/>
                    <Text strong>Station ID:</Text> {selectedStationId} ({getSelectedStationName()})<br/>
                    <Text strong>Is Check-in:</Text> {isCheckIn.toString()}<br/>
                    <Text strong>Action:</Text> {isCheckIn ? 'CHECK-IN (Vào ga)' : 'CHECK-OUT (Ra ga)'}
                  </div>
                }
                type="info"
                showIcon
              />

            </Space>
          </Card>
        </Col>

        {/* Scanner Actions */}
        <Col xs={24} lg={12}>
          <Card title="📱 Scanner & Validation" className="scanner-action-card">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              
              {/* QR Scanner */}
              <div style={{ textAlign: 'center' }}>
                <PrimaryButton
                  type="primary"
                  size="large"
                  icon={<ScanOutlined />}
                  onClick={handleScanQR}
                  style={{ 
                    height: '60px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    background: 'linear-gradient(135deg, #1890ff, #36cfc9)',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(24, 144, 255, 0.3)'
                  }}
                  block
                >
                  SCAN QR CODE
                </PrimaryButton>
              </div>

              {/* Scanned Token Display */}
              {scannedToken && (
                <div>
                  <Text strong style={{ display: 'block', marginBottom: 8 }}>
                    Token đã scan:
                  </Text>
                  <div style={{ 
                    padding: '12px',
                    background: '#f5f5f5',
                    borderRadius: '8px',
                    wordBreak: 'break-all',
                    fontFamily: 'monospace'
                  }}>
                    {scannedToken}
                  </div>
                </div>
              )}

              {/* Manual Validation Button */}
              <Space style={{ width: '100%' }}>
                <Button
                  type="default"
                  icon={<CheckCircleOutlined />}
                  onClick={handleManualValidation}
                  disabled={!scannedToken}
                  loading={loading}
                  size="large"
                >
                  Validate Manual
                </Button>
                <Button
                  type="default"
                  icon={<ReloadOutlined />}
                  onClick={handleReset}
                  size="large"
                >
                  Reset
                </Button>
              </Space>

              {/* Last Validation Time */}
              {lastValidationTime && (
                <div>
                  <Text type="secondary">
                    Lần validation cuối: {lastValidationTime.toLocaleString('vi-VN')}
                  </Text>
                </div>
              )}

            </Space>
          </Card>
        </Col>

        {/* Validation Result */}
        {validationResult && (
          <Col xs={24}>
            <Card 
              title={
                <Space>
                  {validationResult.success ? (
                    <>
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                      <Text style={{ color: '#52c41a' }}>Validation Thành Công</Text>
                    </>
                  ) : (
                    <>
                      <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                      <Text style={{ color: '#ff4d4f' }}>Validation Thất Bại</Text>
                    </>
                  )}
                  <Tag color={validationResult.success ? 'success' : 'error'}>
                    {isCheckIn ? 'CHECK-IN' : 'CHECK-OUT'}
                  </Tag>
                </Space>
              }
              className="validation-result-card"
            >
              <Space direction="vertical" style={{ width: '100%' }} size="large">
                
                <Alert
                  message={validationResult.message}
                  type={validationResult.success ? 'success' : 'error'}
                  showIcon
                />

                {validationResult.data && (
                  <div>
                    <Text strong>Chi tiết validation:</Text>
                    <pre style={{ 
                      marginTop: 8,
                      padding: '12px',
                      background: '#f5f5f5',
                      borderRadius: '8px',
                      fontSize: '12px',
                      overflow: 'auto'
                    }}>
                      {JSON.stringify(validationResult.data, null, 2)}
                    </pre>
                  </div>
                )}

                <div>
                  <Text type="secondary">
                    Thời gian: {validationResult.timestamp.toLocaleString('vi-VN')}
                  </Text>
                </div>

              </Space>
            </Card>
          </Col>
        )}

      </Row>

      {/* QR Scanner Modal */}
      <QRScanner
        visible={isQRScannerVisible}
        onCancel={() => setIsQRScannerVisible(false)}
        onScanResult={handleQRScanResult}
      />
    </div>
  );
};

export default MetroGatewayScanner; 