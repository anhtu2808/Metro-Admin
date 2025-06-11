import React, { useState, useEffect } from "react";
import { Card, Row, Col, Typography, Select } from "antd";
import { Column } from "@ant-design/plots";
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

const BarChart = () => {
  const [range, setRange] = useState("day");
  const [data, setData] = useState([]);

  useEffect(() => {
    setData(generateFakeData(range));
  }, [range]);

  const columnConfig = {
    data,
    isGroup: true,
    xField: "date",
    yField: "value",
    seriesField: "type",
    height: 300,
    color: ["#1890ff", "#13c2c2"],
    legend: {
      position: "top-right",
    },
  };

  return (
    <div className="barchart-container">
      <div className="barchart-header">
        <Row justify="space-between" align="middle">
          <Col>
            <Select
              defaultValue="day"
              style={{ width: 130 }}
              onChange={setRange}
              value={range}
            >
              <Option value="day">Theo ngày</Option>
              <Option value="month">Theo tháng</Option>
              <Option value="year">Theo năm</Option>
            </Select>
          </Col>
        </Row>
      </div>
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <Title level={5}>Revenue</Title>
          <Card>
            <Column {...columnConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Title level={5}>Number of tickets</Title>
          <Card>
            <Column {...columnConfig} />
          </Card>
        </Col>
        <Col span={12}>
          <Title level={5}>Number of clients</Title>
          <Card>
            <Column {...columnConfig} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BarChart;
