import React, { useState, useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Row,
  Col,
  Button,
  Upload,
  Avatar,
  message
} from 'antd';
import {
  EnvironmentOutlined,
  CameraOutlined,
} from '@ant-design/icons';
import { 
  createStationAPI, 
  updateStationAPI,
  uploadStationImageAPI
} from '../../../apis';
import './StationModal.css';
import ButtonPrimary from '../../../components/PrimaryButton/PrimaryButton';

const StationModal = ({
  visible,
  onCancel,
  onSuccess,
  editingStation = null,
  loading: externalLoading = false
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  // Reset form when modal opens/closes or editing station changes
  useEffect(() => {
    if (visible) {
      if (editingStation) {
        form.setFieldsValue({
          name: editingStation.name,
          code: editingStation.code,
          address: editingStation.address,
          latitude: editingStation.latitude,
          longitude: editingStation.longitude,
        });
        setImageUrl(editingStation.imageUrl || '');
      } else {
        form.resetFields();
        setImageUrl('');
      }
    }
  }, [visible, editingStation, form]);

  // Handle image upload
  const handleImageUpload = async (file) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await uploadStationImageAPI(formData);
      
      if (response.code === 200) {
        const newImageUrl = response.result;
        setImageUrl(newImageUrl);
        message.success("Upload ảnh thành công!");
      } else {
        message.error("Upload ảnh thất bại!");
      }
    } catch (error) {
      message.error("Upload ảnh thất bại!");
    } finally {
      setUploadingImage(false);
    }
    
    return false; // Prevent default upload behavior
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      
      // Prepare payload for API
      const payload = {
        name: values.name,
        stationCode: values.code,
        address: values.address,
        latitude: values.latitude.toString(),
        longitude: values.longitude.toString(),
        imageUrl: imageUrl || null
      };
      
      if (editingStation) {
        // Update existing station
        await updateStationAPI(editingStation.id, payload);
        message.success('Cập nhật ga thành công');
      } else {
        // Create new station
        await createStationAPI(payload);
        message.success('Thêm ga mới thành công');
      }
      
      // Reset form and close modal
      form.resetFields();
      setImageUrl('');
      onSuccess?.();
      
    } catch (error) {
      if (error.errorFields) {
        // Form validation errors
        return;
      }
      console.error('Error saving station:', error);
      message.error(editingStation ? 'Cập nhật trạm thất bại' : 'Thêm trạm thất bại');
    } finally {
      setLoading(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    form.resetFields();
    setImageUrl('');
    onCancel?.();
  };

  return (
    <Modal
      title={editingStation ? 'Chỉnh ga trạm' : 'Thêm ga mới'}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      width={800}
      okText={editingStation ? 'Cập nhật' : 'Thêm'}
      cancelText="Hủy"
      confirmLoading={loading || externalLoading}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
      >
        {/* Upload Image Section */}
        <Form.Item label="Hình ảnh trạm">
          <div className="station-image-upload">
            <div className="image-preview">
              <Avatar
                size={120}
                src={imageUrl}
                icon={<EnvironmentOutlined />}
                shape="square"
              />
            </div>
            <div className="upload-controls">
              <Upload
                name="stationImage"
                beforeUpload={handleImageUpload}
                showUploadList={false}
                accept="image/*"
              >
                <ButtonPrimary 
                  icon={<CameraOutlined />} 
                  loading={uploadingImage}
                  type="primary"
                  ghost
                >
                  {uploadingImage ? "Đang upload..." : "Chọn ảnh"}
                </ButtonPrimary>
              </Upload>
              {imageUrl && (
                <Button 
                  onClick={() => setImageUrl('')}
                  danger
                  type="text"
                >
                  Xóa ảnh
                </Button>
              )}
            </div>
          </div>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên trạm"
              rules={[{ required: true, message: 'Vui lòng nhập tên trạm' }]}
            >
              <Input placeholder="Nhập tên trạm" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="code"
              label="Mã trạm"
              rules={[{ required: true, message: 'Vui lòng nhập mã trạm' }]}
            >
              <Input placeholder="VD: ST01" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
        >
          <Input.TextArea rows={2} placeholder="Nhập địa chỉ đầy đủ" />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="latitude"
              label="Vĩ độ (Latitude)"
              rules={[
                { required: true, message: 'Vui lòng nhập vĩ độ' },
                { 
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const num = parseFloat(value);
                    if (isNaN(num) || num < -90 || num > 90) {
                      return Promise.reject(new Error('Vĩ độ phải từ -90 đến 90'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input type="number" step="any" placeholder="10.7720" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="longitude"
              label="Kinh độ (Longitude)"
              rules={[
                { required: true, message: 'Vui lòng nhập kinh độ' },
                { 
                  validator: (_, value) => {
                    if (!value) return Promise.resolve();
                    const num = parseFloat(value);
                    if (isNaN(num) || num < -180 || num > 180) {
                      return Promise.reject(new Error('Kinh độ phải từ -180 đến 180'));
                    }
                    return Promise.resolve();
                  }
                }
              ]}
            >
              <Input type="number" step="any" placeholder="106.6980" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default StationModal; 