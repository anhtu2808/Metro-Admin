import { Form, Input, Select, Modal, InputNumber, Row, Col } from "antd";
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
      console.log(values);


      const payload = {
        id: editingRoute?.id,
        stationId: values.stationId,
        busStationName: values.busStationName,
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
        stationId: editingRoute.station.id,
        busRouteCode: editingRoute.busCode,
        busStationName: editingRoute.busStationName,
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
        style={{ maxWidth: 900 }}
        scrollToFirstError
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="busStationName"
              label="Tên trạm xe buýt"
              rules={[{ required: true, message: "Vui lòng nhập tên trạm xe buýt!" }]}
            >
              <Input placeholder="Nhập tên trạm xe buýt" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="busRouteCode"
              label="Mã tuyến xe buýt"
              rules={[{ required: true, message: "Vui lòng nhập mã tuyến xe buýt!" }]}
            >
              <Input maxLength={50} placeholder="VD: B22, B35..." />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="stationId"
              label="Ga Metro kết nối"
              rules={[{ required: true, message: "Vui lòng chọn ga Metro!" }]}
            >
              <Select placeholder="Chọn ga Metro">
                {stations.map((station) => (
                  <Option key={station.id} value={station.id}>
                    {station.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="distanceToMetro"
              label="Khoảng cách tới ga Metro (km)"
              rules={[{ required: true, message: "Vui lòng nhập khoảng cách!" }]}
            >
              <InputNumber
                min={0}
                step={0.1}
                style={{ width: '100%' }}
                placeholder="Nhập khoảng cách km"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="startLocation"
              label="Điểm bắt đầu"
              rules={[{ required: true, message: "Vui lòng nhập điểm bắt đầu!" }]}
            >
              <Input placeholder="Nhập điểm bắt đầu" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="endLocation"
              label="Điểm kết thúc"
              rules={[{ required: true, message: "Vui lòng nhập điểm kết thúc!" }]}
            >
              <Input placeholder="Nhập điểm kết thúc" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="headwayMinutes"
              label="Tần suất chạy (phút)"
              rules={[{ required: true, message: "Vui lòng nhập tần suất chạy!" }]}
            >
              <InputNumber
                min={1}
                style={{ width: '100%' }}
                placeholder="Nhập số phút"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>


    </Modal>
  );
};

export default ModalBusRouteForm;
