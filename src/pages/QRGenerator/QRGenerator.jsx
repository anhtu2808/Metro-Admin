import React, { useState, useEffect } from 'react';
import { Card, Input, Button, Typography, Space, Row, Col, message, Alert, Divider } from 'antd';
import { QrcodeOutlined, CopyOutlined, DownloadOutlined, ApiOutlined } from '@ant-design/icons';
import QRCode from 'react-qr-code';
import { useDispatch } from 'react-redux';
import { setLayoutData } from '../../redux/layoutSlice';
import { getTicketOrderByIdAPI } from '../../apis';
import './QRGenerator.css';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const QRGenerator = () => {
  const dispatch = useDispatch();
  const [token, setToken] = useState('');
  const [qrValue, setQRValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [sampleTokens] = useState([
    'ticket_token_001_active',
    'ticket_token_002_expired', 
    'ticket_token_003_fixed',
    'ticket_token_004_single',
    'ticket_token_005_unpaid'
  ]);

  useEffect(() => {
    dispatch(setLayoutData({
      title: "QR Code Generator",
      icon: <QrcodeOutlined />,
    }));
  }, [dispatch]);

  const handleGenerateQR = () => {
    if (!token.trim()) {
      message.warning('Vui lòng nhập token để tạo QR code');
      return;
    }
    setQRValue(token.trim());
    message.success('QR code đã được tạo thành công!');
  };

  const handleCopyToken = (tokenToCopy) => {
    navigator.clipboard.writeText(tokenToCopy).then(() => {
      message.success('Token đã được copy vào clipboard!');
    }).catch(() => {
      message.error('Không thể copy token');
    });
  };

  const handleUseSampleToken = (sampleToken) => {
    setToken(sampleToken);
    setQRValue(sampleToken);
    message.success(`Đã sử dụng token mẫu: ${sampleToken}`);
  };

  const handleDownloadQR = () => {
    if (!qrValue) {
      message.warning('Vui lòng tạo QR code trước khi download');
      return;
    }

    // Create canvas from QR code
    const svg = document.querySelector('#qr-code-display svg');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    // Convert SVG to PNG
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    
    img.onload = () => {
      canvas.width = 256;
      canvas.height = 256;
      ctx.drawImage(img, 0, 0, 256, 256);
      
      // Download
      const link = document.createElement('a');
      link.download = `qr-code-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
      
      URL.revokeObjectURL(url);
      message.success('QR code đã được download!');
    };
    
    img.src = url;
  };

  const handleClearAll = () => {
    setToken('');
    setQRValue('');
    message.success('Đã xóa tất cả dữ liệu');
  };

  const handleGetTokenFromAPI = async () => {
    try {
      setLoading(true);
      const response = await getTicketOrderByIdAPI(26);
      
      if (response.code === 200) {
        const ticketQRToken = response.result.ticketQRToken;
        setToken(ticketQRToken);
        setQRValue(ticketQRToken);
        message.success('Đã lấy token từ API thành công!');
      } else {
        message.error('Không thể lấy token từ API');
      }
    } catch (error) {
      message.error('Lỗi khi gọi API: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="qr-generator">
      <Row gutter={[24, 24]}>
        {/* Left Column - Input */}
        <Col xs={24} lg={12}>
          <Card title="🎫 Tạo QR Code cho Token Vé" className="generator-card">
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              
              {/* Token Input */}
              <div>
                <Text strong>Nhập Token:</Text>
                <TextArea
                  placeholder="Nhập token của vé tại đây..."
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  rows={3}
                  style={{ marginTop: 8 }}
                />
              </div>

              {/* Action Buttons */}
              <Space wrap>
                <Button 
                  type="primary" 
                  icon={<ApiOutlined />}
                  onClick={handleGetTokenFromAPI}
                  loading={loading}
                  size="large"
                >
                  Lấy Token API (ID=1)
                </Button>
                <Button 
                  type="primary" 
                  icon={<QrcodeOutlined />}
                  onClick={handleGenerateQR}
                  size="large"
                >
                  Tạo QR Code
                </Button>
                <Button 
                  icon={<CopyOutlined />}
                  onClick={() => handleCopyToken(token)}
                  disabled={!token}
                >
                  Copy Token
                </Button>
                <Button 
                  danger
                  onClick={handleClearAll}
                >
                  Xóa tất cả
                </Button>
              </Space>

              <Divider />

              {/* API Token Info */}
              <Alert
                message="🔥 Token thật từ API"
                description="Nhấn 'Lấy Token API (ID=1)' để lấy ticketQRToken thật từ getTicketOrderByIdAPI"
                type="success"
                showIcon
                style={{ marginBottom: 16 }}
              />

              {/* Sample Tokens */}
              <div>
                <Text strong>📋 Token mẫu để test:</Text>
                <div style={{ marginTop: 12 }}>
                  {sampleTokens.map((sampleToken, index) => (
                    <div key={index} style={{ 
                      marginBottom: 8,
                      padding: '8px 12px',
                      background: '#f5f5f5',
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <Text code style={{ flex: 1, marginRight: 8 }}>
                        {sampleToken}
                      </Text>
                      <Space>
                        <Button 
                          size="small" 
                          type="link"
                          onClick={() => handleUseSampleToken(sampleToken)}
                        >
                          Sử dụng
                        </Button>
                        <Button 
                          size="small" 
                          type="link"
                          icon={<CopyOutlined />}
                          onClick={() => handleCopyToken(sampleToken)}
                        >
                          Copy
                        </Button>
                      </Space>
                    </div>
                  ))}
                </div>
              </div>
            </Space>
          </Card>
        </Col>

        {/* Right Column - QR Display */}
        <Col xs={24} lg={12}>
          <Card title="📱 QR Code Preview" className="qr-display-card">
            {qrValue ? (
              <Space direction="vertical" style={{ width: '100%', textAlign: 'center' }} size="large">
                <div id="qr-code-display" style={{ 
                  background: 'white', 
                  padding: '20px', 
                  borderRadius: '12px',
                  display: 'inline-block',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>
                  <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={qrValue}
                    viewBox={`0 0 256 256`}
                  />
                </div>
                
                <div>
                  <Text strong>Token: </Text>
                  <Text code>{qrValue}</Text>
                </div>

                <Space>
                  <Button 
                    icon={<DownloadOutlined />}
                    onClick={handleDownloadQR}
                  >
                    Download PNG
                  </Button>
                  <Button 
                    icon={<CopyOutlined />}
                    onClick={() => handleCopyToken(qrValue)}
                  >
                    Copy Token
                  </Button>
                </Space>

                <Alert
                  message="🎯 Hướng dẫn sử dụng"
                  description="Sử dụng QR code này để test chức năng Scan QR ở trang Quản lý đặt vé. Mở camera và hướng về QR code để quét."
                  type="info"
                  showIcon
                  style={{ textAlign: 'left' }}
                />
              </Space>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                <QrcodeOutlined style={{ fontSize: '64px', color: '#d9d9d9', marginBottom: '16px' }} />
                <Paragraph type="secondary">
                  Nhập token và nhấn "Tạo QR Code" để hiển thị QR code tại đây
                </Paragraph>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Instructions */}
      <Card style={{ marginTop: 24 }} title="📖 Hướng dẫn sử dụng">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={6}>
            <div className="instruction-step">
              <div className="step-number">1</div>
              <div>
                <Text strong>Lấy Token API</Text>
                <br />
                <Text type="secondary">Nhấn "Lấy Token API" để lấy token thật</Text>
              </div>
            </div>
          </Col>
          <Col xs={24} md={6}>
            <div className="instruction-step">
              <div className="step-number">2</div>
              <div>
                <Text strong>Hoặc Nhập Token</Text>
                <br />
                <Text type="secondary">Nhập token tự do hoặc dùng token mẫu</Text>
              </div>
            </div>
          </Col>
          <Col xs={24} md={6}>
            <div className="instruction-step">
              <div className="step-number">3</div>
              <div>
                <Text strong>Tạo QR Code</Text>
                <br />
                <Text type="secondary">QR code sẽ hiển thị để scan</Text>
              </div>
            </div>
          </Col>
          <Col xs={24} md={6}>
            <div className="instruction-step">
              <div className="step-number">4</div>
              <div>
                <Text strong>Test Scan</Text>
                <br />
                <Text type="secondary">Vào Ticket Management để scan</Text>
              </div>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default QRGenerator; 