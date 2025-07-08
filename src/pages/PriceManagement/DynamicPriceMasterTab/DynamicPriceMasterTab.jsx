import React, { useEffect, useState } from 'react';
import {
  Button,
  Space,
  Table,
  Tooltip,
  Typography,
  Modal,
  Form,
  InputNumber,
  Select,
  message,
  Input
} from 'antd';
import {
  CalculatorOutlined,
  DeleteOutlined,
  EditOutlined,
  PlusOutlined
} from '@ant-design/icons';
import {
  getAllDynamicPriceMasterAPI,
  getAllLinesAPI,
  createDynamicPriceMasterAPI,
  updateDynamicPriceMasterAPI,
  deleteDynamicPriceMasterAPI,
  calculateDynamicPriceAPI
} from '../../../apis';
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton';
import Preloader from '../../../components/Preloader/Preloader';

const { Title } = Typography;
const { Option } = Select;

// Format nghìn đồng → "7.000 đồng"
const vnd = (val) =>
  Intl.NumberFormat('vi-VN').format(parseFloat(val) * 1000) + ' đồng';

const DynamicPriceMasterTab = () => {
  const [data, setData] = useState([]);
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(null);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [recordToCalculate, setRecordToCalculate] = useState(null);

  // Load list + master data
  const fetchData = async () => {
    setLoading(true);
    try {
      const masterRes = await getAllDynamicPriceMasterAPI();
      setData(masterRes.result.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      const linesRes = await getAllLinesAPI();
      setLines(linesRes.result.data || []);
      fetchData();
    })();
  }, []);

  // Open modal for edit
  const handleEdit = (record) => {
    form.setFieldsValue(record);
    setEditing(record);
    setModalOpen(true);
  };

  // Delete record
  const handleDelete = async (record) => {
    await deleteDynamicPriceMasterAPI(record.lineId);
    message.success('Đã xoá');
    fetchData();
  };

  // Show confirm modal for recalculate
  const showRecalculateModal = (record) => {
    setRecordToCalculate(record);
    setIsConfirmModalVisible(true);
    setConfirmText('');
  };

  const handleConfirmModalOk = () => {
    if (confirmText.toLowerCase() === 'ok') {
      setIsConfirmModalVisible(false);
      setConfirmText('');
      handleCalculate(recordToCalculate);
      setRecordToCalculate(null);
    } else {
      message.error('Vui lòng gõ chính xác "ok" để xác nhận');
    }
  };

  const handleConfirmModalCancel = () => {
    setIsConfirmModalVisible(false);
    setConfirmText('');
    setRecordToCalculate(null);
  };

  // (stub) recalc
  const handleCalculate = async (record) => {
    setLoading(true);
    try {
       await calculateDynamicPriceAPI(record.lineId);
      message.success('Đã tính lại bảng giá vé lượt cho tuyến ' + lines.find(l => l.id === record.lineId).name);
      fetchData();
    } catch (error) {
      message.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
  };

  // Open for create
  const handleAddNew = () => {
    form.resetFields();
    setEditing(null);
    setModalOpen(true);
  };

  // Submit create/update
  const onSubmit = async () => {
    try {
      const values = form.getFieldsValue();
      if (editing) {
        await updateDynamicPriceMasterAPI(editing.lineId, values);
        message.success('Cập nhật thành công');
      } else {
        await createDynamicPriceMasterAPI(values);
        message.success('Tạo mới thành công');
      }
      setModalOpen(false);
      fetchData();
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Tuyến',
      dataIndex: 'lineId',
      render: (_, r) => lines.find((l) => l.id === r.lineId)?.name ?? '—'
    },
    {
      title: 'Giá khởi điểm',
      dataIndex: 'startPrice',
      render: (v) => vnd(v)
    },
    {
      title: 'Khoảng bắt đầu tính giá (km)',
      dataIndex: 'startRange',
      render: (v) => `${v} km`
    },
    {
      title: 'Giá mỗi km sau khởi điểm',
      dataIndex: 'pricePerKm',
      render: (v) => vnd(v)
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Tooltip title="Cập nhật">
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Tính lại bảng giá vé lượt">
            <Button
              icon={<CalculatorOutlined />}
              onClick={() => showRecalculateModal(record)}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <>
    {loading && <Preloader fullscreen={true} />}
    <div style={{ marginTop: 20, padding: 24 }}>
      <Title level={3} style={{ textAlign: 'center' }}>
        Quy định giá vé
      </Title>

      <PrimaryButton
        icon={<PlusOutlined />}
        onClick={handleAddNew}
        style={{ marginBottom: 16 }}
      >
        Thêm mới
      </PrimaryButton>

      <Table
        rowKey="lineId"
        bordered
        pagination={false}
        loading={loading}
        dataSource={data}
        columns={columns}
      />

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={onSubmit}
        title={editing ? 'Cập nhật giá vé' : 'Thêm giá vé'}
        okText={editing ? 'Cập nhật' : 'Thêm mới'}
        destroyOnClose
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="lineId"
            label="Tuyến"
            rules={[{ required: true, message: 'Chọn tuyến' }]}
          >
            <Select placeholder="Chọn tuyến" disabled={!!editing}>
              {lines.map((line) => (
                <Option key={line.id} value={line.id}>
                  {line.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="startPrice"
            label="Giá khởi điểm"
            rules={[{ required: true, message: 'Nhập giá khởi điểm' }]}
            extra="Nhập số nhỏ (đơn vị nghìn đồng). Ví dụ: 7 → 7.000 VNĐ"
          >
            <InputNumber
              min={0}
              step={1}
              style={{ width: '100%' }}
              placeholder="Nhập 7 cho 7.000 VNĐ"
            />
          </Form.Item>

          <Form.Item
            name="startRange"
            label="Khoảng bắt đầu tính giá (km)"
            rules={[{ required: true, message: 'Nhập khoảng' }]}
          >
            <InputNumber
              min={0}
              step={0.1}
              style={{ width: '100%' }}
              placeholder="Nhập số km"
            />
          </Form.Item>

          <Form.Item
            name="pricePerKm"
            label="Giá mỗi km sau khởi điểm"
            rules={[{ required: true, message: 'Nhập giá mỗi km' }]}
            extra="Nhập số nhỏ (nghìn đồng/km). Ví dụ: 1 → 1.000 VNĐ/km"
          >
            <InputNumber
              min={0}
              step={0.01}
              style={{ width: '100%' }}
              placeholder="Nhập 1 cho 1.000 VNĐ/km"
            />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Xác nhận tính lại bảng giá"
        open={isConfirmModalVisible}
        onOk={handleConfirmModalOk}
        onCancel={handleConfirmModalCancel}
        okText="Xác nhận"
        cancelText="Hủy"
      >
        <p>Bạn có chắc chắn muốn tính lại bảng giá cho tuyến <strong>{recordToCalculate && lines.find(l => l.id === recordToCalculate.lineId)?.name}</strong>?</p>
        <p>Điều này sẽ ghi đè lên bảng giá hiện tại.</p>
        <p>Để xác nhận, vui lòng gõ chữ <strong>"ok"</strong> vào ô bên dưới:</p>
        <Input
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="Gõ 'ok' để xác nhận"
          style={{ marginTop: 8 }}
        />
      </Modal>
      </div>
    </>
  );
};

export default DynamicPriceMasterTab;
