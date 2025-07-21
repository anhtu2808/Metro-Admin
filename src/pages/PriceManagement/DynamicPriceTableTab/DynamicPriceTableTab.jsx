import React, { useEffect, useState } from 'react';
import { Table, Select, Typography, message, Modal, Input } from 'antd';
import { calculateDynamicPriceAPI, getAllLinesAPI, getDynamicPriceByLineIdAPI, getStationsByLineIdAPI } from '../../../apis';
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton';
import { usePermission } from '../../../hooks/usePermission';

const { Title } = Typography;
const { Option } = Select;

const DynamicPriceTableTab = () => {
    const [stations, setStations] = useState([]);
    const [lines, setLines] = useState([]);
    const [selectedLine, setSelectedLine] = useState(null);
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [confirmText, setConfirmText] = useState('');
    const isCanCalculate = usePermission("dynamicPrice:calculate");

    useEffect(() => {
        const fetchLines = async () => {
            const lineRes = await getAllLinesAPI();
            setLines(lineRes.result.data || []);
        };
        fetchLines();
    }, []);

    useEffect(() => {
        if (!selectedLine) {
            setStations([]);
            return;
        }
        const fetchStations = async () => {
            try {
                const stationRes = await getStationsByLineIdAPI(selectedLine);
                setStations(stationRes.result || []);
            } catch (error) {
                console.error("Lỗi khi fetch stations:", error);
                setStations([]);
            }
        };
        fetchStations();
    }, [selectedLine]);

    useEffect(() => {
        if (!selectedLine) return;
        const fetchPrices = async () => {
            setLoading(true);
            try {
                const res = await getDynamicPriceByLineIdAPI(selectedLine);
                setPrices(res.result || []);
            } catch (error) {
                if (error.response?.status === 404) {
                    setPrices(null); // đánh dấu là chưa có bảng giá
                } else {
                    console.error("Lỗi khác:", error);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchPrices();
    }, [selectedLine]);

        const handleCalculate = async (lineId) => {
        setLoading(true);
        try {
          const res = await calculateDynamicPriceAPI(lineId);
          message.success('Đã tính lại bảng giá vé lượt cho tuyến ' + lines.find(l => l.id === lineId).name);
          setPrices(res.result || []);
        } catch (error) {
            if (error.response?.status === 404) {
                message.error('Tuyến này hiện chưa có quy định tính giá.');
            } else {
                message.error(error.response.data.message);
            }
        } finally {
          setLoading(false);
        }
       };

    const showRecalculateModal = () => {
        if (!selectedLine) {
            message.warning('Vui lòng chọn tuyến trước');
            return;
        }
        setIsModalVisible(true);
        setConfirmText('');
    };

    const handleModalOk = () => {
        if (confirmText.toLowerCase() === 'ok') {
            setIsModalVisible(false);
            setConfirmText('');
            handleCalculate(selectedLine);
        } else {
            message.error('Vui lòng gõ chính xác "ok" để xác nhận');
        }
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setConfirmText('');
    };


    const renderMatrix = () => {
        const columns = [
            {
                title: 'Ga bắt đầu',
                dataIndex: 'start',
                fixed: 'left',
                width: 150,
                ellipsis: true,
            },
            ...stations.map(st => ({
                title: st.name,
                dataIndex: `col-${st.id}`,
                align: 'center',
                width: 120,
                render: val => val ? `${val.toLocaleString()} VNĐ` : '—'
            }))
        ];

        const data = stations.map(start => {
            const row = { key: start.id, start: start.name };
            stations.forEach(end => {
                if (start.id === end.id) {
                    row[`col-${end.id}`] = null;
                } else {
                    const priceObj = prices.find(
                        p =>
                            p.startStationId === start.id &&
                            p.endStationId === end.id
                    );
                    row[`col-${end.id}`] = priceObj ? Number(priceObj.price) : null;
                }
            });
            return row;
        });

        return (
            <Table
                columns={columns}
                dataSource={data}
                loading={loading}
                pagination={false}
                scroll={{ x: 'max-content', scrollToFirstRowOnChange: true }}
                bordered
                size="small"
                style={{ 
                    margin: '0 auto',
                    maxWidth: '100%'
                }}
            />
        );
    };

    return (
        <div style={{ padding: 24 }}>
            <Title level={4}>Bảng giá theo tuyến</Title>

            <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' }}>
                <Select
                    value={selectedLine}
                    onChange={setSelectedLine}
                    placeholder="Chọn tuyến"
                    style={{ width: 250 }}
                >
                    {lines.map(line => (
                        <Option key={line.id} value={line.id}>
                            {line.name}
                        </Option>
                    ))}
                </Select>
                {isCanCalculate && <PrimaryButton onClick={showRecalculateModal}>
                    Tính lại
                </PrimaryButton>}
            </div>

            {selectedLine && (
                prices === null ? (
                    <div style={{ textAlign: 'center', marginTop: 40 }}>
                        <p>Tuyến này hiện chưa có bảng giá.</p>
                        {isCanCalculate && <PrimaryButton
                            onClick={showRecalculateModal}
                        >
                            Tính bảng giá
                        </PrimaryButton>}
                    </div>
                ) : (
                    renderMatrix()
                )
            )}

            <Modal
                title="Xác nhận tính lại bảng giá"
                open={isModalVisible}
                onOk={handleModalOk}
                onCancel={handleModalCancel}
                okText="Xác nhận"
                cancelText="Hủy"
            >
                <p>Bạn có chắc chắn muốn tính lại bảng giá cho tuyến <strong>{lines.find(l => l.id === selectedLine)?.name}</strong>?</p>
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
    );
};

export default DynamicPriceTableTab;
