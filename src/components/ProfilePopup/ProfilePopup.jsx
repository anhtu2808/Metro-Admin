import React from "react";
import { Card, Avatar, Typography, Button, Divider } from "antd";
import { UserOutlined, SettingOutlined, LogoutOutlined, EditOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsAuthorized, resetUser } from "../../redux/userSlice";
import { message } from "antd";
import "./ProfilePopup.css";

const { Text, Title } = Typography;

const ProfilePopup = ({ visible, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch(resetUser());
    dispatch(setIsAuthorized(false));
    message.success("Đăng xuất thành công");
    navigate("/login");
    onClose();
  };

  const handleEditProfile = () => {
    navigate("/edit-profile");
    onClose();
  };

  const handleSettings = () => {
    // Navigate to settings page
    message.info("Chức năng cài đặt đang được phát triển");
    onClose();
  };

  if (!visible) return null;

  return (
    <>
      <div className="profile-popup-overlay" onClick={onClose} />
      <Card className="profile-popup-card">
        <div className="profile-popup-header">
          <Avatar 
            size={64} 
            src={user.avatarUrl} 
            icon={<UserOutlined />}
            className="profile-popup-avatar"
          />
          <div className="profile-popup-info">
            <Title level={4} className="profile-popup-name">
              {user.fullName || user.username || "Người dùng"}
            </Title>
            <Text className="profile-popup-role" type="secondary">
              {user.role || "Admin"}
            </Text>
            <Text className="profile-popup-email" type="secondary">
              {user.email || "admin@metro.com"}
            </Text>
          </div>
        </div>

        <Divider className="profile-popup-divider" />

        <div className="profile-popup-actions">
          <Button 
            type="text" 
            icon={<EditOutlined />} 
            className="profile-popup-action-btn"
            onClick={handleEditProfile}
            block
          >
            Chỉnh sửa hồ sơ
          </Button>
          
          <Button 
            type="text" 
            icon={<SettingOutlined />} 
            className="profile-popup-action-btn"
            onClick={handleSettings}
            block
          >
            Cài đặt
          </Button>

          <Divider className="profile-popup-divider" />

          <Button 
            type="text" 
            icon={<LogoutOutlined />} 
            className="profile-popup-logout-btn"
            onClick={handleLogout}
            block
            danger
          >
            Đăng xuất
          </Button>
        </div>
      </Card>
    </>
  );
};

export default ProfilePopup;
