import { Col, Divider, Form, Input, message, Modal, Row } from "antd";
import "./BusRouteManagement.css";
import TableBus from "./TableBus";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLayoutData } from "../../redux/layoutSlice";
import { FaBus, FaSearch } from "react-icons/fa";
import ModalBusRouteForm from "./ModalBusRouteForm";
import {
  getAllBusRoutesAPI,
  createBusRoutesAPI,
  getAllStationsAPI,
  deleteBusRoutesAPI,
  updateBusRoutesAPI,
} from "../../apis";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";

const BusRouteManagement = () => {
  const dispatch = useDispatch();
  const [showModalBusRouteForm, setShowModalBusRouteForm] = useState(false);
  const [busRoutes, setBusRoutes] = useState([]);
  const [filteredBusRoutes, setFilteredBusRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stations, setStations] = useState([]);
  const [editingRoute, setEditingRoute] = useState(null);
  const [form] = Form.useForm();

  const closeModal = () => {
    setShowModalBusRouteForm(false);
    setEditingRoute(null);
    form.resetFields();
  };

  const loadBusRoutes = async () => {
    try {
      setLoading(true);

      const [routesRes, stationsRes] = await Promise.all([
        getAllBusRoutesAPI(),
        getAllStationsAPI(),
      ]);

      const rawRoutes = routesRes.result?.data || routesRes.data || [];
      const stationList = stationsRes.result?.data || stationsRes.data || [];

      const formattedStations = stationList.map((station) => ({
        value: station.id,
        label: station.name,
      }));
      setStations(formattedStations);

      const normalize = (str) =>
        (str || "")
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .trim()
          .toLowerCase();

      const transformed = rawRoutes.map((route) => {
        const matchedStation = formattedStations.find(
          (s) => normalize(s.label) === normalize(route.busStationName)
        );

        return {
          id: route.id,
          stationId: matchedStation?.value ?? null,
          busCode: route.busCode,
          busStationName: route.busStationName,
          startLocation: route.startLocation,
          endLocation: route.endLocation,
          headwayMinutes: route.headwayMinutes,
          distanceToStation: route.distanceToStation,
          createdAt: route.createAt
            ? new Date(route.createAt).toLocaleDateString("vi-VN")
            : new Date().toLocaleDateString("vi-VN"),
          updatedAt: route.updateAt
            ? new Date(route.updateAt).toLocaleDateString("vi-VN")
            : new Date().toLocaleDateString("vi-VN"),
        };
      });

      setBusRoutes(transformed);
      setFilteredBusRoutes(transformed);
    } catch (error) {
      message.error("Không thể tải dữ liệu tuyến bus hoặc ga metro");
    } finally {
      setLoading(false);
    }
  };

  const extractApiError = (err) => {
    const result = err?.response?.data?.result;
    if (!result) return "Đã xảy ra lỗi.";

    return (
      result.distanceToStation ||
      result.endLocation ||
      result.startLocation ||
      result.busCode ||
      result.headwayMinutes ||
      result.message ||
      "Đã xảy ra lỗi."
    );
  };

  const handleCreate = async (newRoute) => {
    try {
      await createBusRoutesAPI(newRoute);
      await loadBusRoutes();
      message.success("Tạo tuyến xe buýt mới thành công");
    } catch (err) {
      message.error(extractApiError(err));
    }
  };

  const handleUpdate = async (updatedRoute) => {
    try {
      await updateBusRoutesAPI(updatedRoute.id, updatedRoute);
      await loadBusRoutes();
      message.success("Cập nhật tuyến xe buýt thành công");
      closeModal();
    } catch (err) {
      message.error(extractApiError(err));
    }
  };

  const handleSearch = () => {
    const query = form.getFieldValue("query")?.toLowerCase().trim();
    if (!query) {
      setFilteredBusRoutes(busRoutes);
      return;
    }

    const normalize = (text) => (text || "").toLowerCase();
    const filtered = busRoutes.filter((route) =>
      [
        normalize(route.busCode),
        normalize(route.busStationName),
        normalize(route.startLocation),
        normalize(route.endLocation),
      ].some((field) => field.includes(query))
    );

    setFilteredBusRoutes(filtered);
  };

  const handleDelete = async (route) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa tuyến xe buýt này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteBusRoutesAPI(route.id);
          message.success("Đã xóa tuyến xe buýt thành công");
          await loadBusRoutes();
        } catch (error) {
          message.error("Không thể xóa tuyến xe buýt");
        }
      },
    });
  };

  useEffect(() => {
    dispatch(
      setLayoutData({
        title: "Quản lý tuyến bus",
        icon: <FaBus />,
      })
    );
    loadBusRoutes();
  }, [dispatch]);

  return (
    <div className="bus-container">
      <div className="bus-content">
        <div className="bus-routes-search">
          <Row justify="space-between" align="middle" gutter={[16, 16]}>
            <Col xs={24} md={16}>
              <Form
                layout="inline"
                form={form}
                name="searchForm"
                onFinish={handleSearch}
              >
                <Form.Item name="query" style={{ flex: 1 }}>
                  <Input placeholder="Nhập từ khóa tìm kiếm..." />
                </Form.Item>
                <Form.Item>
                  <PrimaryButton
                    type="primary"
                    htmlType="submit"
                    icon={<FaSearch />}
                  >
                    Tìm kiếm
                  </PrimaryButton>
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={8} style={{ textAlign: "right" }}>
              <PrimaryButton
                icon={<FaBus />}
                style={{
                  borderRadius: 8,
                  padding: "8px 16px",
                  fontWeight: 500,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
                }}
                onClick={() => {
                  setEditingRoute(null);
                  setShowModalBusRouteForm(true);
                }}
              >
                Tạo tuyến bus
              </PrimaryButton>
            </Col>
          </Row>
        </div>
        <Divider />
        <div className="table-bus">
          <TableBus
            data={filteredBusRoutes}
            loading={loading}
            onDelete={handleDelete}
            onEdit={(route) => {
              setEditingRoute(route);
              setShowModalBusRouteForm(true);
            }}
          />
        </div>
        <ModalBusRouteForm
          isModalOpen={showModalBusRouteForm}
          setIsModalOpen={(open) => {
            setShowModalBusRouteForm(open);
            if (!open) setEditingRoute(null);
          }}
          stations={stations}
          onCreated={handleCreate}
          onUpdated={handleUpdate}
          editingRoute={editingRoute}
        />
      </div>
    </div>
  );
};

export default BusRouteManagement;
