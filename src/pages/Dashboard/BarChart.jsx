import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Select } from "antd";
import { Column } from "@ant-design/plots";
import { MdShowChart, MdPeople, MdConfirmationNumber, MdAttachMoney } from "react-icons/md";
import "./BarChart.css";

const { Title } = Typography;
const { Option } = Select;

// Hàm sinh dữ liệu giả
const generateFakeData = (type) => {
  const data = [];
  const max = 1000;

  if (type === "day") {
    for (let i = 1; i <= 10; i++) {
      const label = `6/${i}`;
      data.push({
        date: label,
        value: Math.floor(Math.random() * max),
        type: "value",
      });
      data.push({
        date: label,
        value: Math.floor(Math.random() * max),
        type: "count",
      });
    }
  } else if (type === "month") {
    const months = ["01", "02", "03", "04", "05", "06"];
    for (let m of months) {
      const label = `2025-${m}`;
      data.push({
        date: label,
        value: Math.floor(Math.random() * max),
        type: "value",
      });
      data.push({
        date: label,
        value: Math.floor(Math.random() * max),
        type: "count",
      });
    }
  } else if (type === "year") {
    for (let y = 2020; y <= 2025; y++) {
      const label = `${y}`;
      data.push({
        date: label,
        value: Math.floor(Math.random() * max),
        type: "value",
      });
      data.push({
        date: label,
        value: Math.floor(Math.random() * max),
        type: "count",
      });
    }
  }

  return data;
};

const chartConfigs = [
  {
    title: "Revenue Analytics",
    icon: <MdAttachMoney />,
    color: "#faad14",
    chartColors: ["#faad14", "#ffd666"]
  },
  {
    title: "Ticket Analytics", 
    icon: <MdConfirmationNumber />,
    color: "#52c41a",
    chartColors: ["#52c41a", "#95de64"]
  },
  {
    title: "Client Analytics",
    icon: <MdPeople />,
    color: "#1890ff", 
    chartColors: ["#1890ff", "#69c0ff"]
  }
];

const BarChart = () => {
  const [range, setRange] = useState("day");
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(generateFakeData(range));
  }, [range]);

  return (
    <div className="dashboard-barchart-container">
      <div className="dashboard-barchart-header">
        <div className="dashboard-barchart-title">
          <MdShowChart className="dashboard-barchart-title-icon" />
          <h2 className="dashboard-barchart-title-text">Analytics Overview</h2>
        </div>
        <Select
          defaultValue="day"
          className="dashboard-barchart-select"
          onChange={setRange}
          value={range}
        >
          <Option value="day">Daily View</Option>
          <Option value="month">Monthly View</Option>
          <Option value="year">Yearly View</Option>
        </Select>
      </div>

      <Row gutter={[24, 24]} className="dashboard-barchart-row">
        {chartConfigs.map((config, index) => {
          const columnConfig = {
            data,
            isGroup: true,
            xField: "date",
            yField: "value",
            seriesField: "type",
            height: 280,
            color: config.chartColors,
            legend: {
              position: "top-right",
            },
            columnStyle: {
              radius: [4, 4, 0, 0],
            },
            tooltip: {
              formatter: (datum) => {
                return {
                  name: datum.type === 'value' ? 'Revenue' : 'Count',
                  value: datum.value.toLocaleString(),
                };
              },
            },
          };

          return (
            <Col xs={24} lg={8} key={index}>
              <Card className="dashboard-barchart-card">
                <div className="dashboard-barchart-card-header">
                  <div className="dashboard-barchart-card-title">
                    <div 
                      className="dashboard-barchart-card-icon" 
                      style={{ color: config.color }}
                    >
                      {config.icon}
                    </div>
                    <Title level={5} className="dashboard-barchart-card-text">
                      {config.title}
                    </Title>
                  </div>
                </div>
                <div className="dashboard-barchart-chart-wrapper">
                  <Column {...columnConfig} />
                </div>
              </Card>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default BarChart;
