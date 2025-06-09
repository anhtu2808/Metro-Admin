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
import { FaTrainSubway } from "react-icons/fa6";
import { BiSolidNews } from "react-icons/bi";
import { DollarOutlined } from "@ant-design/icons";

const SideBar = ({ collapsed, toggled, handleToggleSidebar }) => {
  const navigate = useNavigate();

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
          <FaTrainSubway size={"2em"} color={"#00bfff"} />
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
        </Menu>
      </SidebarContent>
    </ProSidebar>
  );
};

export default SideBar;
