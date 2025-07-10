import React, { useEffect, useRef, useState } from 'react';
import { Modal, Button, Typography, Alert, Space } from 'antd';
import { CameraOutlined, StopOutlined } from '@ant-design/icons';
import { Html5Qrcode } from 'html5-qrcode';

const { Text } = Typography;

const QRScanner = ({ visible, onCancel, onScanResult }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [cameraPermission, setCameraPermission] = useState(null);
  const scannerRef = useRef(null);
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

  const startScanning = async () => {
    try {
      setError(null);
      setIsScanning(true);

      // Initialize Html5Qrcode
      html5QrCodeRef.current = new Html5Qrcode("qr-reader");

      // Get cameras
      const cameras = await Html5Qrcode.getCameras();
      if (cameras && cameras.length) {
        const cameraId = cameras[0].id;
        
        // Start scanning with back camera if available, otherwise use first camera
        const backCamera = cameras.find(camera => 
          camera.label.toLowerCase().includes('back') || 
          camera.label.toLowerCase().includes('rear')
        );
        const selectedCameraId = backCamera ? backCamera.id : cameraId;

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
      } else {
        setError('Không tìm thấy camera trên thiết bị này.');
        setIsScanning(false);
      }
    } catch (err) {
      console.error('Error starting QR scanner:', err);
      
      if (err.name === 'NotAllowedError') {
        setError('Quyền truy cập camera bị từ chối. Vui lòng cho phép truy cập camera.');
        setCameraPermission('denied');
      } else if (err.name === 'NotFoundError') {
        setError('Không tìm thấy camera trên thiết bị này.');
      } else {
        setError('Lỗi khi khởi động camera: ' + err.message);
      }
      
      setIsScanning(false);
    }
  };

  const stopScanning = async () => {
    try {
      if (html5QrCodeRef.current && html5QrCodeRef.current.isScanning) {
        await html5QrCodeRef.current.stop();
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
      startScanning();
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
                overflow: 'hidden'
              }}
            />
            
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