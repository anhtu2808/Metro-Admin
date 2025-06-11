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
import { FaUser, FaTrain, FaBus, FaTicketAlt } from "react-icons/fa";
import { MdOutlineAnalytics } from "react-icons/md";
import { BiSolidNews } from "react-icons/bi";
import { DollarOutlined, LogoutOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { setIsAuthorized, resetUser } from "../../redux/userSlice";
import { Button, message } from "antd";

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
        <div
          style={{
            padding: "24px",
            textTransform: "uppercase",
            fontWeight: "bold",
            fontSize: 14,
            letterSpacing: "1px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <img
            src="/Metro_logo.png"
            alt="Metro Logo"
            style={{
              width: "2em",
              height: "2em",
              objectFit: "contain",
              display: "block"
            }}
          />
          <span style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
            Metro HCM
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <Menu iconShape="circle">
          <MenuItem icon={<MdOutlineAnalytics />}>
            Dashboard
            <Link to={"/"} />
          </MenuItem>
          <MenuItem icon={<FaUser />}>
            User
            <Link to={"/manage-users"} />
          </MenuItem>
          <MenuItem icon={<FaTrain />}>
            Metro Route
            <Link to={"/metro-routes"} />
          </MenuItem>
          <MenuItem icon={<FaBus />}>
            Bus Route
            <Link to={"/bus-routes"} />
          </MenuItem>
          <MenuItem icon={<FaTicketAlt />}>
            Ticket Price
            <Link to={"/ticket-price"} />
          </MenuItem>

          {/* ✅ STAFF SECTION */}
          <SubMenu title="Staff" icon={<FaUser />}>
            <MenuItem icon={<BiSolidNews />}>
              News
              <Link to={"/staff/news"} />
            </MenuItem>
            <MenuItem icon={<DollarOutlined />}>
              Fare Adjustment
              <Link to={"/staff/fare-adjustment"} />
            </MenuItem>
          </SubMenu>
          {isAuthorized && (
            <MenuItem icon={<LogoutOutlined />}>
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
