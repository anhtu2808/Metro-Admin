import { Card, Row, Col, Statistic } from "antd";
import "./Dashboard.css";
import {
  MdOutlineAnalytics,
  MdPeople,
  MdConfirmationNumber,
  MdAttachMoney
} from "react-icons/md";
import { FiTrendingUp } from "react-icons/fi";
import Barchart from "./BarChart/BarChart";
import { useDispatch } from "react-redux";
import { setLayoutData } from "../../redux/layoutSlice";
import { useEffect } from "react";


const stats = [
  {
    label: "Total Clients",
    value: 1250,
    icon: <MdPeople />,
    color: "#1890ff",
    growth: "+12.5%"
  },
  {
    label: "Total Tickets",
    value: 3420,
    icon: <MdConfirmationNumber />,
    color: "#52c41a",
    growth: "+8.2%"
  },
  {
    label: "Revenue",
    value: 125000,
    icon: <MdAttachMoney />,
    color: "#faad14",
    growth: "+15.3%",
    prefix: "$"
  },
];



const Dashboard = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(setLayoutData({
      title: "Dashboard",
      icon: <MdOutlineAnalytics />,
    }));
  }, [dispatch]);
  return (
    <div className="dashboard-main-container">
      <div className="dashboard-page-header">
      </div>

      <Row gutter={[24, 24]} className="dashboard-stats-row">
        {stats.map((item, idx) => (
          <Col xs={24} sm={12} lg={8} key={idx}>
            <Card className="dashboard-stat-card">
              <div className="dashboard-stat-content">
                <div className="dashboard-stat-icon" style={{ color: item.color }}>
                  {item.icon}
                </div>
                <div className="dashboard-stat-info">
                  <div className="dashboard-stat-label">{item.label}</div>
                  <div className="dashboard-stat-value">
                    <Statistic
                      value={item.value}
                      prefix={item.prefix}
                      valueStyle={{
                        fontSize: '28px',
                        fontWeight: '600',
                        color: '#1a1a1a'
                      }}
                    />
                  </div>
                  <div className="dashboard-stat-growth">
                    <FiTrendingUp className="dashboard-growth-icon" />
                    <span className="dashboard-growth-text">{item.growth}</span>
                    <span className="dashboard-growth-period">vs last month</span>
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="dashboard-charts-section">
        <Barchart />
      </div>
    </div>
  );
};

export default Dashboard;
