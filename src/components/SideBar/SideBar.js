import "react-pro-sidebar/dist/css/styles.css";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
} from "react-pro-sidebar";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaTrain, FaBus, FaTicketAlt } from "react-icons/fa";
import { MdOutlineAnalytics } from "react-icons/md";
import { FaTrainSubway } from "react-icons/fa6";

const SideBar = ({ image, collapsed, toggled, handleToggleSidebar }) => {
  const navigate = useNavigate();
  return (
    <>
      <ProSidebar
        // image={sidebarBg}
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
            }}
          >
            <FaTrainSubway size={"2em"} color={"00bfff"} />
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
          </Menu>
          <Menu iconShape="circle"></Menu>
        </SidebarContent>
      </ProSidebar>
    </>
  );
};

export default SideBar;
