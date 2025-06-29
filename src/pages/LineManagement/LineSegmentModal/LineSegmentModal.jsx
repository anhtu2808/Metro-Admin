import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  InputNumber,
  Button,
  message,
  Space,
  Typography,
  Row,
  Col,
  Card
} from 'antd';
import {
  SaveOutlined,
  CloseOutlined,
  ClockCircleOutlined,
  BranchesOutlined
} from '@ant-design/icons';
import { updateLineSegmentAPI } from '../../../apis';
import './LineSegmentModal.css';

const { Text } = Typography;

const LineSegmentModal = ({
  visible,
  onCancel,
  onSuccess,
  editingSegment,
  loading = false
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible && editingSegment) {
      form.setFieldsValue({
        duration: editingSegment.duration || 0,
        distance: editingSegment.distance || 0
      });
    }
  }, [visible, editingSegment, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      // Prepare payload for API
      const payload = {
        duration: values.duration || 0,
        distance: values.distance || 0
      };

      console.log('Updating line segment:', payload);

      // Call API to update line segment
      await updateLineSegmentAPI(editingSegment.id, payload);

      onSuccess();
    } catch (error) {
      if (error.errorFields) {
        message.error('Vui lòng kiểm tra lại thông tin!');
      } else {
        console.error('Error updating line segment:', error);
        message.error('Có lỗi xảy ra khi cập nhật line segment!');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };



  const getStationDisplayName = (station) => {
    if (!station) return 'N/A';
    return `${station.stationCode} - ${station.name}`;
  };

  return (
    <Modal
      title="Chỉnh sửa Line Segment"
      open={visible}
      onCancel={handleCancel}
      footer={
        <div className="line-segment-modal-footer">
          <Button
            key="cancel"
            icon={<CloseOutlined />}
            onClick={handleCancel}
            disabled={submitting}
          >
            Hủy
          </Button>
          <Button
            key="submit"
            type="primary"
            icon={<SaveOutlined />}
            loading={submitting}
            onClick={handleSubmit}
          >
            Lưu thay đổi
          </Button>
        </div>
      }
      width={600}
      centered
      destroyOnClose
      className="line-segment-modal"
    >
      <div className="line-segment-modal-content">
        {/* Current Segment Info */}
        {editingSegment && (
          <Card className="segment-info-card" size="small">
            <Row gutter={16} align="middle">
              <Col span={2}>
                <div className="segment-order">
                  <Text strong>{editingSegment.order}</Text>
                </div>
              </Col>
              <Col span={10}>
                <div className="station-info">
                  <Space direction="vertical" size={2}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Từ:</Text>
                    <Text strong>
                      {getStationDisplayName(editingSegment.startStation)}
                    </Text>
                  </Space>
                </div>
              </Col>
                             <Col span={2} style={{ textAlign: 'center' }}>
                 <BranchesOutlined style={{ color: '#1890ff', fontSize: '16px' }} />
               </Col>
              <Col span={10}>
                <div className="station-info">
                  <Space direction="vertical" size={2}>
                    <Text type="secondary" style={{ fontSize: '12px' }}>Đến:</Text>
                    <Text strong>
                      {getStationDisplayName(editingSegment.endStation)}
                    </Text>
                  </Space>
                </div>
              </Col>
            </Row>
          </Card>
        )}

        <Form
          form={form}
          layout="vertical"
          className="line-segment-form"
        >
          <Row gutter={24} justify="center">
            <Col span={12}>
              <Form.Item
                name="duration"
                label={
                  <Space>
                    <ClockCircleOutlined />
                    <Text strong>Thời gian di chuyển</Text>
                    <Text type="secondary">(phút)</Text>
                  </Space>
                }
                rules={[
                  { type: 'number', min: 0, message: 'Thời gian không được âm!' }
                ]}
              >
                <InputNumber
                  min={0}
                  step={0.5}
                  style={{ width: '100%' }}
                  placeholder="5.0"
                  addonAfter="phút"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="distance"
                label={
                  <Space>
                    <BranchesOutlined />
                    <Text strong>Khoảng cách</Text>
                    <Text type="secondary">(km)</Text>
                  </Space>
                }
                rules={[
                  { type: 'number', min: 0, message: 'Khoảng cách không được âm!' }
                ]}
              >
                <InputNumber
                  min={0}
                  step={0.1}
                  style={{ width: '100%' }}
                  placeholder="2.5"
                  addonAfter="km"
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default LineSegmentModal; 