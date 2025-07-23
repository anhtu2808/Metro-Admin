import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  message,
  Row,
  Col
} from 'antd';
import {
  SaveOutlined,
  CloseOutlined,
  LineOutlined,
  EnvironmentOutlined
} from '@ant-design/icons';
import { createLineAPI, updateLineAPI } from '../../../apis';
import './LineModal.css';

const { Option } = Select;

const LineModal = ({
  visible,
  onCancel,
  onSuccess,
  editingLine = null,
  allStations = [],
  loading = false
}) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (visible && editingLine) {
      // Edit mode - populate form with existing data
      form.setFieldsValue({
        name: editingLine.name || '',
        lineCode: editingLine.lineCode || '',
        description: editingLine.description || '',
        startStationId: editingLine.startStation.id || undefined,
        finalStationId: editingLine.finalStation.id || undefined
      });
    } else if (visible) {
      // Create mode - reset form
      form.resetFields();
    }
  }, [visible, editingLine, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setSubmitting(true);

      // Prepare payload for API
      const payload = {
        name: values.name?.trim(),
        lineCode: values.lineCode?.trim(),
        description: values.description?.trim() || '',
        startStationId: values.startStationId || 0,
        finalStationId: values.finalStationId || 0
      };

      console.log('Line payload:', payload);

      // Call API
      if (editingLine) {
        await updateLineAPI(editingLine.id, payload);
      } else {
        await createLineAPI(payload);
      }

      form.resetFields();
      onSuccess();
    } catch (error) {
      if (error.errorFields) {
        message.error('Vui lòng kiểm tra lại thông tin!');
      } else {
        console.error('Error saving line:', error);
        message.error('Có lỗi xảy ra khi lưu thông tin tuyến tàu!');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  const getStationDisplayName = (station,) => {
    return `${station.code || station.stationCode || 'N/A'} - ${station.name}`;
  };

  const filteredStartStations = allStations.filter(station => {
    const finalStationId = form.getFieldValue('finalStationId');
    return !finalStationId || station.id !== finalStationId;
  });

  const filteredFinalStations = allStations.filter(station => {
    const startStationId = form.getFieldValue('startStationId');
    return !startStationId || station.id !== startStationId;
  });

  return (
    <Modal
      title={
        <div className="line-modal-header">
          <LineOutlined className="line-modal-header-icon" />
          <span>{editingLine ? 'Chỉnh sửa tuyến tàu' : 'Thêm tuyến tàu mới'}</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={
        <div className="line-modal-footer">
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
            {editingLine ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      }
      width={800}
      centered
      destroyOnClose
      className="line-modal"
    >
      <div className="line-modal-content">
      
        

        <Form
          form={form}
          layout="vertical"
          className="line-modal-form"
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Tên tuyến tàu"
                rules={[
                  { required: true, message: 'Vui lòng nhập tên tuyến tàu!' },
                  { min: 2, message: 'Tên tuyến tàu phải có ít nhất 2 ký tự!' }
                ]}
              >
                <Input
                  placeholder="Ví dụ: Metro Line 1"
                  size="large"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="lineCode"
                label="Mã tuyến"
                rules={[
                  { required: true, message: 'Vui lòng nhập mã tuyến!' },
                  { pattern: /^[A-Z0-9]+$/, message: 'Mã tuyến chỉ được chứa chữ cái viết hoa và số!' }
                ]}
              >
                <Input
                  placeholder="Ví dụ: M1, M2"
                  size="large"
                  style={{ textTransform: 'uppercase' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Mô tả"
              >
                <Input.TextArea
                  placeholder="Mô tả chi tiết về tuyến tàu..."
                  rows={3}
                  size="large"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startStationId"
                label="Ga đầu"
                disabled={editingLine}
                rules={[
                  { required: true, message: 'Vui lòng chọn ga đầu!' }
                ]}
              >
                <Select
                  placeholder="Chọn ga đầu"
                  size="large"
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  suffixIcon={<EnvironmentOutlined />}
                >
                  {filteredStartStations.map(station => (
                    <Option key={station.id} value={station.id}>
                      {getStationDisplayName(station)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="finalStationId"
                label="Ga cuối"
                disabled={editingLine}
                rules={[
                  { required: true, message: 'Vui lòng chọn ga cuối!' }
                ]}
              >
                <Select
                  placeholder="Chọn ga cuối"
                  size="large"
                  showSearch
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  suffixIcon={<EnvironmentOutlined />}
                >
                  {filteredFinalStations.map(station => (
                    <Option key={station.id} value={station.id}>
                      {getStationDisplayName(station)}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Modal>
  );
};

export default LineModal; 