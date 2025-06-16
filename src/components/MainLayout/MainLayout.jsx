import React from "react";
import Sidebar from "../Sidebar/Sidebar";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import "./MainLayout.css";
import { Outlet } from "react-router-dom";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
import PerfectScrollbar from "react-perfect-scrollbar";

const MainLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <Sidebar collapsed={collapsed} />
      </div>
      <div className="admin-content">
        <div className="admin-header">
          <div className="left-side">
            <FaBars onClick={() => setCollapsed(!collapsed)} />
          </div>

          <div className="right-side">
            <Avatar size="default" icon={<UserOutlined />}></Avatar>
            <span className="admin-header-title">Admin</span>
          </div>
        </div>
        <PerfectScrollbar>
          <div className="admin-main-scrollable">
            <Outlet />
          </div>
        </PerfectScrollbar>
      </div>
    </div>
  );
};

export default MainLayout;
