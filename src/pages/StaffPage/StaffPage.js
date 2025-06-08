import React, { useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Menu, MenuItem } from "react-pro-sidebar";
import { FaQrcode, FaBell, FaTrain } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import "./StaffPage.css";

const StaffPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <div className="staff-container">
      {/* Sidebar */}
      <div className="staff-sidebar">
        <div className="sidebar-logo">
          <FaTrain className="sidebar-train-icon" />
          <span className="sidebar-title">METRO HCM</span>
        </div>
        <Menu className="menu">
          <MenuItem
            onClick={() => navigate("/staff/news")}
            className={location.pathname.includes("news") ? "ps-menu-button active" : "ps-menu-button"}
          >
            <div className="menu-item-content">
              <FaQrcode className="menu-icon" />
              <span>News</span>
            </div>
          </MenuItem>
          <MenuItem
            onClick={() => navigate("/staff/fare-adjustment")}
            className={location.pathname.includes("fare-adjustment") ? "ps-menu-button active" : "ps-menu-button"}
          >
            <div className="menu-item-content">
              <MdEdit className="menu-icon" />
              <span>Fare Adjustment</span>
            </div>
          </MenuItem>
        </Menu>
      </div>

      {/* Main content */}
      <div className="staff-main">
        {/* Header */}
        <div className="staff-header">
          <div className="header-title">
            {location.pathname.includes("news") && (
              <>
                <FaQrcode />
                <span>News</span>
              </>
            )}
            {location.pathname.includes("fare-adjustment") && (
              <>
                <MdEdit />
                <span>Fare Adjustment</span>
              </>
            )}
          </div>
          <div className="header-icons">
            {/* Notifications */}
            <div className="dropdown-container">
              <button
                className="icon-button"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <FaBell />
              </button>
              {showNotifications && (
                <div className="dropdown-menu">
                  <div className="dropdown-item">🔔 lay thong bao o day </div>
                 
                </div>
              )}
            </div>

            {/* User */}
            <div className="dropdown-container">
              <button
                className="icon-button"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <FiUser />
                <span>staff@gmail.com</span>
              </button>
              {showUserMenu && (
                <div className="dropdown-menu">
                  <div className="dropdown-item">🔐 Đổi mật khẩu</div>
                  <div className="dropdown-item">🚪 Đăng xuất</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="staff-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default StaffPage;
