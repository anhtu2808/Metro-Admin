import React from "react";
import SideBar from "../../components/SideBar/SideBar";
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import "./AdminPage.css";
import { Outlet } from "react-router-dom";
import { Avatar } from "antd";
import { UserOutlined } from "@ant-design/icons";
const AdminPage = (props) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="admin-container">
      <div className="admin-sidebar">
        <SideBar collapsed={collapsed} />
      </div>
      <div className="admin-content">
        <div className="admin-header">
          <div className="left-side">
            <FaBars onClick={() => setCollapsed(!collapsed)} />
          </div>

          <div className="right-side">
            <Avatar size="default" icon={<UserOutlined />}></Avatar>
            Le Hoang Quy
          </div>
        </div>
        <div className="admin-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
