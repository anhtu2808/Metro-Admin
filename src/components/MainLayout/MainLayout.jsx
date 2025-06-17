import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import { useState } from "react";
import "./MainLayout.css";
import { Outlet } from "react-router-dom";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import PerfectScrollbar from "react-perfect-scrollbar";
import ProfilePopup from "../ProfilePopup/ProfilePopup";
import { useSelector } from "react-redux";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const user = useSelector((state) => state.user);
  const layout = useSelector((state) => state.layout);
  const handleAvatarClick = () => {
    setShowProfilePopup(!showProfilePopup);
  };

  const handleClosePopup = () => {
    setShowProfilePopup(false);
  };

  const handleToggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <Sidebar collapsed={collapsed} handleToggleSidebar={handleToggleSidebar} />
      </div>
      <div className="admin-content">
        <div className="admin-header">
          <div className="left-side">
            <div className="admin-title">
              <span className="admin-title-icon" style={{ marginRight: "8px" }}>
                {layout.icon}
              </span>
              {layout.title}
            </div>
          </div>

          <div className="right-side">
            <div className="profile-section" onClick={handleAvatarClick}>
              <Avatar
                size="default"
                src={user.avatarUrl}
                icon={<UserOutlined />}
                className="header-avatar"
              />
              <span className="admin-header-title">
                {user.fullName || user.username || "Admin"}
              </span>
            </div>
          </div>
        </div>
        <PerfectScrollbar>
          <div className="admin-main-scrollable">
            <Outlet />
          </div>
        </PerfectScrollbar>
      </div>

      <ProfilePopup
        visible={showProfilePopup}
        onClose={handleClosePopup}
      />
    </div>
  );
};

export default MainLayout;
