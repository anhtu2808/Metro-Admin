import "react-pro-sidebar/dist/css/styles.css";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
} from "react-pro-sidebar";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaUserGraduate,
  FaTrain,
  FaBus,
  FaTicketAlt,
  FaLock,
  FaSubway,
  FaCode,
  FaMoneyBillWave,
  
} from "react-icons/fa";
import { MdOutlineAnalytics } from "react-icons/md";
import { BiSolidNews } from "react-icons/bi";
import { QrcodeOutlined, ScanOutlined } from "@ant-design/icons";
import "./Sidebar.css";
import { usePermission } from "../../hooks/usePermission";

const Sidebar = ({ collapsed, toggled, handleToggleSidebar }) => {
  const navigate = useNavigate();

  return (
    <ProSidebar
      collapsed={collapsed}
      toggled={toggled}
      breakPoint="md"
      onToggle={handleToggleSidebar}
    >
      <SidebarHeader>
        <div className="sidebar-header" onClick={() => navigate("/")}>
          <img
            src="/Metro_Logo.png"
            alt="Metro Logo"
            className="sidebar-logo"
          />
        </div>
      </SidebarHeader>

      <button
        className="sidebar-toggle-button"
        onClick={() => handleToggleSidebar()}
      >
        {collapsed ? ">>" : "<<"}
      </button>

      <SidebarContent>
        <Menu iconShape="circle">
          <MenuItem icon={<MdOutlineAnalytics />}>
            Dashboard
            <Link to="/" />
          </MenuItem>
          <MenuItem icon={<FaUser />}>
            User
            <Link to="/manage-users" />
          </MenuItem>
          <MenuItem icon={<FaTrain />}>
            Metro Line
            <Link to="/metro-line" />
          </MenuItem>
          {usePermission("station:manage") && (
            <MenuItem icon={<FaSubway />}>
              Station
              <Link to="/stations" />
            </MenuItem>
          )}
          <MenuItem icon={<FaBus />}>
            Bus Route
            <Link to="/bus-routes" />
          </MenuItem>
          <MenuItem icon={<FaMoneyBillWave />}>
            Price Management
            <Link to="/price-management" />
          </MenuItem>
          <MenuItem icon={<FaTicketAlt />}>
            Ticket Management
            <Link to="/ticket-management" />
          </MenuItem>
          <MenuItem icon={<FaLock />}>
            Role Management
            <Link to="/role-management" />
          </MenuItem>
          <MenuItem icon={<BiSolidNews />}>
            Content
            <Link to="/staff/content" />
          </MenuItem>
          <MenuItem icon={<FaCode />}>
            Developer Tools
            <Link to="/dev" />
          </MenuItem>
          <MenuItem icon={<QrcodeOutlined />}>
            QR Generator
            <Link to="/qr-generator" />
          </MenuItem>
          <MenuItem icon={<ScanOutlined />}>
            Metro Gateway Scanner
            <Link to="/metro-gateway-scanner" />
          </MenuItem>
          <MenuItem icon={<FaUserGraduate />}>
            Student Verification
          <Link to="/student-verification" />
          </MenuItem>
        </Menu>
      </SidebarContent>
    </ProSidebar>
  );
};

export default Sidebar;
