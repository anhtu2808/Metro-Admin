import React, { useEffect, useState } from 'react';
import { Table, Select, Typography } from 'antd';
import { getAllLinesAPI, getAllStationsAPI, getDynamicPriceByLineIdAPI } from '../../../apis';
import PrimaryButton from '../../../components/PrimaryButton/PrimaryButton';

const { Title } = Typography;
const { Option } = Select;

const DynamicPriceTableTab = () => {
    const [stations, setStations] = useState([]);
    const [lines, setLines] = useState([]);
    const [selectedLine, setSelectedLine] = useState(null);
    const [prices, setPrices] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInit = async () => {
            const [stationRes, lineRes] = await Promise.all([
                getAllStationsAPI(
                    {
                        size: 1000,
                        page: 1,
                    }
                ),
                getAllLinesAPI()
            ]);
            setStations(stationRes.result.data || []);
            setLines(lineRes.result.data || []);
        };
        fetchInit();
    }, []);

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

    const handleCalculate = () => {
        console.log("Tính bảng giá");
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
                render: val => val ? `${val.toLocaleString()}.000 VNĐ` : '—'
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

            <Select
                value={selectedLine}
                onChange={setSelectedLine}
                placeholder="Chọn tuyến"
                style={{ width: 250, marginBottom: 20 }}
            >
                {lines.map(line => (
                    <Option key={line.id} value={line.id}>
                        {line.name}
                    </Option>
                ))}
            </Select>

            {selectedLine && (
                prices === null ? (
                    <div style={{ textAlign: 'center', marginTop: 40 }}>
                        <p>Tuyến này hiện chưa có bảng giá.</p>
                        <PrimaryButton
                            onClick={handleCalculate}
                        >
                            Tính bảng giá
                        </PrimaryButton>
                    </div>
                ) : (
                    renderMatrix()
                )
            )}

        </div>
    );
};

export default DynamicPriceTableTab;
