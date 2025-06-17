import "./LineManagement.css";
import {
  Input,
  Layout,
  message,
  Modal,
  Form,
  Button,
  Space
} from "antd";

import { FaTrain, FaRoute, FaMapMarkerAlt } from "react-icons/fa";
import { AppstoreOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLayoutData } from "../../redux/layoutSlice";
import { DragDropContext } from "react-beautiful-dnd";
import { ListCard } from "./ListCard/ListCard";
import MapView from "./MapView/MapView";

const { Content } = Layout;

const LineManagement = () => {
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'map'
  const [lines, setLines] = useState([
    {
      id: 1,
      name: "M1 Bến xe Suối Tiên - Bến Thành",
      stations: [
        "Bến Xe Suối Tiên",
        "Đại Học Quốc Gia",
        "Khu Công Nghệ Cao",
        "Thủ Đức",
        "Bình Thái",
      ]
    },
    {
      id: 2,
      name: "M2 Sài Gòn - Thủ Đức",
      stations: [
        "Bến Thành",
        "Nhà hát TP",
        "Ba Son",
        "Thảo Điền",
        "An Phú"
      ]
    }
  ]);

  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedLineMap, setSelectedLineMap] = useState(null); // Separate state for map view
  const [stations, setStations] = useState([]);
  const [tempStations, setTempStations] = useState([]);

  // State cho modal xác nhận
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [form] = Form.useForm();

  // Tự động tạo segments dựa trên thứ tự của stations
  const generateSegments = (stationsList) => {
    return stationsList.slice(0, -1).map((station, index) =>
      `${station} - ${stationsList[index + 1]}`
    );
  };

  const [segments, setSegments] = useState([]);
  const [segmentsMap, setSegmentsMap] = useState([]); // Separate segments for map view

  const [searchValues, setSearchValues] = useState({
    lines: '',
    segments: '',
    stations: ''
  });

  const handleSearch = (type, value) => {
    setSearchValues(prev => ({
      ...prev,
      [type]: value
    }));
  };

  const getFilteredData = (data, searchValue) => {
    return data.filter(item => {
      const searchText = typeof item === 'string' ? item : item.name;
      return searchText.toLowerCase().includes(searchValue.toLowerCase());
    });
  };

  const getLineCode = (lineName) => {
    // Extract line code (M1, M2, etc.) from full line name
    const match = lineName.match(/^(M\d+)/);
    return match ? match[1] : lineName.split(' ')[0];
  };

  const handleLineSelect = (line) => {
    setSelectedLine(line);
    setStations(line.stations);
    setTempStations(line.stations);
    setSegments(generateSegments(line.stations));
  };

  const handleLineSelectMap = (line) => {
    setSelectedLineMap(line);
    setSegmentsMap(generateSegments(line.stations));
  };

  const handleSegmentUpdate = (segment, segmentInfo) => {
    console.log('Segment updated:', segment, segmentInfo);
    // Có thể lưu thông tin segment vào database hoặc state management
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId && source.droppableId !== 'segments') {
      const items = Array.from(
        source.droppableId === 'lines' ? lines : tempStations
      );
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      if (source.droppableId === 'lines') {
        setLines(items);
      } else {
        setTempStations(items);
      }
    }
  };

  const handleSort = (direction) => {
    const sortedStations = [...tempStations].sort((a, b) => {
      return direction === 'asc' ?
        a.localeCompare(b) :
        b.localeCompare(a);
    });
    setTempStations(sortedStations);
  };

  const handleSaveStations = () => {
    setIsModalVisible(true);
    form.resetFields();
  };

  const handleModalOk = () => {
    if (confirmText.toLowerCase() === 'confirm') {
      // Cập nhật stations cho line được chọn
      const updatedLines = lines.map(line => 
        line.id === selectedLine.id 
          ? { ...line, stations: tempStations }
          : line
      );
      setLines(updatedLines);
      setStations(tempStations);
      setSegments(generateSegments(tempStations));
      setSelectedLine({ ...selectedLine, stations: tempStations });
      setIsModalVisible(false);
      setConfirmText('');
      message.success('Station changes saved and segments updated');
    } else {
      message.error('Please type "confirm" to save changes');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setConfirmText('');
    setTempStations(stations); // Reset temporary changes
    message.info('Changes discarded');
  };

  const handleAddItem = () => {
    alert("me");
  };

  const handleMenuClick = (action, item) => {
    if (action === "EDIT") {
      alert("me");
    } else if (action === "DELETE") {
      alert(`me`);
    }
  };

  useEffect(() => {
    dispatch(setLayoutData({
      title: "Quản lý tuyến tàu",
      icon: <FaTrain />,
    }));
  }, [dispatch]);

  const renderKanbanView = () => (
    <DragDropContext onDragEnd={handleDragEnd}>
      <ListCard
        title="Line"
        data={getFilteredData(lines, searchValues.lines)}
        onAdd={handleAddItem}
        onMenuClick={handleMenuClick}
        onItemClick={handleLineSelect}
        selectedItem={selectedLine}
        icon={<FaTrain style={{ fontSize: '20px', color: '#1890ff' }} />}
        droppableId="lines"
        searchValue={searchValues.lines}
        onSearch={(value) => handleSearch('lines', value)}
      />
      {selectedLine && (
        <>
          <ListCard
            title={`Station - ${getLineCode(selectedLine.name)}`}
            data={getFilteredData(tempStations, searchValues.stations)}
            onAdd={handleAddItem}
            onMenuClick={handleMenuClick}
            icon={<FaMapMarkerAlt style={{ fontSize: '20px', color: '#faad14' }} />}
            droppableId="stations"
            onSort={handleSort}
            showSortButtons={true}
            searchValue={searchValues.stations}
            onSearch={(value) => handleSearch('stations', value)}
            onSave={handleSaveStations}
          />
          <ListCard
            title={`Line Segment - ${getLineCode(selectedLine.name)}`}
            data={getFilteredData(segments, searchValues.segments)}
            onAdd={handleAddItem}
            onMenuClick={handleMenuClick}
            icon={<FaRoute style={{ fontSize: '20px', color: '#52c41a' }} />}
            droppableId="segments"
            searchValue={searchValues.segments}
            onSearch={(value) => handleSearch('segments', value)}
          />
        </>
      )}
    </DragDropContext>
  );

  const renderMapView = () => (
    <div className="line-management-map-fullscreen">
      <div className="map-view-header">
        <div className="map-view-line-selector">
          <Space>
            <span style={{ fontWeight: 500, color: '#1a1a1a' }}>Select Line:</span>
            <Space.Compact>
              {lines.map(line => (
                <Button
                  key={line.id}
                  type={selectedLineMap?.id === line.id ? 'primary' : 'default'}
                  onClick={() => handleLineSelectMap(line)}
                  style={{ marginRight: 8 }}
                >
                  {getLineCode(line.name)}
                </Button>
              ))}
            </Space.Compact>
          </Space>
        </div>
      </div>
      <div className="map-view-content">
        <MapView
          selectedLine={selectedLineMap}
          segments={segmentsMap}
          onSegmentUpdate={handleSegmentUpdate}
        />
      </div>
    </div>
  );

  return (
    <div className="line-management-layout">
      <div className="line-management-header">
        <div className="view-mode-toggle">
          <Button.Group>
            <Button
              type={viewMode === 'kanban' ? 'primary' : 'default'}
              icon={<AppstoreOutlined />}
              onClick={() => handleViewModeChange('kanban')}
            >
              Kanban View
            </Button>
            <Button
              type={viewMode === 'map' ? 'primary' : 'default'}
              icon={<EnvironmentOutlined />}
              onClick={() => handleViewModeChange('map')}
            >
              Map View
            </Button>
          </Button.Group>
        </div>
      </div>

      <div className="line-management-content">
        <Layout>
          <Content className={`line-management-${viewMode}`}>
            {viewMode === 'kanban' ? renderKanbanView() : renderMapView()}
          </Content>
        </Layout>
      </div>

      <Modal
        title="Confirm Changes"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Save Changes"
        cancelText="Cancel"
      >
        <p>Type "confirm" to save your changes to stations and update segments:</p>
        <Form form={form}>
          <Form.Item>
            <Input
              placeholder="Type 'confirm' here"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default LineManagement;
