import "react-pro-sidebar/dist/css/styles.css";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarContent,
} from "react-pro-sidebar";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaTrain, FaBus, FaTicketAlt, FaLock } from "react-icons/fa";
import { MdOutlineAnalytics } from "react-icons/md";
import { BiSolidNews } from "react-icons/bi";
import { DollarOutlined, LogoutOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuthorized, resetUser } from "../../redux/userSlice";
import { Button, message } from "antd";
import "./Sidebar.css";

const Sidebar = ({ collapsed, toggled, handleToggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthorized = useSelector((state) => state.user.isAuthorized);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    dispatch(resetUser());
    dispatch(setIsAuthorized(false));
    message.success("Đã đăng xuất");
    navigate("/login");
  };

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
            Metro Route
            <Link to={"/metro-routes"} />
          </MenuItem>
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

          {/* ✅ STAFF SECTION */}
          <SubMenu title="Staff" icon={<FaUser />} className="pro-menu-item">
            <MenuItem icon={<BiSolidNews />} className="pro-menu-item">
              News
              <Link to={"/staff/news"} />
            </MenuItem>
            <MenuItem icon={<DollarOutlined />} className="pro-menu-item">
              Fare Adjustment
              <Link to={"/staff/fare-adjustment"} />
            </MenuItem>
          </SubMenu>
          {isAuthorized && (
            <MenuItem icon={<LogoutOutlined />} className="pro-menu-item">
              <Button type="primary" danger onClick={handleLogout}>
                Logout
              </Button>
            </MenuItem>
          )}
        </Menu>
      </SidebarContent>
    </ProSidebar>
  );
};

export default Sidebar;
