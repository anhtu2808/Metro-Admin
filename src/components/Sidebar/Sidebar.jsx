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
import { Tooltip } from "antd";
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
          <Tooltip placement="right" title={collapsed ? "Dashboard" : ""}>
            <MenuItem icon={<MdOutlineAnalytics />} className="pro-menu-item">
              Dashboard
              <Link to={"/"} />
            </MenuItem>
          </Tooltip>
          <Tooltip placement="right" title={collapsed ? "Người dùng" : ""}>
            <MenuItem icon={<FaUser />} className="pro-menu-item">
              Người dùng
              <Link to={"/manage-users"} />
            </MenuItem>
          </Tooltip>
          <Tooltip placement="right" title={collapsed ? "Tuyến Metro" : ""}>
            <MenuItem icon={<FaTrain />} className="pro-menu-item">
              Tuyến Metro
              <Link to={"/metro-line"} />
            </MenuItem>
          </Tooltip>
          {usePermission("station:manage") && (
            <Tooltip placement="right" title={collapsed ? "Quản lí ga" : ""}>
              <MenuItem icon={<FaSubway />} className="pro-menu-item">
                Ga
                <Link to={"/stations"} />
              </MenuItem>
            </Tooltip>
          )}
          <Tooltip placement="right" title={collapsed ? "Tuyến xe buýt" : ""}>
            <MenuItem icon={<FaBus />} className="pro-menu-item">
              Tuyến xe buýt
              <Link to={"/bus-routes"} />
            </MenuItem>
          </Tooltip>
          <Tooltip placement="right" title={collapsed ? "Quản lý giá" : ""}>
            <MenuItem icon={<FaMoneyBillWave />} className="pro-menu-item">
              Quản lý giá
              <Link to={"/price-management"} />
            </MenuItem>
          </Tooltip>
          <Tooltip placement="right" title={collapsed ? "Quản lý vé" : ""}>
            <MenuItem icon={<FaTicketAlt />} className="pro-menu-item">
              Quản lý vé
              <Link to={"/ticket-management"} />
            </MenuItem>
          </Tooltip>
          
          <Tooltip placement="right" title={collapsed ? "Nội dung" : ""}>
            <MenuItem icon={<BiSolidNews />} className="pro-menu-item">
              Nội dung
              <Link to={"/staff/content"} />
            </MenuItem>
          </Tooltip>
          <Tooltip
            placement="right"
            title={collapsed ? "Metro Gate Scanner" : ""}
          >
            <MenuItem icon={<ScanOutlined />} className="pro-menu-item">
              Metro Gate Scanner
              <Link to={"/metro-gateway-scanner"} />
            </MenuItem>
          </Tooltip>
          <Tooltip placement="right" title={collapsed ? "Developer Tools" : ""}>
            <MenuItem icon={<FaCode />} className="pro-menu-item">
              Developer Tools
              <Link to={"/dev"} />
            </MenuItem>
          </Tooltip>
          <Tooltip placement="right" title={collapsed ? "Quản lý role & permission" : ""}>
            <MenuItem icon={<FaLock />} className="pro-menu-item">
              Quản lý role & permission
              <Link to={"/role-management"} />
            </MenuItem>
          </Tooltip>
          {/* <Tooltip placement="right" title={collapsed ? "Tạo mã QR" : ""}>
            <MenuItem icon={<QrcodeOutlined />} className="pro-menu-item">
              QR Generator
              <Link to={"/qr-generator"} />
            </MenuItem>
          </Tooltip> */}

        </Menu>
      </SidebarContent>
    </ProSidebar>
  );
};

export default Sidebar;
