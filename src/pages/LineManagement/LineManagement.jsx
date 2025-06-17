import "./LineManagement.css";
import {
  Card,
  Input,
  Button,
  List,
  Layout,
  Typography,
  Dropdown,
  Badge,
  Space,
  Tooltip,
  message,
  Modal,
  Form
} from "antd";
import {
  PlusOutlined,
  EllipsisOutlined,
  SearchOutlined,
  DragOutlined,
  SaveFilled
} from "@ant-design/icons";
import { FaTrain, FaRoute, FaMapMarkerAlt } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setLayoutData } from "../../redux/layoutSlice";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const { Content } = Layout;
const { Text } = Typography;

const ListCard = ({
  title,
  data,
  onAdd,
  onMenuClick,
  icon,
  droppableId,
  onSort,
  searchValue,
  onSearch,
  showSortButtons = false,
  onSave
}) => (
  <Card
    className="line-management-card"
    title={
      <div className="line-management-card-title">
        <Space>
          {icon}
          <Text strong>{title}</Text>
          <Badge count={data.length} style={{ backgroundColor: '#1890ff' }} />
        </Space>
        <Space>
          {showSortButtons && (
            <>
              <Tooltip title="Save changes">
                <Button
                  type="primary"
                  icon={<SaveFilled style={{ fontSize: '16px' }} />}
                  onClick={onSave}
                />
              </Tooltip>
            </>
          )}
          <Tooltip title="Add new">
            <Button onClick={onAdd} type="text" icon={<PlusOutlined />} />
          </Tooltip>
        </Space>
      </div>
    }
  >
    <Input
      placeholder={`Search ${title.toLowerCase()}...`}
      prefix={<SearchOutlined />}
      className="line-management-input-search"
      value={searchValue}
      onChange={(e) => onSearch(e.target.value)}
    />
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <List
          {...provided.droppableProps}
          ref={provided.innerRef}
          dataSource={data}
          renderItem={(item, index) => (
            <Draggable
              key={item}
              draggableId={`${droppableId}-${item}`}
              index={index}
              isDragDisabled={droppableId === 'segments'}
            >
              {(provided, snapshot) => (
                <List.Item
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  className={`line-management-list-item ${snapshot.isDragging ? 'dragging' : ''}`}
                  actions={[
                    droppableId !== 'segments' && (
                      <div {...provided.dragHandleProps} className="line-management-drag-handle">
                        <DragOutlined style={{ cursor: 'grab', marginRight: 8 }} />
                      </div>
                    ),
                    <Dropdown
                      menu={{
                        items: menuItems,
                        onClick: ({ key }) => onMenuClick?.(key, item),
                      }}
                      trigger={['click']}
                    >
                      <EllipsisOutlined style={{ cursor: "pointer" }} />
                    </Dropdown>,
                  ].filter(Boolean)}
                >
                  <div className="line-management-list-item-content">
                    <Text>{item}</Text>
                  </div>
                </List.Item>
              )}
            </Draggable>
          )}
        >
          {provided.placeholder}
        </List>
      )}
    </Droppable>
  </Card>
);

const menuItems = [
  { key: "EDIT", label: "Edit" },
  { key: "DELETE", label: "Delete" },
];

const LineManagement = () => {
  const dispatch = useDispatch();
  const [lines, setLines] = useState(["M1 Bến xe Suối Tiên - Bến Thành"]);
  const [stations, setStations] = useState([
    "Bến Xe Suối Tiên",
    "Đại Học Quốc Gia",
    "Khu Công Nghệ Cao",
    "Thủ Đức",
    "Bình Thái",
  ]);

  // State cho stations tạm thời (chưa save)
  const [tempStations, setTempStations] = useState(stations);

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

  const [segments, setSegments] = useState(generateSegments(stations));

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
    return data.filter(item =>
      item.toLowerCase().includes(searchValue.toLowerCase())
    );
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
      setStations(tempStations);
      setSegments(generateSegments(tempStations));
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

  return (
    <div className="line-management-layout">
      <div className="line-management-content">
        <Layout>
          <Content>
            <DragDropContext onDragEnd={handleDragEnd}>
              <ListCard
                title="Line"
                data={getFilteredData(lines, searchValues.lines)}
                onAdd={handleAddItem}
                onMenuClick={handleMenuClick}
                icon={<FaTrain style={{ fontSize: '20px', color: '#1890ff' }} />}
                droppableId="lines"
                searchValue={searchValues.lines}
                onSearch={(value) => handleSearch('lines', value)}
              />
              <ListCard
                title="Station"
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
                title="Line Segment"
                data={getFilteredData(segments, searchValues.segments)}
                onAdd={handleAddItem}
                onMenuClick={handleMenuClick}
                icon={<FaRoute style={{ fontSize: '20px', color: '#52c41a' }} />}
                droppableId="segments"
                searchValue={searchValues.segments}
                onSearch={(value) => handleSearch('segments', value)}
              />
            </DragDropContext>
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
