import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Modal, Form, Input, Button, message, Card, Space, Typography } from 'antd';
import { EditOutlined, InfoCircleOutlined, UpOutlined, DownOutlined, CloseOutlined } from '@ant-design/icons';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import StationModal from '../../StationManagement/StationModal';
import './MapView.css';

const { Text } = Typography;

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Metro station GPS coordinates for Ho Chi Minh City
const stationCoordinates = {
  "Bến Xe Suối Tiên": [10.8515, 106.7717],
  "Đại Học Quốc Gia": [10.8700, 106.8030],
  "Khu Công Nghệ Cao": [10.8506, 106.7717],
  "Thủ Đức": [10.8452, 106.7592],
  "Bình Thái": [10.8281, 106.7456],
  "Bến Thành": [10.7720, 106.6980],
  "Nhà hát TP": [10.7769, 106.7009],
  "Ba Son": [10.7886, 106.7053],
  "Thảo Điền": [10.8027, 106.7308],
  "An Phú": [10.8027, 106.7308]
};

const MapView = ({ selectedLine, segments, onSegmentUpdate, onStationUpdate }) => {
  const [isStationModalVisible, setIsStationModalVisible] = useState(false);
  const [editingStation, setEditingStation] = useState(null);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [segmentModalVisible, setSegmentModalVisible] = useState(false);
  const [segmentPanelCollapsed, setSegmentPanelCollapsed] = useState(false);
  const [segmentForm] = Form.useForm();

  // Default center to Ho Chi Minh City
  const defaultCenter = [10.8231, 106.6297];
  const defaultZoom = 11;

  const handleStationEdit = (station) => {
    const stationData = {
      ...station,
      code : station.stationCode
    }
    setEditingStation(stationData);
    setIsStationModalVisible(true);
  };

  const handleStationModalSuccess = async () => {
    setIsStationModalVisible(false);
    setEditingStation(null);
    
    // Call parent callback to reload station data
    if (onStationUpdate) {
      await onStationUpdate();
    }
    
    message.success('Cập nhật station thành công!');
  };

  const handleStationModalCancel = () => {
    setIsStationModalVisible(false);
    setEditingStation(null);
  };

  const handleSegmentClick = (segment) => {
    setSelectedSegment(segment);
    segmentForm.setFieldsValue({
      segment: segment,
      distance: '',
      duration: '',
      description: ''
    });
    setSegmentModalVisible(true);
  };

  const handleSegmentModalOk = () => {
    segmentForm.validateFields().then(values => {
      if (onSegmentUpdate) {
        onSegmentUpdate(selectedSegment, values);
      }
      message.success(`Updated information for segment: ${selectedSegment}`);
      setSegmentModalVisible(false);
      setSelectedSegment(null);
      segmentForm.resetFields();
    });
  };

  const handleSegmentModalCancel = () => {
    setSegmentModalVisible(false);
    setSelectedSegment(null);
    segmentForm.resetFields();
  };

  const getLineColor = (lineId) => {
    const colors = {
      1: '#1890ff', // Blue for M1
      2: '#52c41a', // Green for M2
      3: '#faad14', // Orange for M3
      4: '#f5222d', // Red for M4
    };
    return colors[lineId] || '#1890ff';
  };

  // Extract stations from line segments
  const getStationsFromLine = (line) => {
    if (!line || !line.lineSegments) return [];
    
    const stationsMap = new Map();
    
    // Add all start stations
    line.lineSegments.forEach(segment => {
      if (segment.startStation) {
        stationsMap.set(segment.startStation.id, segment.startStation);
      }
    });
    
    // Add the final station (endStation of the last segment)
    if (line.lineSegments.length > 0) {
      const lastSegment = line.lineSegments[line.lineSegments.length - 1];
      if (lastSegment.endStation) {
        stationsMap.set(lastSegment.endStation.id, lastSegment.endStation);
      }
    }
    
    return Array.from(stationsMap.values());
  };

  const renderStations = () => {
    if (!selectedLine) return null;

    const stations = getStationsFromLine(selectedLine);
    
    return stations.map((station, index) => {
      // Use actual coordinates from API or fallback to predefined coordinates
      const coords = station.latitude && station.longitude 
        ? [parseFloat(station.latitude), parseFloat(station.longitude)]
        : stationCoordinates[station.name] || [10.8231, 106.6297]; // fallback to HCM center

      return (
        <Marker key={`${station.id}-${index}`} position={coords}>
          <Popup>
            <div className="station-popup">
              <div className="station-popup-header">
                <Text strong>{station.name}</Text>
                <Button 
                  type="text" 
                  icon={<EditOutlined />} 
                  size="small"
                  onClick={() => handleStationEdit(station)}
                />
              </div>
              <div className="station-popup-content">
                <Text type="secondary">
                  Code: {station.stationCode || 'N/A'}<br/>
                  Lat: {coords[0].toFixed(6)}<br/>
                  Lng: {coords[1].toFixed(6)}
                </Text>
                {station.address && (
                  <Text type="secondary" style={{ display: 'block', marginTop: 4 }}>
                    Address: {station.address}
                  </Text>
                )}
              </div>
            </div>
          </Popup>
        </Marker>
      );
    });
  };

  const renderPolylines = () => {
    if (!selectedLine) return null;

    const stations = getStationsFromLine(selectedLine);
    const lineCoords = stations
      .map(station => {
        // Use actual coordinates from API or fallback to predefined coordinates
        return station.latitude && station.longitude 
          ? [parseFloat(station.latitude), parseFloat(station.longitude)]
          : stationCoordinates[station.name];
      })
      .filter(coords => coords !== undefined);

    if (lineCoords.length < 2) return null;

    return (
      <Polyline
        positions={lineCoords}
        color={getLineColor(selectedLine.id)}
        weight={4}
        opacity={0.8}
        eventHandlers={{
          click: (e) => {
            // Handle polyline click if needed
          }
        }}
      />
    );
  };

  const renderSegmentInfo = () => {
    if (!selectedLine || !segments.length) return null;

    return (
      <div className={`segment-info-panel ${segmentPanelCollapsed ? 'collapsed' : ''}`}>
        <Card
          title={
            <Space>
              <InfoCircleOutlined />
              <span>Khoảng cách giữa các trạm</span>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                ({segments.length})
              </Text>
            </Space>
          }
          size="small"
          className="segment-info-card"
          extra={
            <Space>
              <Button
                type="text"
                size="small"
                icon={segmentPanelCollapsed ? <DownOutlined /> : <UpOutlined />}
                onClick={() => setSegmentPanelCollapsed(!segmentPanelCollapsed)}
                title={segmentPanelCollapsed ? "Expand" : "Collapse"}
              />
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                onClick={() => setSegmentPanelCollapsed(true)}
                title="Close"
              />
            </Space>
          }
        >
          {!segmentPanelCollapsed && (
            <div className="segment-list">
              {segments.map((segment, index) => (
                <div 
                  key={index} 
                  className="segment-item"
                  onClick={() => handleSegmentClick(segment)}
                >
                  <Text className="segment-name">{segment}</Text>
                  <Button 
                    type="text" 
                    icon={<EditOutlined />} 
                    size="small"
                  />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    );
  };

  if (!selectedLine) {
    return (
      <div className="map-view-empty">
        <div className="map-view-empty-content">
          <InfoCircleOutlined style={{ fontSize: 48, color: '#d9d9d9', marginBottom: 16 }} />
          <Text type="secondary" style={{ fontSize: 16 }}>
            Vui lòng chọn một tuyến để xem  bản đồ
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="map-view-container" style={{ height: '100%', minHeight: '500px' }}>
      <div className="map-view-main" style={{ height: '100%' }}>
        <MapContainer
          center={defaultCenter}
          zoom={defaultZoom}
          style={{ height: '100%', width: '100%', minHeight: '500px' }}
          className="map-container"
          whenReady={(map) => {
            setTimeout(() => {
              map.target.invalidateSize();
            }, 100);
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {renderStations()}
          {renderPolylines()}
        </MapContainer>
        
        {renderSegmentInfo()}
      </div>

      {/* Station Edit Modal */}
      <StationModal
        visible={isStationModalVisible}
        onCancel={handleStationModalCancel}
        onSuccess={handleStationModalSuccess}
        editingStation={editingStation}
        loading={false}
      />

      {/* Segment Info Modal */}
      <Modal
        title="Edit Segment Information"
        open={segmentModalVisible}
        onOk={handleSegmentModalOk}
        onCancel={handleSegmentModalCancel}
        okText="Update"
        cancelText="Cancel"
        width={600}
      >
        <Form form={segmentForm} layout="vertical">
          <Form.Item
            name="segment"
            label="Segment"
          >
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="distance"
            label="Distance (km)"
          >
            <Input type="number" step="0.1" placeholder="2.5" />
          </Form.Item>
          <Form.Item
            name="duration"
            label="Travel Duration (minutes)"
          >
            <Input type="number" placeholder="5" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Description"
          >
            <Input.TextArea rows={3} placeholder="Additional information about this segment..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MapView; 