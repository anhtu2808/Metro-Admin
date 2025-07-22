import React, { useState, useEffect } from "react";
import { 
  Form, 
  Input, 
  Button, 
  Avatar, 
  Upload, 
  message,
  Row,
  Col,
  Card,
  Typography,
  Divider
} from "antd";
import { 
  UserOutlined, 
  CameraOutlined,
  ArrowLeftOutlined 
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { uploadProfileImageAPI, updateUserAPI } from "../../apis";
import { setUser } from "../../redux/userSlice";
import { setLayoutData } from "../../redux/layoutSlice";
import "./EditProfile.css";

const { Title, Text } = Typography;

const EditProfile = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(user.avatarUrl || "");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageKey, setImageKey] = useState(Date.now()); // Force re-render

  // Set page title and icon
  useEffect(() => {
    dispatch(
      setLayoutData({
        title: "Chỉnh sửa thông tin cá nhân",
        icon: <UserOutlined />,
      })
    );
  }, [dispatch]);

  // Sync imageUrl with user.avatarUrl when user data changes
  useEffect(() => {
    if (user.avatarUrl) {
      setImageUrl(user.avatarUrl);
      setImageKey(Date.now()); // Update key to force re-render
    }
  }, [user.avatarUrl]);

  // Handle image upload
  const handleImageUpload = async (file) => {
    setUploadingImage(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await uploadProfileImageAPI(formData);
      
      if (response.code === 200) {
        const newImageUrl = response.result;
        
        // Chỉ hiển thị ảnh SAU KHI upload thành công
        setImageUrl(newImageUrl);
        setImageKey(Date.now()); // Force re-render
        
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
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const updatePayload = {
        ...values,
        avatarUrl: imageUrl
      };

      const response = await updateUserAPI(user.id, updatePayload);
      
      if (response.code === 200) {
        // Update Redux store
        dispatch(setUser({
          ...user,
          ...updatePayload,
          fullName: `${values.firstName} ${values.lastName}`
        }));
        
        message.success("Cập nhật thông tin thành công!");
        navigate(-1); // Go back to previous page
      } else {
        message.error("Cập nhật thông tin thất bại!");
      }
    } catch (error) {
      message.error("Cập nhật thông tin thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="edit-profile-page">
      <div className="edit-profile-header">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate(-1)}
          className="back-button"
        >
          Quay lại
        </Button>
      </div>

      <Row gutter={24}>
        <Col xs={24} lg={8}>
          {/* Avatar Card */}
          <Card className="avatar-card">
            <div className="avatar-section">
              <Avatar
                size={150}
                src={imageUrl ? `${imageUrl}?cache=${imageKey}` : imageUrl}
                icon={<UserOutlined />}
                className="profile-avatar"
                key={imageKey} // Force re-render when image changes
              />
              <Upload
                name="avatar"
                beforeUpload={handleImageUpload}
                showUploadList={false}
                accept="image/*"
              >
                <Button 
                  style={{ color: "white" }}
                  icon={<CameraOutlined />} 
                  loading={uploadingImage}
                  className="upload-button"
                  type="primary"
                  ghost
                >
                  {uploadingImage ? "Đang upload..." : "Thay đổi ảnh"}
                </Button>
              </Upload>
            </div>
            
            <Divider />
            
            <div className="user-info">
              <Title level={4}>{user.fullName || user.username || "Người dùng"}</Title>
              <Text type="secondary">{user.role || "Admin"}</Text>
              <br />
              <Text type="secondary">{user.email || "Chưa cung cấp"}</Text>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          {/* Form Card */}
          <Card title="Thông tin cá nhân" className="form-card">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                firstName: user.firstName,
                lastName: user.lastName,
                avatarUrl: user.avatarUrl,
                email: user.email,
                phone: user.phone,
                address: user.address
              }}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label="Họ"
                    name="firstName"
                    rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
                  >
                    <Input placeholder="Nhập họ" size="large" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label="Tên"
                    name="lastName"
                    rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
                  >
                    <Input placeholder="Nhập tên" size="large" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" }
                ]}
              >
                <Input placeholder="Nhập email" size="large" />
              </Form.Item>

              <Form.Item
                label="Số điện thoại"
                name="phone"
                rules={[{ required: true, message: "Vui lòng nhập số điện thoại!" }]}
              >
                <Input placeholder="Nhập số điện thoại" size="large" />
              </Form.Item>

              <Form.Item
                label="Địa chỉ"
                name="address"
              >
                <Input.TextArea 
                  placeholder="Nhập địa chỉ" 
                  rows={4}
                  size="large"
                />
              </Form.Item>

              <Form.Item className="form-buttons">
                <Button 
                  onClick={() => navigate("/change-password")} 
                  size="large"
                  style={{ marginRight: 16 }}
                  ghost
                >
                  Đổi mật khẩu
                </Button>
                <Button 
                  onClick={() => navigate(-1)} 
                  size="large"
                  style={{ marginRight: 16 }}
                >
                  Hủy
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  size="large"
                >
                  Lưu thay đổi
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default EditProfile; 