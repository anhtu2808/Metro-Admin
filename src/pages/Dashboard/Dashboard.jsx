import {
  Card,
  Row,
  Col,
  DatePicker,
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
import { useEffect, useState } from "react";
import { setLayoutData } from "../../redux/layoutSlice";
import { getDashboardAPI, getRevenueStatisticsAPI } from "../../apis";
import dayjs from "dayjs";
import Barchart from "./BarChart/BarChart";
import "./Dashboard.css";

const { RangePicker } = DatePicker;

const Dashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [revenueStats, setRevenueStats] = useState([]);
  const [periodType, setPeriodType] = useState("DAY");
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
    // Initial data fetch
    if (dateRange && dateRange.length === 2) {
      fetchDashboardData();
    }
  }, []);

  // Debounced fetch data effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (dateRange && dateRange.length === 2) {
        fetchDashboardData();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [dateRange, periodType]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(value);

  const fetchDashboardData = async () => {
    if (!dateRange || dateRange.length !== 2) {
      message.warning("Vui lòng chọn khoảng thời gian");
      return;
    }

    try {
      setLoading(true);
      const [from, to] = dateRange;
      const dashboardRes = await getDashboardAPI(
        from.startOf("day").toISOString(),
        to.endOf("day").toISOString()
      );
      const revenueRes = await getRevenueStatisticsAPI(
        from.startOf("day").toISOString(),
        to.endOf("day").toISOString(),
        periodType
      );

      if (dashboardRes.code === 200) {
        const result = dashboardRes.result;

        setStats([
          {
            label: "Tổng số người dùng",
            value: result.totalUsers,
            icon: <MdPeople />,
            color: "#333333",
          },
          {
            label: "Tổng số vé",
            value: result.totalOrders,
            icon: <MdConfirmationNumber />,
            color: "#52c41a",
          },
          {
            label: "Tổng Doanh thu",
            value: formatCurrency(result.totalRevenue),
            icon: <MdAttachMoney />,
            color: "#faad14",
          },
        ]);

        setChartData(result);
      } else {
        message.error(dashboardRes.message || "Không lấy được dữ liệu");
      }

      if (revenueRes.code === 200) {
        setRevenueStats(revenueRes.result);
      } else {
        message.error(revenueRes.message || "Không lấy được dữ liệu thống kê doanh thu");
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      message.error("Lỗi khi lấy dữ liệu dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-main-container">
      {/* Header */}
      <div className="dashboard-page-header">
        <RangePicker
          value={dateRange}
          onChange={setDateRange}
          placeholder={["Từ ngày", "Đến ngày"]}
        />
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
                          fontSize: "20px",
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
          <Barchart 
            data={chartData} 
            revenueStats={revenueStats} 
            loading={loading}
            periodType={periodType}
            setPeriodType={setPeriodType}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
