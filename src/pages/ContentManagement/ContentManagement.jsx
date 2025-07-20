import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLayoutData } from "../../redux/layoutSlice";
import { BiSolidNews } from "react-icons/bi";
import {
  Tabs,
  Spin,
  message,
  Form,
  Card,
  Row,
  Col,
  Space,
  Input,
  Select,
} from "antd";
import moment from "moment";
import {
  getAllContentAPI,
  updateContentAPI,
  deleteContentAPI,
  createContentAPI,
} from "../../apis";
import { SearchOutlined } from "@ant-design/icons";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import NewsManagement from "./NewsTab/NewsManagement";
import GuidelineMangement from "./GuidelineTab/GuidelineMangement";

const ContentManagemet = () => {
  const dispatch = useDispatch();
  const [contentData, setContentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentContent, setCurrentContent] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [viewingContent, setViewingContent] = useState(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [activeType, setActiveType] = useState("NEWS");
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const userId = useSelector((state) => state.user.id);

  // Set layout icon + title
  useEffect(() => {
    dispatch(
      setLayoutData({
        title: "Quản lý nội dung",
        icon: <BiSolidNews />,
      })
    );
  }, [dispatch]);

  const transformContent = (content, type) =>
    (content || [])
      .filter((item) => item.type === type)
      .map((item) => ({
        id: item.id,
        title: item.title,
        content: item.body,
        summary: item.summary,
        status: item.status,
        date: item.publishAt || new Date().toISOString(),
      }));

  const getFilteredContent = (type) => {
    const transformed = transformContent(contentData, type);
    return transformed.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.content.toLowerCase().includes(searchText.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  };

  const loadContents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getAllContentAPI();
      const data = response.result?.data || response.data || [];
      setContentData(data);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu nội dung:", error);
      message.error("Không thể tải dữ liệu nội dung");
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle form submission for adding or updating content
  const handleSubmit = async (values) => {
    console.log("Form values gửi đi:", values);
    try {
      if (!userId) {
        message.error("Không thể xác định người dùng. Vui lòng đăng nhập lại.");
        return;
      }

      const type = currentContent?.type;
      if (!type) {
        message.error("Không xác định được loại nội dung.");
        return;
      }

      const isEdit = !!currentContent?.id;
      const payload = {
        type,
        title: values.title,
        body: values.content,
        summary: values.title,
        status: isEdit ? currentContent.status : "DRAFT",
        publishAt: values.date?.toISOString() || new Date().toISOString(),
        userId,
        imageUrls: [],
      };

      console.log("Payload gửi lên API:", payload);

      const response = isEdit
        ? await updateContentAPI(currentContent.id, payload)
        : await createContentAPI(payload);

      console.log("Response từ API:", response);

      if (response?.id) {
        message.success(
          `${isEdit ? "Cập nhật" : "Thêm"} ${
            type === "NEWS" ? "tin tức" : "hướng dẫn"
          } thành công!`
        );
        // Cập nhật ngay trên UI
        if (isEdit) {
          setContentData((prev) =>
            prev.map((item) =>
              item.id === currentContent.id ? { ...item, ...payload } : item
            )
          );
        } else {
          setContentData((prev) => [...prev, { id: Date.now(), ...payload }]);
        }
        console.log("Response từ API:", response);
        await loadContents();
        setIsModalVisible(false);
        form.resetFields();
        setCurrentContent(null);
      } else {
        message.error(
          `${isEdit ? "Cập nhật" : "Thêm"} thất bại: ${
            response.message || "Lỗi không xác định"
          }`
        );
      }
    } catch (error) {
      console.error("Lỗi khi gửi dữ liệu:", error);
      message.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  // Handle delete content
  const handleDelete = async (id, type) => {
    try {
      const response = await deleteContentAPI(id);

      if (response?.status === 204) {
        message.success(
          `Xóa ${type === "NEWS" ? "tin tức" : "hướng dẫn"} thành công!`
        );
        setContentData((prev) => prev.filter((item) => item.id !== id));
      } else {
        message.error(
          `Xóa thất bại: ${response?.message || "Lỗi không xác định"}`
        );
      }
    } catch (error) {
      console.error("Lỗi khi xóa nội dung:", error);
      message.error("Đã xảy ra lỗi khi xóa nội dung.");
    }
  };

  const handlePublish = async (item, type) => {
    try {
      const payload = {
        ...item,
        type,
        body: item.content,
        status: "PUBLISHED",
        imageUrls: item.imageUrls || [],
        userId,
      };

      const response = await updateContentAPI(item.id, payload);

      if (response?.code === 200 || response?.code === 201) {
        message.success(
          `Đăng ${type === "NEWS" ? "tin tức" : "hướng dẫn"} thành công!`
        );
        await loadContents();
        return { success: true };
      } else {
        const msg = response.message || "Lỗi không xác định";
        message.error(`Đăng thất bại: ${msg}`);
        return { success: false, message: msg };
      }
    } catch (error) {
      console.error("Lỗi khi đăng:", error);
      message.error("Đã xảy ra lỗi khi đăng nội dung.");
      return { success: false, message: "Lỗi khi gọi API" };
    }
  };

  useEffect(() => {
    loadContents();
  }, [loadContents]);

  const showAddModal = (type) => {
    form.resetFields();
    setCurrentContent({ id: null, type });
    setIsModalVisible(true);
  };

  const showEditModal = (content, type) => {
    form.setFieldsValue({
      title: content.title,
      content: content.content,
      date: moment(content.date),
    });
    setCurrentContent({ ...content, type });
    setIsModalVisible(true);
  };

  const showViewModal = (content, type) => {
    setViewingContent({ ...content, type });
    setViewModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setViewModalVisible(false);
    setCurrentContent(null);
  };

  const handleTabChange = (key) => {
    setActiveTab(key);
    setActiveType(key === "1" ? "NEWS" : "GUIDELINE");
  };

  const tabItems = [
    {
      key: "1",
      label: "Tin tức",
      children: (
        <NewsManagement
          data={getFilteredContent("NEWS")}
          type="NEWS"
          loading={loading}
          handlers={{
            handleSubmit,
            handleDelete,
            handleCancel,
            handlePublish,
            showAddModal: () => showAddModal("NEWS"),
            showEditModal: (item) => showEditModal(item, "NEWS"),
            showViewModal: (item) => showViewModal(item, "NEWS"),
          }}
          modal={{
            isModalVisible,
            setIsModalVisible,
            currentContent,
            setCurrentContent,
            viewModalVisible,
            setViewModalVisible,
            viewingContent,
            form,
            type: "NEWS",
          }}
        />
      ),
    },
    {
      key: "2",
      label: "Hướng dẫn",
      children: (
        <GuidelineMangement
          data={getFilteredContent("GUIDELINE")}
          type="GUIDELINE"
          loading={loading}
          showAdd={() => showAddModal("GUIDELINE")}
          handlers={{
            handleSubmit,
            handleDelete,
            handleCancel,
            handlePublish,
            showEditModal: (item) => showEditModal(item, "GUIDELINE"),
            showViewModal: (item) => showViewModal(item, "GUIDELINE"),
          }}
          modal={{
            isModalVisible,
            setIsModalVisible,
            currentContent,
            setCurrentContent,
            viewModalVisible,
            setViewModalVisible,
            viewingContent,
            form,
            type: "GUIDELINE",
          }}
        />
      ),
    },
  ];

  return (
    <div className="manage-content-container">
      <Card>
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Input
                placeholder="Tìm kiếm nội dung..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="search-input"
              />
              <Select
                placeholder="Lọc theo trạng thái"
                allowClear
                style={{ width: 200 }}
                onChange={(value) => setStatusFilter(value)}
                value={statusFilter}
              >
                <Select.Option value="all">Tất cả</Select.Option>
                <Select.Option value="DRAFT">Bản nháp</Select.Option>
                <Select.Option value="PUBLISHED">Đã đăng</Select.Option>
              </Select>
              <PrimaryButton
                type="primary"
                onClick={() => showAddModal(activeType)}
              >
                Thêm {activeType === "NEWS" ? "tin tức" : "hướng dẫn"}
              </PrimaryButton>
            </Space>
          </Col>
        </Row>
      </Card>
      {loading ? (
        <Spin size="large" style={{ display: "block", marginTop: 50 }} />
      ) : (
        <Tabs
          activeKey={activeTab}
          onChange={handleTabChange}
          items={tabItems}
          style={{ marginTop: "20px" }}
        />
      )}
    </div>
  );
};

export default ContentManagemet;
