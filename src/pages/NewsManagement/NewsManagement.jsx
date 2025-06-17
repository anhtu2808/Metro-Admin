import React, { useEffect, useState } from "react";

import { 
   Typography, Spin, Alert, Card, Button, Input, Modal, Form,
  Space, Popconfirm, DatePicker, message, Row, Col, Divider, 
  Empty
} from "antd";
import { 
  ClockCircleOutlined, EditOutlined, DeleteOutlined, PlusOutlined,
  SearchOutlined, ExclamationCircleOutlined, EyeOutlined 
} from "@ant-design/icons";
import { BiSolidNews } from "react-icons/bi";
import moment from "moment";
import "./NewsManagement.css";
import { useDispatch } from "react-redux";
import { setLayoutData } from "../../redux/layoutSlice";

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

// Dữ liệu mẫu
const news = [
  {
    "id": 1,
    "title": "Tuyến Metro số 1 sẽ khai trương vào tháng 12/2023",
    "date": "2023-11-15T08:00:00Z",
    "content": "Tuyến Metro số 1 (Bến Thành - Suối Tiên) dự kiến sẽ chính thức khai trương vào ngày 15/12/2023. Đây là tuyến metro đầu tiên của thành phố, kết nối trung tâm với khu vực phía Đông với tổng chiều dài 19.7km."
  },
  {
    "id": 2,
    "title": "Điều chỉnh giá vé tuyến buýt nhanh BRT từ 01/01/2024",
    "date": "2023-11-20T10:30:00Z",
    "content": "Từ ngày 01/01/2024, giá vé tuyến buýt nhanh BRT sẽ được điều chỉnh tăng 10% nhằm đảm bảo chất lượng dịch vụ và bù đắp chi phí vận hành. Hành khách thường xuyên có thể đăng ký thẻ tháng để được hưởng ưu đãi 20%."
  },
  {
    "id": 3,
    "title": "Mở rộng hệ thống vé điện tử cho toàn bộ mạng lưới giao thông công cộng",
    "date": "2023-11-25T14:15:00Z",
    "content": "Sở Giao thông Vận tải thông báo sẽ triển khai hệ thống vé điện tử thống nhất cho toàn bộ mạng lưới giao thông công cộng từ quý 2/2024. Hệ thống mới sẽ hỗ trợ thanh toán qua thẻ thông minh, ứng dụng di động và mã QR, giúp hành khách dễ dàng chuyển tuyến."
  },
  {
    "id": 4,
    "title": "Tuyển dụng nhân viên vận hành cho tuyến Metro số 2",
    "date": "2023-12-01T09:45:00Z",
    "content": "Ban Quản lý Đường sắt Đô thị thông báo tuyển dụng 150 nhân viên vận hành cho tuyến Metro số 2 (Bến Thành - Tham Lương). Ứng viên sẽ được đào tạo chuyên sâu tại Nhật Bản trong thời gian 6 tháng. Hạn nộp hồ sơ: 31/12/2023."
  },
  {
    "id": 5,
    "title": "Thí điểm xe buýt điện trên 3 tuyến nội đô",
    "date": "2023-12-05T11:20:00Z",
    "content": "Từ 15/12/2023, thành phố sẽ thí điểm đưa vào hoạt động 30 xe buýt điện trên 3 tuyến nội đô. Dự án nhằm giảm khí thải và tiếng ồn, hướng tới mục tiêu phát triển giao thông xanh. Các xe buýt điện được trang bị WiFi miễn phí và cổng sạc USB cho hành khách."
  }
];

const NewsManagement = () => {
  const dispatch = useDispatch();
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentNews, setCurrentNews] = useState(null);
  const [form] = Form.useForm();
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [viewingNews, setViewingNews] = useState(null);

  // Set title và icon cho trang
  useEffect(() => {
    dispatch(
      setLayoutData({
        title: "Quản lý tin tức",
        icon: <BiSolidNews />,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // const response = await axios.get("/news");
        // setNewsList(response.data);
        setNewsList(news);
      } catch (err) {
        setError("Không thể tải dữ liệu tin tức.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const filteredNews = newsList.filter(item =>
    item.title.toLowerCase().includes(searchText.toLowerCase()) ||
    item.content.toLowerCase().includes(searchText.toLowerCase())
  );

  const showAddModal = () => {
    setCurrentNews(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditModal = (news) => {
    setCurrentNews(news);
    form.setFieldsValue({
      title: news.title,
      content: news.content,
      date: moment(news.date)
    });
    setIsModalVisible(true);
  };

  const showViewModal = (news) => {
    setViewingNews(news);
    setViewModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setViewModalVisible(false);
  };

  const handleSubmit = (values) => {
    if (currentNews) {
      // Cập nhật tin tức
      const updatedNews = newsList.map(item => 
        item.id === currentNews.id ? 
        { ...item, ...values, date: values.date.toISOString() } : 
        item
      );
      setNewsList(updatedNews);
      message.success("Cập nhật tin tức thành công!");
    } else {
      // Thêm tin tức mới
      const newId = Math.max(...newsList.map(item => item.id)) + 1;
      const newItem = {
        id: newId,
        ...values,
        date: values.date.toISOString()
      };
      setNewsList([...newsList, newItem]);
      message.success("Thêm tin tức thành công!");
    }
    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    const updatedNews = newsList.filter(item => item.id !== id);
    setNewsList(updatedNews);
    message.success("Xóa tin tức thành công!");
  };

  return (
    <div className="news-container">
      <Card className="news-header-card">
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Input 
                placeholder="Tìm kiếm tin tức..." 
                prefix={<SearchOutlined />} 
                value={searchText}
                onChange={e => setSearchText(e.target.value)}
                className="search-input"
              />
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={showAddModal}
              >
                Thêm tin tức
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {loading ? (
        <div className="loading-container">
          <Spin size="large" />
        </div>
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <div className="news-list">
          {filteredNews.length === 0 ? (
            <Empty description="Không tìm thấy tin tức" />
          ) : (
            filteredNews.map(item => (
              <Card 
                key={item.id} 
                className="news-card"
                actions={[
                  <Button icon={<EyeOutlined />} onClick={() => showViewModal(item)}>Xem</Button>,
                  <Button icon={<EditOutlined />} onClick={() => showEditModal(item)}>Sửa</Button>,
                  <Popconfirm
                    title="Bạn có chắc chắn muốn xóa tin tức này?"
                    onConfirm={() => handleDelete(item.id)}
                    okText="Có"
                    cancelText="Không"
                    icon={<ExclamationCircleOutlined style={{ color: 'red' }} />}
                  >
                    <Button danger icon={<DeleteOutlined />}>Xóa</Button>
                  </Popconfirm>
                ]}
              >
                <div className="news-card-content">
                  <Title level={4}>{item.title}</Title>
                  <Text type="secondary" className="news-date">
                    <ClockCircleOutlined /> {new Date(item.date).toLocaleString()}
                  </Text>
                  <Paragraph ellipsis={{ rows: 2 }} className="news-excerpt">
                    {item.content}
                  </Paragraph>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Modal thêm/sửa tin tức */}
      <Modal
        title={currentNews ? "Chỉnh sửa tin tức" : "Thêm tin tức mới"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            date: moment(),
          }}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề!' }]}
          >
            <Input placeholder="Nhập tiêu đề tin tức" />
          </Form.Item>

          <Form.Item
            name="date"
            label="Ngày đăng"
            rules={[{ required: true, message: 'Vui lòng chọn ngày đăng!' }]}
          >
            <DatePicker 
              showTime 
              format="DD/MM/YYYY HH:mm:ss" 
              style={{ width: '100%' }} 
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung!' }]}
          >
            <TextArea rows={6} placeholder="Nhập nội dung tin tức" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {currentNews ? "Cập nhật" : "Thêm mới"}
              </Button>
              <Button onClick={handleCancel}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal xem chi tiết tin tức */}
      <Modal
        title="Chi tiết tin tức"
        open={viewModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Đóng
          </Button>
        ]}
        width={700}
      >
        {viewingNews && (
          <div className="news-detail">
            <Title level={3}>{viewingNews.title}</Title>
            <Text type="secondary" className="news-date-detail">
              <ClockCircleOutlined /> {new Date(viewingNews.date).toLocaleString()}
            </Text>
            <Divider />
            <Paragraph className="news-content-detail">
              {viewingNews.content}
            </Paragraph>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default NewsManagement;