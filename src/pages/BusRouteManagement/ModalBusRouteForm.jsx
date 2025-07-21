import { Form, Input, Select, Modal, InputNumber } from "antd";
import { useEffect, useState } from "react";

const { Option } = Select;

const ModalBusRouteForm = ({
  isModalOpen,
  setIsModalOpen,
  stations,
  onCreated,
  onUpdated,
  editingRoute,
}) => {
  const [form] = Form.useForm();
  const [confirmLoading, setConfirmLoading] = useState(false);
  const isEditMode = Boolean(editingRoute);

  const handleOk = async () => {
    setConfirmLoading(true);

    try {
      const values = await form.validateFields();

      const selectedStation = stations.find(
        (s) => s.value === values.metroStationId
      );

      if (!selectedStation) {
        Modal.error({
          title: "Lỗi",
          content: "Không tìm thấy ga Metro đã chọn.",
        });
        return;
      }

      const payload = {
        id: editingRoute?.id,
        stationId: values.metroStationId,
        busStationName: selectedStation.label,
        busCode: values.busRouteCode.trim(),
        startLocation: values.startLocation.trim(),
        endLocation: values.endLocation.trim(),
        headwayMinutes: values.headwayMinutes,
        distanceToStation: values.distanceToMetro,
      };

      if (isEditMode) {
        await onUpdated(payload);
      } else {
        await onCreated(payload);
      }

      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Lỗi xử lý form:", error);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  useEffect(() => {
    if (editingRoute) {
      form.setFieldsValue({
        metroStationId: editingRoute.stationId,
        busRouteCode: editingRoute.busCode,
        startLocation: editingRoute.startLocation,
        endLocation: editingRoute.endLocation,
        headwayMinutes: editingRoute.headwayMinutes,
        distanceToMetro: editingRoute.distanceToStation,
      });
    } else {
      form.resetFields();
    }
  }, [editingRoute, form]);

  return (
    <Modal
      title={
        isEditMode
          ? "Cập nhật tuyến xe buýt"
          : "Tạo tuyến xe buýt kết nối Metro"
      }
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      maskClosable={false}
      confirmLoading={confirmLoading}
    >
      <Form
        layout="vertical"
        form={form}
        name="formCreateBusRoute"
        style={{ maxWidth: 600 }}
        scrollToFirstError
      >
        <Form.Item
          name="metroStationId"
          label="Ga Metro kết nối"
          rules={[{ required: true, message: "Vui lòng chọn ga Metro!" }]}
        >
          <Select placeholder="Chọn một ga">
            {stations.map((station) => (
              <Option key={station.value} value={station.value}>
                {station.label}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="busRouteCode"
          label="Mã tuyến xe buýt"
          rules={[{ required: true, message: "Vui lòng nhập mã tuyến!" }]}
        >
          <Input maxLength={50} placeholder="VD: B22, B35, ..." />
        </Form.Item>

        <Form.Item
          name="startLocation"
          label="Điểm bắt đầu"
          rules={[{ required: true, message: "Vui lòng nhập điểm bắt đầu!" }]}
        >
          <Input placeholder="Nhập địa điểm bắt đầu" />
        </Form.Item>

        <Form.Item
          name="endLocation"
          label="Điểm kết thúc"
          rules={[{ required: true, message: "Vui lòng nhập điểm kết thúc!" }]}
        >
          <Input placeholder="Nhập địa điểm kết thúc" />
        </Form.Item>

        <Form.Item
          name="headwayMinutes"
          label="Tần suất chạy (phút)"
          rules={[{ required: true, message: "Vui lòng nhập tần suất chạy!" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          name="distanceToMetro"
          label="Khoảng cách đến ga Metro (km)"
          rules={[{ required: true, message: "Vui lòng nhập khoảng cách!" }]}
        >
          <InputNumber min={0} step={0.1} style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalBusRouteForm;
