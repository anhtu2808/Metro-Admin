import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "../../components/SideBar/SideBar";
import "./StaffPage.css";

const StaffPage = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="staff-layout">
      <SideBar
        collapsed={collapsed}
        toggled={!collapsed}
        handleToggleSidebar={() => setCollapsed(!collapsed)}
      />
      <div className="staff-content">
        <header className="staff-header">
          <h1>Metro Staff Portal</h1>
        </header>
        <main className="staff-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StaffPage;
