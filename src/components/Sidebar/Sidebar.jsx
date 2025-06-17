import "react-pro-sidebar/dist/css/styles.css";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SidebarHeader,
  SidebarContent,
} from "react-pro-sidebar";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaTrain, FaBus, FaTicketAlt, FaLock, FaSubway } from "react-icons/fa";
import { MdOutlineAnalytics } from "react-icons/md";
import { BiSolidNews } from "react-icons/bi";
import { DollarOutlined } from "@ant-design/icons";
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
      <button className="sidebar-toggle-button" onClick={() => handleToggleSidebar()}>
        {collapsed ? ">>" : "<<" }
      </button>

      <SidebarContent>
        <Menu iconShape="circle">
          <MenuItem icon={<MdOutlineAnalytics />} className="pro-menu-item">
            Dashboard
            <Link to={"/"} />
          </MenuItem>
          <MenuItem icon={<FaUser />} className="pro-menu-item">
            User
            <Link to={"/manage-users"} />
          </MenuItem>
          <MenuItem icon={<FaTrain />} className="pro-menu-item">
            Metro Line
            <Link to={"/metro-line"} />
          </MenuItem>
          {usePermission("station:manage") && <MenuItem icon={<FaSubway />} className="pro-menu-item">
            Station
            <Link to={"/stations"} />
          </MenuItem>}
          <MenuItem icon={<FaBus />} className="pro-menu-item">
            Bus Route
            <Link to={"/bus-routes"} />
          </MenuItem>
          <MenuItem icon={<FaTicketAlt />} className="pro-menu-item">
            Ticket Price
            <Link to={"/ticket-price"} />
          </MenuItem>
          <MenuItem icon={<FaLock />} className="pro-menu-item">
            Role Management
            <Link to={"/role-management"} />
          </MenuItem>
          <MenuItem icon={<BiSolidNews />} className="pro-menu-item">
            News
            <Link to={"/staff/news"} />
          </MenuItem>
          <MenuItem icon={<DollarOutlined />} className="pro-menu-item">
            Fare Adjustment
            <Link to={"/staff/fare-adjustment"} />
          </MenuItem>
        </Menu>
      </SidebarContent>
    </ProSidebar>
  );
};

export default Sidebar;
