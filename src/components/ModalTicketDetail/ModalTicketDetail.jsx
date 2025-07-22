import React, { useEffect, useState } from 'react';
import { Modal, Form, Input, Select, Button, Typography, Row, Col } from 'antd';
import { EditOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons';
import { ORDER_STATUS } from '../../utils/constants';
import QRCode from 'react-qr-code';
import './ModalTicketDetail.css';
import { message } from 'antd';
import { getStationsByLineIdAPI } from '../../apis';

const { Text } = Typography;

const ModalTicketDetail = ({
  visible,
  onCancel,
  onSubmit,
  loading,
  selectedTicket,
  form,
  readOnly = false,
  stations: stationsProp = [], // fallback prop, ưu tiên state nội bộ
}) => {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    const fetchStations = async () => {
      if (
        selectedTicket &&
        selectedTicket.lineId &&
        selectedTicket.ticketType &&
        !selectedTicket.ticketType.isStatic
      ) {
        try {
          const res = await getStationsByLineIdAPI(selectedTicket.lineId);
          if (res.code === 200 && Array.isArray(res.result)) {
            setStations(res.result);
          } else {
            setStations([]);
          }
        } catch (err) {
          setStations([]);
        }
      } else {
        setStations([]);
      }
    };
    fetchStations();
  }, [selectedTicket]);

  if (!selectedTicket) return null;

  // Handle regenerate QR
  const handleRegenerateQR = async () => {
    console.log('Regenerating QR for ticket:', selectedTicket.id);
    // TODO: Call API to regenerate QR token
  };

  // Handle update ticket order
  const handleFinish = async (values) => {
    try {
      const payload = {
        status: values.status,
        ticketTypeId: selectedTicket.ticketType?.id,
        lineId: selectedTicket.lineId,
      };
      if (!selectedTicket.ticketType?.isStatic) {
        payload.startStationId = values.startStationId || selectedTicket.startStation?.id;
        payload.endStationId = values.endStationId || selectedTicket.endStation?.id;
      } else {
        payload.startStationId = selectedTicket.startStation?.id;
        payload.endStationId = selectedTicket.endStation?.id;
      }
      if (onSubmit) await onSubmit(payload);
      if (onCancel) onCancel();
    } catch (err) {
      message.error('Cập nhật vé thất bại!');
    }
  };

  return (
    <Modal
      title={
        <div className="modal-ticket-detail-title">
          {readOnly ? <EyeOutlined /> : <EditOutlined />}
          <span>{readOnly ? 'Xem chi tiết vé' : 'Chỉnh sửa thông tin vé'}</span>
        </div>
      }
      open={visible}
      onCancel={onCancel}
      footer={readOnly ? [
        <Button key="close" onClick={onCancel}>
          Đóng
        </Button>,
      ] : [
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={() => form.submit()}
        >
          Cập nhật
        </Button>,
      ]}
      width={800}
      className="modal-ticket-detail"
    >
      <div className="modal-ticket-detail-content">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          className="modal-ticket-detail-form"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Mã vé" name="ticketCode">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item 
                label="Trạng thái" 
                name="status"
                rules={readOnly ? [] : [{ required: true, message: 'Vui lòng chọn trạng thái' }]}
              >
                <Select disabled={readOnly}>
                  <Select.Option value={ORDER_STATUS.ACTIVE}>Đã kích hoạt</Select.Option>
                  <Select.Option value={ORDER_STATUS.EXPIRED}>Hết hạn</Select.Option>
                  <Select.Option value={ORDER_STATUS.INACTIVE}>Chưa kích hoạt</Select.Option>
                  <Select.Option value={ORDER_STATUS.UNPAID}>Chưa thanh toán</Select.Option>
                  <Select.Option value={ORDER_STATUS.USING}>Đang sử dụng</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Nếu là vé động thì cho phép chọn start/end station */}
          {!selectedTicket.ticketType?.isStatic && (
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Ga bắt đầu"
                  name="startStationId"
                  rules={[{ required: true, message: 'Vui lòng chọn ga bắt đầu' }]}
                  initialValue={selectedTicket.startStation?.id}
                >
                  <Select
                    showSearch
                    placeholder="Chọn ga bắt đầu"
                    optionFilterProp="children"
                    disabled={readOnly}
                  >
                    {(stations.length > 0 ? stations : stationsProp).map(station => (
                      <Select.Option key={station.id} value={station.id}>
                        {station.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Ga kết thúc"
                  name="endStationId"
                  rules={[{ required: true, message: 'Vui lòng chọn ga kết thúc' }]}
                  initialValue={selectedTicket.endStation?.id}
                >
                  <Select
                    showSearch
                    placeholder="Chọn ga kết thúc"
                    optionFilterProp="children"
                    disabled={readOnly}
                  >
                    {(stations.length > 0 ? stations : stationsProp).map(station => (
                      <Select.Option key={station.id} value={station.id}>
                        {station.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          )}

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Giá vé (VND)" name="price">
                <Input type="number" min={0} disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Mã giao dịch" name="transactionId">
                <Input placeholder="Chưa có giao dịch" disabled />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Ngày mua" name="purchaseDate">
                <Input disabled placeholder="Chưa thanh toán" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Hạn sử dụng" name="validUntil">
                <Input disabled placeholder="Chưa có" />
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {/* Ticket Type Info */}
        <div className="modal-ticket-detail-section modal-ticket-detail-ticket-type">
          <Text strong className="modal-ticket-detail-section-title">🎫 Loại vé:</Text>
          <div className="modal-ticket-detail-section-content">
            <Text strong>{selectedTicket.ticketType?.name}</Text>
            <br />
            <Text type="secondary">{selectedTicket.ticketType?.description}</Text>
            <br />
            <Row gutter={16} style={{ marginTop: '8px' }}>
              <Col span={12}>
                <Text>Hạn: {selectedTicket.ticketType?.validityDays === 0 ? '1 lượt' : `${selectedTicket.ticketType?.validityDays} ngày`}</Text>
              </Col>
              <Col span={12}>
                <Text>Giá gốc: {selectedTicket.ticketType?.price?.toLocaleString()} VND</Text>
              </Col>
            </Row>
            <Row gutter={16} style={{ marginTop: '4px' }}>
              <Col span={12}>
                <Text>{selectedTicket.ticketType?.isStudent ? '🎓 Vé sinh viên' : '👤 Vé thường'}</Text>
              </Col>
              <Col span={12}>
                <Text>{selectedTicket.ticketType?.isStatic ? '🔒 Giá cố định' : '📈 Giá động'}</Text>
              </Col>
            </Row>
          </div>
        </div>

        {/* User Info */}
        <div className="modal-ticket-detail-section modal-ticket-detail-user-info">
          <Text strong className="modal-ticket-detail-section-title">👤 Thông tin khách hàng:</Text>
          <div className="modal-ticket-detail-user-content">
            {selectedTicket.user?.avatarUrl && (
              <img 
                src={selectedTicket.user.avatarUrl} 
                alt="Avatar" 
                className="modal-ticket-detail-avatar"
              />
            )}
            <div className="modal-ticket-detail-user-details">
              <Text strong>{selectedTicket.user?.firstName} {selectedTicket.user?.lastName}</Text>
              <br />
              <Text>Username: @{selectedTicket.user?.username}</Text>
              <br />
              <Text>📞 {selectedTicket.user?.phone}</Text>
              <br />
              <Text>📧 {selectedTicket.user?.email}</Text>
              <br />
              <Text type="secondary">📍 {selectedTicket.user?.address}</Text>
            </div>
          </div>
        </div>

        {/* Route Info */}
        {!selectedTicket.ticketType.isStatic && selectedTicket.startStation && selectedTicket.endStation && (
          <div className="modal-ticket-detail-section modal-ticket-detail-route">
            <Text strong className="modal-ticket-detail-section-title">🚇 Tuyến đường:</Text>
            <Row gutter={16} className="modal-ticket-detail-route-content">
              <Col span={11}>
                <div className="modal-ticket-detail-station-card">
                  <Text strong className="modal-ticket-detail-station-code">{selectedTicket.startStation.stationCode}</Text>
                  <br />
                  <Text strong>{selectedTicket.startStation.name}</Text>
                  <br />
                  <Text type="secondary" className="modal-ticket-detail-station-address">{selectedTicket.startStation.address}</Text>
                </div>
              </Col>
              <Col span={2} className="modal-ticket-detail-arrow-container">
                <div className="modal-ticket-detail-arrow">➡️</div>
              </Col>
              <Col span={11}>
                <div className="modal-ticket-detail-station-card">
                  <Text strong className="modal-ticket-detail-station-code">{selectedTicket.endStation.stationCode}</Text>
                  <br />
                  <Text strong>{selectedTicket.endStation.name}</Text>
                  <br />
                  <Text type="secondary" className="modal-ticket-detail-station-address">{selectedTicket.endStation.address}</Text>
                </div>
              </Col>
            </Row>
          </div>
        )}

        {/* QR Code */}
        <div className="modal-ticket-detail-section modal-ticket-detail-qr-section">
          <div className="modal-ticket-detail-qr-header">
            <Text strong className="modal-ticket-detail-section-title">Mã QR vé:</Text>
            {!readOnly && (
              <Button 
                icon={<ReloadOutlined />} 
                size="small"
                onClick={handleRegenerateQR}
                className="modal-ticket-detail-regenerate-btn"
              >
                Regenerate
              </Button>
            )}
          </div>
          <div className="modal-ticket-detail-qr-content">
            <div className="modal-ticket-detail-qr-display">
              <QRCode
                value={selectedTicket.ticketQRToken || 'No token available'}
                size={150}
                bgColor="#ffffff"
                fgColor="#01589e"
                level="M"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalTicketDetail; 