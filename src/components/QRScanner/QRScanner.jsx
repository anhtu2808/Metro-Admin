import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, Typography, Alert, Space } from 'antd';
import { CameraOutlined, StopOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { Html5Qrcode } from 'html5-qrcode';

const { Text } = Typography;

const QRScanner = ({ visible, onCancel, onScanResult }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const html5QrCodeRef = useRef(null);

  const qrCodeSuccessCallback = (decodedText, decodedResult) => {
    console.log(`QR Code detected: ${decodedText}`, decodedResult);
    
    // Stop scanning and call parent callback
    stopScanning();
    onScanResult(decodedText);
  };

  const qrCodeErrorCallback = (errorMessage) => {
    // Handle scan errors (usually just no QR found, which is normal)
    // console.log(`QR Code scan error: ${errorMessage}`);
  };

  const checkBrowserSupport = () => {
    const info = {
      userAgent: navigator.userAgent,
      isHTTPS: window.location.protocol === 'https:',
      hasMediaDevices: !!navigator.mediaDevices,
      hasGetUserMedia: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
      hasHtml5Qrcode: typeof Html5Qrcode !== 'undefined',
      isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    };
    
    setDebugInfo(info);
    return info;
  };

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);

      // Check browser support first
      const browserInfo = checkBrowserSupport();
      
      // Check if we're on HTTPS or localhost (required for camera access)
      if (!browserInfo.isHTTPS && !browserInfo.isLocalhost) {
        throw new Error('Camera chỉ hoạt động trên HTTPS hoặc localhost. Vui lòng sử dụng HTTPS hoặc localhost.');
      }

      // Check if Html5Qrcode is available
      if (!browserInfo.hasHtml5Qrcode) {
        throw new Error('Thư viện QR Scanner chưa được tải. Vui lòng tải lại trang.');
      }

      // Check if getUserMedia is supported
      if (!browserInfo.hasGetUserMedia) {
        throw new Error('Trình duyệt không hỗ trợ truy cập camera. Vui lòng sử dụng trình duyệt hiện đại (Chrome, Firefox, Safari).');
      }

      // Initialize Html5Qrcode
      html5QrCodeRef.current = new Html5Qrcode("qr-reader");

      // Get cameras with better error handling
      let cameras = [];
      try {
        cameras = await Html5Qrcode.getCameras();
        console.log('Available cameras:', cameras);
      } catch (cameraError) {
        console.error('Error getting cameras:', cameraError);
        throw new Error('Không thể truy cập danh sách camera. Vui lòng kiểm tra quyền truy cập camera.');
      }

      if (!cameras || cameras.length === 0) {
        throw new Error('Không tìm thấy camera trên thiết bị này. Vui lòng kiểm tra camera và thử lại.');
      }

      const cameraId = cameras[0].id;
      
      // Start scanning with back camera if available, otherwise use first camera
      const backCamera = cameras.find(camera => 
        camera.label.toLowerCase().includes('back') || 
        camera.label.toLowerCase().includes('rear')
      );
      const selectedCameraId = backCamera ? backCamera.id : cameraId;

      console.log('Starting camera with ID:', selectedCameraId);

      await html5QrCodeRef.current.start(
        selectedCameraId,
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        qrCodeSuccessCallback,
        qrCodeErrorCallback
      );

      setCameraPermission('granted');
      console.log('Camera started successfully');
    } catch (err) {
      console.error('Error starting QR scanner:', err);
      
      let errorMessage = 'Lỗi không xác định khi khởi động camera';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Quyền truy cập camera bị từ chối. Vui lòng cho phép truy cập camera.';
        setCameraPermission('denied');
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'Không tìm thấy camera trên thiết bị này.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Trình duyệt không hỗ trợ truy cập camera.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera đang được sử dụng bởi ứng dụng khác. Vui lòng đóng ứng dụng khác và thử lại.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Camera không đáp ứng yêu cầu kỹ thuật.';
      } else if (err.name === 'SecurityError') {
        errorMessage = 'Lỗi bảo mật khi truy cập camera. Vui lòng kiểm tra cài đặt bảo mật.';
      } else if (err.name === 'AbortError') {
        errorMessage = 'Thao tác camera bị hủy. Vui lòng thử lại.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    try {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop();
        console.log('Camera stopped successfully');
      }
    } catch (err) {
      console.error('Error stopping scanner:', err);
    }
    
    setIsScanning(false);
  };

  const handleCancel = () => {
    stopScanning();
    onCancel();
  };

  // Auto start scanning when modal opens
  useEffect(() => {
    if (visible && !isScanning) {
      // Add a small delay to ensure the modal is fully rendered
      const timer = setTimeout(() => {
        startScanning();
      }, 200);
      
      return () => clearTimeout(timer);
    }
    
    return () => {
      if (html5QrCodeRef.current) {
        stopScanning();
      }
    };
  }, [visible]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (html5QrCodeRef.current) {
        stopScanning();
      }
    };
  }, []);

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CameraOutlined />
          <span>Quét mã QR</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          Đóng
        </Button>,
        <Button 
          key="stop" 
          type="primary" 
          danger 
          icon={<StopOutlined />}
          onClick={stopScanning}
          disabled={!isScanning}
        >
          Dừng quét
        </Button>,
      ]}
      width={500}
      centered
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        {error ? (
          <Space direction="vertical" style={{ width: '100%' }}>
            <Alert
              message="Lỗi Camera"
              description={error}
              type="error"
              showIcon
            />
            {cameraPermission === 'denied' && (
              <Text type="secondary" style={{ fontSize: '12px' }}>
                Để sử dụng tính năng quét QR, vui lòng:
                <br />1. Nhấp vào biểu tượng camera trên thanh địa chỉ
                <br />2. Chọn "Cho phép" để cấp quyền truy cập camera
                <br />3. Tải lại trang và thử lại
              </Text>
            )}
            <Button type="primary" onClick={startScanning}>
              Thử lại
            </Button>
            
            {/* Debug information for developers */}
            {process.env.NODE_ENV === 'development' && (
              <details style={{ marginTop: '16px', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', color: '#1890ff' }}>
                  <ExclamationCircleOutlined /> Thông tin debug
                </summary>
                <pre style={{ 
                  marginTop: '8px',
                  padding: '8px',
                  background: '#f5f5f5',
                  borderRadius: '4px',
                  fontSize: '11px',
                  overflow: 'auto'
                }}>
                  {JSON.stringify(debugInfo, null, 2)}
                </pre>
              </details>
            )}
          </Space>
        ) : (
          <>
            <div
              id="qr-reader"
              style={{
                width: '100%',
                maxWidth: '400px',
                margin: '0 auto',
                border: '2px solid #1890ff',
                borderRadius: '8px',
                overflow: 'hidden',
                minHeight: '300px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f5f5f5'
              }}
            >
              {!isScanning && (
                <div style={{ textAlign: 'center', color: '#666' }}>
                  <CameraOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                  <br />
                  <Text>Đang khởi động camera...</Text>
                </div>
              )}
            </div>
            
            {isScanning && (
              <div style={{ marginTop: '16px' }}>
                <Text type="secondary">
                  Đang quét... Hướng camera về phía mã QR
                </Text>
                <div style={{ 
                  marginTop: '8px',
                  padding: '8px 16px',
                  background: '#f6ffed',
                  border: '1px solid #b7eb8f',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}>
                  📷 Camera đang hoạt động
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default QRScanner; 