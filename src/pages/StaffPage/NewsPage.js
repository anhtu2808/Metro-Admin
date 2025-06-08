import React, { useEffect, useState } from "react";
import axios from "axios";
import { List, Typography, Spin, Alert } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import { BiSolidNews } from "react-icons/bi"; // 🟦 THÊM ICON NÀY
import "./StaffPage.css";

const { Title, Paragraph, Text } = Typography;

const NewsPage = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get("http://localhost:3001/news");
        setNewsList(response.data);
      } catch (err) {
        setError("Failed to fetch news.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="staff-content">
      <Title level={2} style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <BiSolidNews size={24} color="#1677ff" />
        News
      </Title>

      {loading ? (
        <Spin size="large" />
      ) : error ? (
        <Alert message={error} type="error" />
      ) : (
        <List
          itemLayout="vertical"
          dataSource={newsList}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <Title level={4}>{item.title}</Title>
              <Text type="secondary">
                <ClockCircleOutlined /> {new Date(item.date).toLocaleString()}
              </Text>
              <Paragraph>{item.content}</Paragraph>
            </List.Item>
          )}
        />
      )}
    </div>
  );
};

export default NewsPage;
