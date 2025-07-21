import "./LineManagement.css";
import {
  Input,
  Layout,
  message,
  Modal,
  Form,
  Button,
  Space,
  Dropdown,
  Checkbox
} from "antd";

import { FaTrain, FaRoute, FaMapMarkerAlt } from "react-icons/fa";
import { AppstoreOutlined, EnvironmentOutlined, SettingOutlined } from "@ant-design/icons";
import { useEffect, useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { setLayoutData } from "../../redux/layoutSlice";
import { DragDropContext } from "react-beautiful-dnd";
import { ListCard } from "./ListCard/ListCard";
import MapView from "./MapView/MapView";
import StationModal from "../StationManagement/StationModal";
import LineSegmentModal from "./LineSegmentModal";
import LineModal from "./LineModal";
import { getAllLinesAPI, getAllStationsAPI, addStationsToLineAPI } from "../../apis";
import Preloader from "../../components/Preloader/Preloader";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";

const { Content } = Layout;

const LineManagement = () => {
  const dispatch = useDispatch();
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'map'
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Pagination state for lines
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedLineMap, setSelectedLineMap] = useState(null); // Separate state for map view
  const [stations, setStations] = useState([]);
  const [tempStations, setTempStations] = useState([]);
  
  // All stations for station bank
  const [allStations, setAllStations] = useState([]);

  // State cho modal xác nhận
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [form] = Form.useForm();

  // Thêm flag kiểm tra thay đổi
  const [hasStationChanged, setHasStationChanged] = useState(false);

  // Extract stations from line segments
  const extractStationsFromLine = (line) => {
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

  // Generate segments from line data or from tempStations
  const generateSegments = (line) => {
    if (line && line.lineSegments) {
      // Generate from API line data
      return line.lineSegments.map(segment => 
        `${segment.startStation?.name || 'N/A'} - ${segment.endStation?.name || 'N/A'}`
      );
    } else if (tempStations.length > 1) {
      // Generate from tempStations for dynamic updates
      return tempStations.slice(0, -1).map((station, index) =>
        `${station.name} - ${tempStations[index + 1].name}`
      );
    }
    return [];
  };

  const [segments, setSegments] = useState([]);
  const [segmentsMap, setSegmentsMap] = useState([]); // Separate segments for map view

  const [searchValues, setSearchValues] = useState({
    lines: '',
    segments: '',
    stations: '',
    allStations: ''
  });

  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    lines: true,
    stationBank: true,
    stations: true,
    segments: true
  });

  // Station modal state
  const [isStationModalVisible, setIsStationModalVisible] = useState(false);
  const [editingStation, setEditingStation] = useState(null);

  // Line segment modal state
  const [isSegmentModalVisible, setIsSegmentModalVisible] = useState(false);
  const [editingSegment, setEditingSegment] = useState(null);

  // Line modal state
  const [isLineModalVisible, setIsLineModalVisible] = useState(false);
  const [editingLine, setEditingLine] = useState(null);

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

  // Get available stations for station bank (exclude stations already in line)
  const getAvailableStations = () => {
    if (!selectedLine) return allStations;
    
    const usedStationIds = tempStations.map(station => station.id);
    return allStations.filter(station => !usedStationIds.includes(station.id));
  };

  const getLineCode = (line) => {
    // Use lineCode from API or extract from name as fallback
    if (line.lineCode) {
      return line.lineCode;
    }
    const match = line.name?.match(/^(M\d+)/);
    return match ? match[1] : line.name?.split(' ')[0] || 'N/A';
  };

  const handleLineSelect = (line) => {
    setSelectedLine(line);
    const extractedStations = extractStationsFromLine(line);
    setStations(extractedStations);
    setTempStations(extractedStations);
    setSegments(generateSegments(line));
  };

  const handleLineSelectMap = (line) => {
    setSelectedLineMap(line);
    setSegmentsMap(generateSegments(line));
  };

  const handleSegmentUpdate = (segment, segmentInfo) => {
    console.log('Segment updated:', segment, segmentInfo);
    // Có thể lưu thông tin segment vào database hoặc state management
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  const handleColumnToggle = (columnKey) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  const getColumnVisibilityMenu = () => {
    const menuItems = [
      {
        key: 'lines',
        label: (
          <Checkbox 
            checked={visibleColumns.lines}
            onChange={() => handleColumnToggle('lines')}
          >
            Tuyến Metro
          </Checkbox>
        ),
      },
      {
        key: 'stationBank',
        label: (
          <Checkbox 
            checked={visibleColumns.stationBank}
            onChange={() => handleColumnToggle('stationBank')}
          >
            Danh sách ga
          </Checkbox>
        ),
      },
      {
        key: 'stations',
        label: (
          <Checkbox 
            checked={visibleColumns.stations}
            onChange={() => handleColumnToggle('stations')}
            disabled={!selectedLine}
          >
            Ga của tuyến {selectedLine ? getLineCode(selectedLine) : 'Chọn tuyến'}
          </Checkbox>
        ),
      },
      {
        key: 'segments',
        label: (
          <Checkbox 
            checked={visibleColumns.segments}
            onChange={() => handleColumnToggle('segments')}
            disabled={!selectedLine}
          >
            Khoảng cách giữa các ga - {selectedLine ? getLineCode(selectedLine) : 'Chọn tuyến'}
          </Checkbox>
        ),
      },
    ];

    return { items: menuItems };
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    // Handle drag from station bank to line stations
    if (source.droppableId === 'allStations' && destination.droppableId === 'stations') {
      const filteredStations = getFilteredData(getAvailableStations(), searchValues.allStations);
      const destItems = Array.from(tempStations);
      const draggedItem = filteredStations[source.index];
      
      // Check if station already exists in line stations (prevent duplicates)
      const existingStation = destItems.find(station => station.id === draggedItem.id);
      if (existingStation) {
        message.warning(`Station "${draggedItem.name}" is already in this line`);
        return;
      }
      
      // Add the dragged station to line stations
      destItems.splice(destination.index, 0, draggedItem);
      setTempStations(destItems);
      return;
    }

    // Handle drag from line stations back to station bank (remove from line)
    if (source.droppableId === 'stations' && destination.droppableId === 'allStations') {
      const sourceItems = Array.from(tempStations);
      sourceItems.splice(source.index, 1);
      setTempStations(sourceItems);
      return;
    }

    // Handle reordering within the same list (except segments and allStations)
    if (source.droppableId === destination.droppableId && 
        source.droppableId !== 'segments' && 
        source.droppableId !== 'allStations') {
      const items = Array.from(
        source.droppableId === 'lines' ? lines : tempStations
      );
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      if (source.droppableId === 'lines') {
        setLines(items);
      } else if (source.droppableId === 'stations') {
        setTempStations(items);
      }
    }
  };

  const handleSort = (direction) => {
    const sortedStations = [...tempStations].sort((a, b) => {
      const nameA = typeof a === 'string' ? a : a.name;
      const nameB = typeof b === 'string' ? b : b.name;
      return direction === 'asc' ?
        nameA.localeCompare(nameB) :
        nameB.localeCompare(nameA);
    });
    setTempStations(sortedStations);
  };

  const handleSaveStations = () => {
    setIsModalVisible(true);
    setModalLoading(false);
    setConfirmText('');
    form.resetFields();
  };

  const handleModalOk = async () => {
    if (confirmText.toLowerCase() === 'ok') {
      try {
        setModalLoading(true);
        if(tempStations.length < 2) {
          message.error('Vui lòng chọn ít nhất 2 ga');
          return;
        }
        // Prepare payload with station IDs
        const stationIds = tempStations.map(station => station.id);
        const payload = stationIds;

        // Call API to add stations to line
        await addStationsToLineAPI(selectedLine.id, payload);
        
        // Update local state after successful API call
        setStations(tempStations);
        setSegments(generateSegments(null)); // Generate from tempStations
        setIsModalVisible(false);
        setConfirmText('');
        message.success('Thay đổi đã được lưu thành công');
      } catch (error) {
        console.error('Error saving stations to line:', error);
        message.error('Lưu thay đổi thất bại');
      } finally {
        setModalLoading(false);
      }
    } else {
      message.error('Vui lòng nhập "ok" để lưu thay đổi');
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
    setModalLoading(false);
    setConfirmText('');
    setTempStations(stations); // Reset temporary changes
    message.info('Changes discarded');
  };

  const handleAddItem = () => {
    setEditingStation(null);
    setIsStationModalVisible(true);
  };

  const handleAddLine = () => {
    setEditingLine(null);
    setIsLineModalVisible(true);
  };

  const handleMenuClick = (action, item) => {
    if (action === "EDIT") {
      // Check if it's a line (has lineCode property or is from lines list)
      if (typeof item === 'object' && item.id && item.lineCode) {
        setEditingLine(item);
        setIsLineModalVisible(true);
      }
      // Check if it's a station (has stationCode or code property)
      else if (typeof item === 'object' && item.id && (item.name || item.stationCode || item.code)) {
        setEditingStation(item);
        setIsStationModalVisible(true);
      } 
      // Check if it's a line segment (string format like "Station A - Station B")
      else if (typeof item === 'string' && item.includes(' - ') && selectedLine) {
        // Nếu có thay đổi station chưa lưu thì cảnh báo
        if (hasStationChanged) {
          Modal.warning({
            title: 'Cảnh báo',
            content: 'Đã có thay đổi danh sách ga, vui lòng lưu thay đổi rồi tiếp tục cập nhật thông tin khoảng cách.',
          });
          return;
        }
        // Find the corresponding segment from selectedLine
        const segmentIndex = segments.indexOf(item);
        if (segmentIndex !== -1 && selectedLine.lineSegments && selectedLine.lineSegments[segmentIndex]) {
          setEditingSegment(selectedLine.lineSegments[segmentIndex]);
          setIsSegmentModalVisible(true);
        } else {
          message.warning("Không tìm thấy thông tin line segment");
        }
      } else {
        message.info("Chỉ có thể chỉnh sửa line, station hoặc line segment");
      }
    } else if (action === "DELETE") {
      message.info("Chức năng xóa sẽ được triển khai sau");
    }
  };

  // Handle station modal
  const handleStationModalSuccess = async () => {
    setIsStationModalVisible(false);
    setEditingStation(null);
    
    // Reload stations data
    await loadAllStations();
    message.success(editingStation ? 'Cập nhật station thành công!' : 'Thêm station mới thành công!');
  };

  const handleStationModalCancel = () => {
    setIsStationModalVisible(false);
    setEditingStation(null);
  };

  // Handle line segment modal
  const handleSegmentModalSuccess = async () => {
    setIsSegmentModalVisible(false);
    setEditingSegment(null);
    
    // Reload lines data to get updated segments
    await loadLines(false, pagination.current, pagination.pageSize, '', selectedLine);
    
    message.success('Cập nhật line segment thành công!');
  };

  const handleSegmentModalCancel = () => {
    setIsSegmentModalVisible(false);
    setEditingSegment(null);
  };

  // Handle line modal
  const handleLineModalSuccess = async () => {
    setIsLineModalVisible(false);
    setEditingLine(null);
    
    // Reload lines data
    await loadLines(false, pagination.current, pagination.pageSize, '');
    message.success(editingLine ? 'Cập nhật tuyến tàu thành công!' : 'Tạo tuyến tàu mới thành công!');
  };

  const handleLineModalCancel = () => {
    setIsLineModalVisible(false);
    setEditingLine(null);
  };

  // Load lines from API with pagination
  const loadLines = async (isInitial = false, page = 1, pageSize = 10, searchQuery = '', currentSelectedLine = null) => {
    try {
      if (isInitial) {
        setInitialLoading(true);
      } else {
        setLoading(true);
      }
      
      const response = await getAllLinesAPI({
        page,
        size: pageSize,
        search: searchQuery
      });
      
      if (response.code === 200) {
        const { result } = response;
        const { data, currentPage, pageSize: returnedPageSize, totalElements } = result;
        
        setLines(data);
        
        // If there's a selected line, update it with new data
        if (currentSelectedLine) {
          const updatedLine = data.find(line => line.id === currentSelectedLine.id);
          if (updatedLine) {
            setSelectedLine(updatedLine);
            const extractedStations = extractStationsFromLine(updatedLine);
            setStations(extractedStations);
            setTempStations(extractedStations);
            setSegments(generateSegments(updatedLine));
          }
        }
        
        // Update pagination state
        setPagination(prev => ({
          ...prev,
          current: currentPage,
          pageSize: returnedPageSize,
          total: totalElements
        }));
      } else {
        throw new Error('API response error');
      }
    } catch (error) {
      console.error('Error loading lines:', error);
      message.error('Không thể tải dữ liệu tuyến tàu');
    } finally {
      if (isInitial) {
        setInitialLoading(false);
      } else {
        setLoading(false);
      }
    }
  };

  // Load all stations for station bank (no pagination needed)
  const loadAllStations = async () => {
    try {
      const response = await getAllStationsAPI({
        page: 1,
        size: 1000, // Get all stations
        search: ''
      });
      
      if (response.code === 200) {
        const { result } = response;
        const { data } = result;
        
        // Transform API data to match component format
        const transformedStations = data.map(station => ({
          id: station.id,
          name: station.name || 'Unnamed Station',
          code: station.stationCode || 'N/A',
          address: station.address || 'Chưa có địa chỉ',
          latitude: parseFloat(station.latitude) || 0,
          longitude: parseFloat(station.longitude) || 0,
          imageUrl: station.imageUrl
        }));
        
        setAllStations(transformedStations);
      }
    } catch (error) {
      console.error('Error loading all stations:', error);
      message.error('Không thể tải dữ liệu stations');
    }
  };

  useEffect(() => {
    dispatch(setLayoutData({
      title: "Quản lý tuyến tàu",
      icon: <FaTrain />,
    }));
    
    // Load data from API
    loadLines(true);
    loadAllStations();
  }, [dispatch]);

  // Update segments when tempStations change
  useEffect(() => {
    if (selectedLine && tempStations.length > 0) {
      setSegments(generateSegments(null)); // Generate from tempStations
    }
  }, [tempStations, selectedLine]);

  // Theo dõi thay đổi tempStations so với stations ban đầu
  useEffect(() => {
    if (selectedLine) {
      const isChanged = JSON.stringify(tempStations.map(s => s.id)) !== JSON.stringify(stations.map(s => s.id));
      setHasStationChanged(isChanged);
    } else {
      setHasStationChanged(false);
    }
  }, [tempStations, stations, selectedLine]);

  const renderKanbanView = () => (
      <DragDropContext onDragEnd={handleDragEnd}>
        {visibleColumns.lines && (
          <ListCard
            title="Tuyến Metro"
            data={getFilteredData(lines, searchValues.lines)}
            onAdd={handleAddLine}
            onMenuClick={handleMenuClick}
            onItemClick={handleLineSelect}
            selectedItem={selectedLine}
            icon={<FaTrain style={{ fontSize: '20px', color: '#1890ff' }} />}
            droppableId="lines"
            searchValue={searchValues.lines}
            onSearch={(value) => handleSearch('lines', value)}
          />
        )}
        
        {visibleColumns.stationBank && selectedLine && visibleColumns.segments && (
          <ListCard
            title="Danh sách ga"
            data={getFilteredData(getAvailableStations(), searchValues.allStations)}
            onAdd={handleAddItem}
            onMenuClick={handleMenuClick}
            icon={<FaMapMarkerAlt style={{ fontSize: '20px', color: '#8c8c8c' }} />}
            droppableId="allStations"
            searchValue={searchValues.allStations}
            onSearch={(value) => handleSearch('allStations', value)}
          />
        )}
        {visibleColumns.stations && (
          selectedLine ? (
            <ListCard
              title={`Ga của tuyến ${getLineCode(selectedLine)}`}
              data={getFilteredData(tempStations, searchValues.stations)}
              onAdd={() => message.info("Kéo station từ Station Bank để thêm vào tuyến")}
              onMenuClick={handleMenuClick}
              icon={<FaMapMarkerAlt style={{ fontSize: '20px', color: '#faad14' }} />}
              droppableId="stations"
              onSort={handleSort}
              showSortButtons={true}
              searchValue={searchValues.stations}
              onSearch={(value) => handleSearch('stations', value)}
              onSave={handleSaveStations}
              showAddButton={false}
            />
          ) : (
            <div className="line-management-placeholder">
              <span>Vui lòng chọn một tuyến để tiếp tục</span>
            </div>
          )
        )}
        {selectedLine && visibleColumns.segments && (
          <ListCard
            title={`Khoảng cách giữa các ga `}
            data={getFilteredData(segments, searchValues.segments)}
            onAdd={() => message.info("Segment được tự động tạo từ stations")}
            onMenuClick={handleMenuClick}
            icon={<FaRoute style={{ fontSize: '20px', color: '#52c41a' }} />}
            droppableId="segments"
            searchValue={searchValues.segments}
            onSearch={(value) => handleSearch('segments', value)}
            showAddButton={false}
          />
        )}
    </DragDropContext>
  );

  const renderMapView = () => (
    <div className="line-management-map-fullscreen">
      <div className="map-view-header">
        <div className="map-view-line-selector">
          <Space>
            <span style={{ fontWeight: 500, color: '#1a1a1a' }}>Chọn tuyến:</span>
            <Space.Compact>
              {lines.map(line => (
                <Button
                  key={line.id}
                  type={selectedLineMap?.id === line.id ? 'primary' : 'default'}
                  onClick={() => handleLineSelectMap(line)}
                  style={{ marginRight: 8 }}
                >
                  {getLineCode(line)}
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
          onStationUpdate={loadAllStations}
        />
      </div>
    </div>
  );

  // Show fullscreen preloader on initial load
  if (initialLoading) {
    return <Preloader fullscreen={true} />;
  }

  return (
    <div className="line-management-layout">
      <div className="line-management-header">
        <div className="view-mode-toggle">
          <Space>
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
            {viewMode === 'kanban' && (
              <Dropdown 
                menu={getColumnVisibilityMenu()} 
                trigger={['click']}
                placement="bottomRight"
              >
                <Button icon={<SettingOutlined />} type="default">
                  Cột hiển thị
                </Button>
              </Dropdown>
            )}
          </Space>
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
        title="Xác nhận thay đổi"
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText="Lưu thay đổi"
        cancelText="Hủy"
        confirmLoading={modalLoading}
      >
        <p>Nhập "ok" để lưu thay đổi vào ga và cập nhật khoảng cách</p>
        <p style={{color: 'red'}}>Lưu ý: Khi lưu thay đổi các dữ liệu cũ về khoảng cách sẽ bị xoá và được tạo lại từ dữ liệu mới</p>
        <Form form={form}>
          <Form.Item>
            <Input
              placeholder="Nhập 'ok' để lưu thay đổi"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Station Management Modal */}
      <StationModal
        visible={isStationModalVisible}
        onCancel={handleStationModalCancel}
        onSuccess={handleStationModalSuccess}
        editingStation={editingStation}
        loading={loading}
      />

      {/* Line Segment Management Modal */}
      <LineSegmentModal
        visible={isSegmentModalVisible}
        onCancel={handleSegmentModalCancel}
        onSuccess={handleSegmentModalSuccess}
        editingSegment={editingSegment}
        loading={loading}
      />

      {/* Line Management Modal */}
      <LineModal
        visible={isLineModalVisible}
        onCancel={handleLineModalCancel}
        onSuccess={handleLineModalSuccess}
        editingLine={editingLine}
        allStations={allStations}
        loading={loading}
      />
    </div>
  );
};

export default LineManagement;
