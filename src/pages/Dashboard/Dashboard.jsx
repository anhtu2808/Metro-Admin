import {
  Card,
  Row,
  Col,
  DatePicker,
  Button,
  message,
  Statistic,
  Skeleton,
} from "antd";
import {
  MdOutlineAnalytics,
  MdPeople,
  MdConfirmationNumber,
  MdAttachMoney,
} from "react-icons/md";
import { useDispatch } from "react-redux";
import { useEffect, useState, useCallback } from "react";
import { setLayoutData } from "../../redux/layoutSlice";
import { getDashboardAPI } from "../../apis";
import dayjs from "dayjs";
import Barchart from "./BarChart/BarChart";
import "./Dashboard.css";

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [dateRange, setDateRange] = useState([
    dayjs().subtract(30, "day"),
    dayjs(),
  ]);

  useEffect(() => {
    dispatch(
      setLayoutData({
        title: "Bảng điều khiển",
        icon: <MdOutlineAnalytics />,
      })
    );
    fetchDashboardData();
  }, []);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);

  const fetchDashboardData = useCallback(async () => {
    if (!dateRange || dateRange.length !== 2) {
      message.warning("Vui lòng chọn khoảng thời gian");
      return;
    }

    try {
      setLoading(true);
      const [from, to] = dateRange;
      const res = await getDashboardAPI(
        from.startOf("day").toISOString(),
        to.endOf("day").toISOString()
      );

      if (res.code === 200) {
        const result = res.result;

        setStats([
          {
            label: "Số lượng người dùng",
            value: result.totalUsers,
            icon: <MdPeople />,
            color: "#1890ff",
          },
          {
            label: "Số lượng vé",
            value: result.totalOrders,
            icon: <MdConfirmationNumber />,
            color: "#52c41a",
          },
          {
            label: "Doanh thu",
            value: formatCurrency(result.totalRevenue),
            icon: <MdAttachMoney />,
            color: "#faad14",
          },
        ]);

        setChartData(result);
      } else {
        message.error(res.message || "Không lấy được dữ liệu");
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      message.error("Lỗi khi lấy dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  return (
    <div className="dashboard-main-container">
      {/* Header */}
      <div className="dashboard-page-header">
        <RangePicker
          value={dateRange}
          onChange={setDateRange}
          style={{ marginRight: 8 }}
        />
        <Button type="primary" onClick={fetchDashboardData} loading={loading}>
          Lấy dữ liệu
        </Button>
      </div>

      {/* Stats */}
      <Row gutter={[24, 24]} className="dashboard-stats-row">
        {stats.map(({ label, value, icon, color }) => (
          <Col xs={24} sm={12} lg={8} key={label}>
            <Card className="dashboard-stat-card">
              <div className="dashboard-stat-content">
                <div className="dashboard-stat-icon" style={{ color }}>
                  {icon}
                </div>
                <div className="dashboard-stat-info">
                  <div className="dashboard-stat-label">{label}</div>
                  <div className="dashboard-stat-value">
                    <Statistic
                      value={value}
                      valueStyle={{
                        fontSize: "28px",
                        fontWeight: "600",
                        color: "#1a1a1a",
                      }}
                    />
                  </div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      <div className="dashboard-charts-section">
        {loading ? (
          <Skeleton active />
        ) : (
          <Barchart data={chartData} loading={loading} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
