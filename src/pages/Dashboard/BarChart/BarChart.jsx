import React from "react";
import { Card, Typography, CircularProgress, Box } from "@mui/material";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";
import { Select } from "antd";
import { MdConfirmationNumber, MdAttachMoney, MdShowChart } from "react-icons/md";
import "./BarChart.css";

const { Option } = Select;

const Barchart = ({ data, revenueStats, loading, periodType, setPeriodType }) => {
  if (!data || !revenueStats || loading) {
    return (
      <div className="metro-dashboard-loading">
        <CircularProgress />
      </div>
    );
  }

  // Chuẩn bị dữ liệu cho pie chart - hiển thị số lượng vé theo loại
  const pieColors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1', '#fa8c16', '#13c2c2'];
  
  const countData = data.ticketTypeStats
    ?.filter(ticket => ticket.ticketCount > 0)
    ?.map((ticket, index) => ({
      id: index,
      value: ticket.ticketCount,
      label: ticket.name,
      color: pieColors[index % pieColors.length],
    })) || [];

  // Chuẩn bị dữ liệu cho bar chart - hiển thị doanh thu theo loại vé
  const revenueData = data.ticketTypeStats
    ?.filter(ticket => ticket.revenue > 0)
    ?.map((ticket) => ({
      category: ticket.name,
      value: ticket.revenue,
    })) || [];

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatYAxisValue = (value) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    } else if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    } else if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}K`;
    }
    return value.toString();
  };

  return (
    <div className="metro-dashboard-charts-container">
      <div className="metro-dashboard-charts-row">
        {/* Doanh thu theo thời gian - LINE CHART */}
        <div className="metro-dashboard-chart-card metro-dashboard-revenue-line">
          <div className="metro-dashboard-card-header">
            <div className="metro-dashboard-card-title">
              <MdShowChart className="metro-dashboard-card-icon metro-dashboard-primary-color" />
              <h3 className="metro-dashboard-card-text">Doanh thu theo thời gian</h3>
            </div>
            <div className="metro-dashboard-period-select">
              <Select
                value={periodType}
                onChange={setPeriodType}
                size="small"
                style={{ width: 80 }}
              >
                <Option value="DAY">Ngày</Option>
                <Option value="MONTH">Tháng</Option>
                <Option value="YEAR">Năm</Option>
              </Select>
            </div>
          </div>
          <div className="metro-dashboard-chart-content">
            <LineChart
              xAxis={[{
                scaleType: "point",
                data: revenueStats.map((item) => item.period),
              }]}
              yAxis={[{
                valueFormatter: (value) => {
                  if (value >= 1000000) {
                    return `${Math.round(value / 1000000)}M`;
                  } else if (value >= 1000) {
                    return `${Math.round(value / 1000)}K`;
                  }
                  return value.toString();
                },
              }]}
              series={[{
                data: revenueStats.map((item) => item.revenue),
                label: "Doanh thu",
                color: "#1890ff",
                valueFormatter: formatCurrency,
              }]}
              height={280}
              margin={{ left: 80, right: 40, top: 20, bottom: 40 }}
            />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="metro-dashboard-charts-bottom-row">
          {/* Số lượng vé - PIE CHART */}
          <div className="metro-dashboard-chart-card metro-dashboard-ticket-pie">
            <div className="metro-dashboard-card-header">
              <div className="metro-dashboard-card-title">
                <MdConfirmationNumber className="metro-dashboard-card-icon metro-dashboard-primary-color" />
                <h3 className="metro-dashboard-card-text">Số lượng vé theo loại</h3>
              </div>
            </div>
            <div className="metro-dashboard-chart-content metro-dashboard-pie-container">
              <PieChart
                series={[{
                  data: countData,
                  highlightScope: { faded: 'global', highlighted: 'item' },
                  faded: { innerRadius: 20, additionalRadius: -20, color: 'gray' },
                  innerRadius: 30,
                  outerRadius: 100,
                }]}
                height={280}
                width={360}
                colors={pieColors}
              />
            </div>
          </div>

          {/* Doanh thu vé - BAR CHART */}
          <div className="metro-dashboard-chart-card metro-dashboard-revenue-bar">
            <div className="metro-dashboard-card-header">
              <div className="metro-dashboard-card-title">
                <MdAttachMoney className="metro-dashboard-card-icon metro-dashboard-primary-color" />
                <h3 className="metro-dashboard-card-text">Doanh thu theo loại vé</h3>
              </div>
            </div>
            <div className="metro-dashboard-chart-content">
              <BarChart
                xAxis={[{
                  scaleType: "band",
                  data: revenueData.map((item) => item.category),
                  categoryGapRatio: 0.3,
                  tickLabelStyle: {
                    angle: -45,
                    textAnchor: 'end',
                  },
                }]}
                yAxis={[{
                  valueFormatter: (value) => {
                    if (value >= 1000000) {
                      return `${Math.round(value / 1000000)}M`;
                    } else if (value >= 1000) {
                      return `${Math.round(value / 1000)}K`;
                    }
                    return value.toString();
                  },
                }]}
                series={[{
                  data: revenueData.map((item) => item.value),
                  label: "Doanh thu",
                  color: "#1890ff",
                  valueFormatter: formatCurrency,
                }]}
                                              height={280}
                margin={{ left: 80, right: 20, top: 20, bottom: 80 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Barchart;
